import base64
import json
import os
import re
from typing import Protocol

from openai import OpenAI

from app.schema import ClassificationResult, GarmentAttributes

_FENCE = re.compile(r"^\s*```(?:json)?\s*|\s*```\s*$", re.IGNORECASE)

CLASSIFY_PROMPT = """You are a fashion garment classifier.
Look at the image and respond with ONLY a JSON object, no prose, matching:
{
  "description": "<rich natural-language paragraph describing the garment>",
  "attributes": {
    "garment_type": "", "style": "", "material": "",
    "color_palette": ["", ""], "pattern": "", "season": "",
    "occasion": "", "consumer_profile": "", "trend_notes": "",
    "location_context": "<loose cue like 'artisan market' or 'urban street', or null>"
  }
}
Use null for anything you cannot determine. Do not invent a specific city or date."""


def parse_model_output(raw_text: str) -> ClassificationResult:
    """Parse a raw model response into a ClassificationResult.

    Tolerates markdown code fences and missing fields. Raises ValueError
    if the payload is not valid JSON.
    """
    cleaned = _FENCE.sub("", raw_text.strip())
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Model output was not valid JSON: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("Model output JSON must be an object")
    attributes = GarmentAttributes(**(data.get("attributes") or {}))
    return ClassificationResult(
        description=data.get("description", "") or "",
        attributes=attributes,
    )


class Classifier(Protocol):
    def classify(self, image_bytes: bytes, mime_type: str = "image/jpeg") -> ClassificationResult:
        ...


class OpenAIClassifier:
    def __init__(self, client: OpenAI | None = None, model: str | None = None):
        self._client = client or OpenAI()
        self._model = model or os.environ.get("OPENAI_MODEL", "gpt-4o")

    def classify(self, image_bytes: bytes, mime_type: str = "image/jpeg") -> ClassificationResult:
        b64 = base64.b64encode(image_bytes).decode("ascii")
        resp = self._client.chat.completions.create(
            model=self._model,
            response_format={"type": "json_object"},
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": CLASSIFY_PROMPT},
                    {"type": "image_url",
                     "image_url": {"url": f"data:{mime_type};base64,{b64}"}},
                ],
            }],
        )
        return parse_model_output(resp.choices[0].message.content or "")


def get_classifier() -> Classifier:
    return OpenAIClassifier()
