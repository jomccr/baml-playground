
test walmart_10q_complex {
    functions [SearchDoc]
    args {
        query "Walmart U.S. net sales for the latest quarter less Fuel sales from the latest quarter"
        document {
            url "https://stock.walmart.com/sec-filings/all-sec-filings/content/0000104169-25-000137/0000104169-25-000137.pdf"
        }
    }

    @@check( nonempty, {{ this.facts|length > 0 }} )
    @@check( correct_value, {{ this.facts[0].value == 120911000000 }} )

}

test walmart_10q_simple {
    functions [SearchDoc]
    args {
        query "Walmart U.S. net sales for the latest quarter"
        document {
            url "https://stock.walmart.com/sec-filings/all-sec-filings/content/0000104169-25-000137/0000104169-25-000137.pdf"
        }
    }

    @@check( nonempty, {{ this.facts|length > 0 }} )
    @@check( correct_value, {{ this.facts[0].value == 120911000000 }} )

}

test samsclub_10k_simple {
    functions [SearchDoc]
    args {
        query "Sams Club U.S. net sales for the latest year"
        document {
            url "https://stock.walmart.com/sec-filings/all-sec-filings/content/0000104169-25-000021/0000104169-25-000021.pdf"
        }
    }

    @@check( nonempty, {{ this.facts|length > 0 }} )
    @@check( correct_value, {{ this.facts[0].value == 90238000000 }} )
}
