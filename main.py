import base64
import requests
import argparse
import os
from baml_py import Pdf
from baml_client.sync_client import b

import edgar
import tiktoken

edgar.set_identity("John McCrary (john.mccrary@numerator.com)")

"""
Edgar library documentation: https://edgartools.readthedocs.io/en/latest/guides/working-with-filing/
"""

def encode_file_to_base64(file_path: str) -> str:
    """Encode a file to base64 string from local path or URL."""
    if file_path.startswith(('http://', 'https://')):
        response = requests.get(file_path)
        response.raise_for_status()
        encoded = base64.b64encode(response.content)
        return encoded.decode('utf-8')
    else:
        with open(file_path, 'rb') as file:
            encoded = base64.b64encode(file.read())
            return encoded.decode('utf-8')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Search a PDF document for information')
    parser.add_argument('--prompt', required=True, help='Search prompt for the document (text or path to file)')
    parser.add_argument('--url', help='URL or path to the PDF document')
    parser.add_argument('--accno', help='SEC filing accession number')

    args = parser.parse_args()

    # Check if prompt is a file path, if so read its contents
    if os.path.isfile(args.prompt):
        with open(args.prompt, 'r') as f:
            prompt = f.read().strip()
    else:
        prompt = args.prompt

    # Handle either PDF URL or filing accession number
    if args.accno:
        filing = edgar.get_by_accession_number(args.accno)
        print(filing)
        document = filing.text()
        encoding = tiktoken.get_encoding("o200k_base")
        token_count = len(encoding.encode(document))
        print(f"Filing text loaded ({len(document)} characters, approximately {token_count} tokens)")
    else:
        if not args.url:
            raise ValueError("Either --url or --accno must be provided")
        document = Pdf.from_base64(encode_file_to_base64(args.url)) # TODO: calculate tokens
        print("PDF Document loaded")

    print("Searching document...")
    result = b.SearchDoc(document=document, query=prompt)

    print("Initial search results:")
    print(result.model_dump_json(indent=2))

    if len(result.facts) > 1:
        print("More than one fact found, double-checking the LLM's math...")
        request = b.NeedCalculator(
            message=prompt,
            facts=result.facts
        )

        print("Request for calculator:")
        print(request.model_dump_json(indent=2))

        from sympy.parsing.mathematica import parse_mathematica

        print("Thinking...")
        derivation = parse_mathematica(request.equation)
        result.derivation = round(float(derivation.doit()))

        print("Final derivation:")
        print(result.model_dump_json(indent=2))
