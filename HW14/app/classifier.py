import json
import re
from app.schema import ClassificationResult, GarmentAttributes

_FENCE = re.compile(r"^\s*```(?:json)?\s*|\s*```\s*$", re.IGNORECASE)


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
