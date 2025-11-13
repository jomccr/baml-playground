#!/usr/bin/env python3
"""Back-test BAML extraction against calibration admin trendability factors."""

import argparse
import os
from pathlib import Path

import edgar
import requests
from dotenv import load_dotenv
from sympy.parsing.mathematica import parse_mathematica

from baml_client.sync_client import b

TRENDABILITY_URL = "https://calibration-admin-prd.dsml.numerator.cloud/api/tcc/v1/trendability_factor/"

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--ticker", required=True)
    parser.add_argument("--count", type=int, required=True)
    parser.add_argument("--grouping", required=True)
    parser.add_argument("--prompt", required=True, help="Path to prompt file")
    args = parser.parse_args()

    # Load environment and set edgar identity
    load_dotenv()
    edgar_identity = os.getenv("BENCHMARK_EDGAR_IDENTITY")
    edgar.set_identity(edgar_identity)

    # Read prompt from file
    prompt = Path(args.prompt).read_text().strip()

    # Fetch recent 10-Q filings
    company = edgar.Company(args.ticker)
    filings = list(company.get_filings(form="10-Q").to_dict())
    filings.sort(key=lambda f: f.get("reportDate", ""), reverse=True)
    filings = filings[:args.count]

    # Fetch trendability records
    params = {
        "state": "Active",
        "grouping_name": args.grouping,
        "datasourceName": "Financial Reports",
        "number_of_records_returned": args.count,
    }
    response = requests.get(TRENDABILITY_URL, params=params, timeout=30)
    response.raise_for_status()
    records = response.json()["records"]
    records.sort(key=lambda r: r["end_date"], reverse=True)

    # Process each filing
    print(f"\nResults for {args.ticker} - {args.grouping}:\n")
    results = []

    # Create a mapping of end_date to record for easy lookup
    records_by_date = {r["end_date"]: r for r in records}

    for filing in filings:
        # Find matching record by report date
        report_date = filing.get("reportDate", "unknown")
        record = records_by_date.get(report_date)
        accession = filing["accession_number"]

        # Get filing text
        filing_obj = edgar.get_by_accession_number(accession)
        document = filing_obj.text()
        filing_url = filing_obj.url

        # Extract using BAML
        result = b.SearchDoc(document=document, query=prompt)

        # If multiple facts, use calculator
        if len(result.facts) > 1:
            calc_request = b.NeedCalculator(message=prompt, facts=result.facts)
            derivation = parse_mathematica(calc_request.equation)
            result.derivation = round(float(derivation.doit()))

        # Get extracted value
        extracted = result.derivation if result.derivation else (result.facts[0].value if result.facts else None)
        calibration = record.get("sales_target") if record else None

        # Compare
        diff = extracted - calibration if (extracted and calibration) else None
        match = "✓" if diff is not None and abs(diff) < 1 else "✗"

        print(f"{match} {report_date} | {accession}")
        print(f"  URL: {filing_url}")
        print(f"  Extracted: {extracted:,.0f}" if extracted else "  Extracted: None")
        print(f"  Calibration: {calibration:,.0f}" if calibration else "  Calibration: None")
        if not record:
            print(f"  Warning: No matching trendability record found for {report_date}")
        if diff is not None:
            print(f"  Difference: {diff:,.0f}")
        if record:
            print(f"  Trendability Link: https://calibration-admin-prd.dsml.numerator.cloud/tcc/trendabilityFactor/{record['id']}")
        print()

        results.append((match, report_date, accession, filing_url, extracted, calibration, diff, record))

    # Final summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60 + "\n")
    for match, report_date, accession, filing_url, extracted, calibration, diff, record in results:
        print(f"{match} {report_date} | {accession}")
        print(f"  URL: {filing_url}")
        print(f"  Extracted: {extracted:,.0f}" if extracted else "  Extracted: None")
        print(f"  Calibration: {calibration:,.0f}" if calibration else "  Calibration: None")
        if not record:
            print(f"  Warning: No matching trendability record")
        if diff is not None:
            print(f"  Difference: {diff:,.0f}")
        if record:
            print(f"  Trendability Link: https://calibration-admin-prd.dsml.numerator.cloud/tcc/trendabilityFactor/{record['id']}")
        print()

if __name__ == "__main__":
    main()
