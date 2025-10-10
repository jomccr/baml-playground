
test walmart_10q_simple {
    functions [SearchDoc]
    args {
        query "Walmart U.S. net sales for the latest quarter"
        document {
            file "../0000104169-25-000137.pdf"
        }
    }

    // evals
    @@check( nonempty, {{ this.facts|length > 0 }} )
    @@check( correct_value, {{ this.facts[0].value == 120911000000 }} )

}






