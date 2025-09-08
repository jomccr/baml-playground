
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
  derivation Fact? @description(#"
    If asked for multi-fact calculation, put the *final calculation* here
  "#)
  facts Fact[] @description(#"
    If asked for a multi-fact calculation, put the *base facts* here
  "#)
}

class CalculatorAPI {
  intent "basic_calculator"
  operation "add" | "subtract" | "multiply" | "divide"
  numbers float[]
}

function RequestCalculation(message: string) -> CalculatorAPI {
  client Gemini
  prompt #"
    Given a message, extract info.
    {{ ctx.output_format }}
    {{ _.role("user") }} {{ message }}
  "#
}

function SearchDoc(document: pdf, info: string) -> FilingInformation {
  client Gemini
  prompt #"
    Extract the information from the document below.

    Info: {{info}}
    Document: {{document}}

    Respond in well-formatted json
    {{ ctx.output_format }}
  "#
}
