class CalculatorRequest {
    equation string

    @@assert(contains_operation, {{ this|regex_match("[*-+/]") }} )
}

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

function NeedCalculator(message: string, facts: Fact[]) -> CalculatorRequest {
  client Gpt5Nano
  prompt #"
    Given a message, create an expression that best represents the user's
    request.  If you don't have to calculate anything, return null.
    Never give the answer or include the units. Always just raw numbers and
    a symbolic arithmetic operation (+, -, *, /)

    {{ ctx.output_format }}

    {{ _.role("user") }} {{ message }}
    {{ _.role("user") }} {{ facts }}
  "#
}

function SearchDoc(document: pdf, query: string) -> FilingInformation {
  client "openai-responses/gpt-5"
  prompt #"
    Extract the information from the document below.
    Always prefer to source a fact from within a table if possible.

    Info: {{query}}
    Document: {{document}}

    {{ ctx.output_format }}
  "#
}
