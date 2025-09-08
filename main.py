import base64
import requests
import argparse
from baml_py import Pdf
from baml_client.sync_client import b

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
  parser.add_argument('query', help='Search query for the document')
  parser.add_argument('--url', required=True, help='URL or path to the PDF document')

  args = parser.parse_args()

  while True:
    # Create a Pdf object from URL or file path
    pdf = Pdf.from_base64(encode_file_to_base64(args.url))

    # Search the document
    result = b.SearchDoc(document=pdf, query=args.query)

    # Print the result
    print(result.model_dump_json(indent=2))
