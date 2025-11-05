# BAML Test Implementation

A simple example demonstrating the BAML programming language for structured LLM outputs.

## Blog Post

For a detailed walkthrough of this implementation, check out the blog post:
[Tool calls with BAML](https://ouachitalabs.com/blog/posts/baml-tools.html)

## Overview

We demonstrate how to easily pull structured data out of a semi-structured document (an SEC 10-Q).

## Getting Started

1. Clone the repository
2. Install repository with `uv sync`
3. Set up environment variables (see below)
4. Run the example with `uv run main.py "<query>" --url <pdf-url>`

## Environment Variables

The following environment variables are required to run this project:

- **`GEMINI_API_KEY`** (Required): API key for Google's Gemini model, used for document search and extraction
- **`OPENAI_API_KEY`** (Optional): API key for OpenAI's GPT models, only needed when the query requires calculations across multiple facts

Create a `.env` file in the project root with these variables:

```bash
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key  # Optional
```

## Usage

```bash
uv run main.py "your search query" --url "path/to/document.pdf"
```

Example:
```bash
uv run main.py "What was the revenue in Q1 2024?" --url "https://example.com/10q.pdf"
```

## Author

Created by [Ouachita Labs](https://ouachitalabs.com)
