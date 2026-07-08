"""Manual check: send one real image to OpenAI and confirm parseable JSON.

Requires OPENAI_API_KEY in the environment / .env. Not part of the pytest suite.
Usage: python scripts/check_openai_json.py scripts/sample.jpg
"""
import sys
from pathlib import Path
from dotenv import load_dotenv
from app.classifier import get_classifier

load_dotenv()


def main() -> int:
    path = Path(sys.argv[1] if len(sys.argv) > 1 else "scripts/sample.jpg")
    image_bytes = path.read_bytes()
    result = get_classifier().classify(image_bytes)
    print("OK — parsed ClassificationResult:")
    print(result.model_dump_json(indent=2))
    assert isinstance(result.description, str)
    assert result.attributes is not None
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
