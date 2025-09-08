
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
  derivation int? @description(#"
    If asked for multi-fact calculation, put the *final calculation* here in whole USD
  "#)
  facts Fact[] @description(#"
    If asked for a multi-fact calculation, put the *base facts* here
  "#)
}

function SearchDoc(document: pdf, query: string) -> FilingInformation {
  client Gemini
  prompt #"
    Extract the information from the document below.
    Always prefer to source a fact from within a table if possible.

    Info: {{query}}
    Document: {{document}}

    {{ ctx.output_format }}
  "#
}
