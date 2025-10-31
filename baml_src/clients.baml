client<llm> Gpt5 {
  provider openai-responses
  options {
    model "gpt-5"
    api_key env.BENCHMARK_OPENAI_API_KEY
  }
}

client<llm> Gemini {
  provider google-ai
  options {
    model "gemini-2.5-pro"
    api_key env.GEMINI_API_KEY
  }
}

client<llm> Lmstudio {
  provider openai-generic
  options {
    model "google/gemma-3-4b"
    base_url "http://localhost:1234/v1"
  }
}
