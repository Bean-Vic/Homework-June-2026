import pytest
from app.classifier import parse_model_output


CLEAN = '{"description": "red silk dress", "attributes": {"garment_type": "dress", "color_palette": ["red"]}}'
FENCED = "```json\n" + CLEAN + "\n```"
PARTIAL = '{"description": "a coat"}'


def test_parses_clean_json():
    r = parse_model_output(CLEAN)
    assert r.description == "red silk dress"
    assert r.attributes.garment_type == "dress"
    assert r.attributes.color_palette == ["red"]


def test_parses_fenced_json():
    r = parse_model_output(FENCED)
    assert r.attributes.garment_type == "dress"


def test_missing_fields_use_defaults():
    r = parse_model_output(PARTIAL)
    assert r.description == "a coat"
    assert r.attributes.garment_type is None
    assert r.attributes.color_palette == []


def test_garbage_raises():
    with pytest.raises(ValueError):
        parse_model_output("not json at all")
