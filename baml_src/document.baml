class Fact {
  value int @description(#"
    If the value is in currency, round to the nearest whole dollar. For example, always expand "$12.8 millions" to 12800000 "USD"
  "#)
  units string
  start_date string
  end_date string?
  location string? @description(#"
    A plain text description of where this fact can be found on the PDF
  "#)
}

class FilingInformation {
  company string
  description string
  equation string? @description(#"
    If the query requires a calculation across multiple facts, provide a Mathematica-format expression using only raw numbers and arithmetic operations (+, -, *, /). Never include units or the final answer. Example: "12800000 - 8500000"
  "#)
  derivation int? @description(#"
    If asked for multi-fact calculation, put the *final calculation* here in whole USD
  "#)
  facts Fact[] @description(#"
    If asked for a multi-fact calculation, put the *base facts* here
  "#)
}

function Extract(document: pdf, query: string) -> FilingInformation {
  client Gemini
  prompt #"
    Extract the information from the document below.
    Always prefer to source a fact from within a table if possible.

    If the query requires calculating across multiple facts:
    1. Extract all the base facts needed
    2. Create a Mathematica-format expression using ONLY raw numbers and arithmetic operators (+, -, *, /)
    3. Never include units or the final answer in the equation
    4. Example equation format: "12800000 - 8500000" or "15000000 + 3200000"

    Info: {{query}}
    Document: {{document}}

    {{ ctx.output_format }}
  "#
}
