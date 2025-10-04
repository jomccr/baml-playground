// very large filing, 102 pages
test samsclub_10k_simple {
    functions [SearchDoc]
    args {
        query "Sams Club U.S. net sales for the latest year"
        document {
            file "../walmart-10k.pdf"
        }
    }

    @@check( nonempty, {{ this.facts|length > 0 }} )
    @@check( correct_value, {{ this.facts[0].value == 90238000000 }} )
}
