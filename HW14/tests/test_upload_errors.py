"""Regression tests for upload failures found in live use.

1. The real get_db dependency opens the SQLite connection in a threadpool
   thread while the async upload endpoint runs on the event loop thread —
   without check_same_thread=False every real upload crashed.
2. GPT-4o can refuse featureless images (content=None) — that must surface
   as a clear 4xx with a message, not a 500.
"""
import pytest
from fastapi.testclient import TestClient
from app import main
from app.main import app
from app.schema import ClassificationResult, GarmentAttributes


class FakeClassifier:
    def classify(self, image_bytes, mime_type="image/jpeg"):
        return ClassificationResult(
            description="a plain test dress",
            attributes=GarmentAttributes(garment_type="dress"),
        )


class RefusingClassifier:
    def classify(self, image_bytes, mime_type="image/jpeg"):
        raise ValueError("The model refused: I can't determine details from the image.")


def test_upload_works_through_real_db_dependency(tmp_path, monkeypatch):
    # NO dependency_overrides here: exercises the real get_db(), which runs in
    # a different thread than the async endpoint (the production code path).
    monkeypatch.setattr(main, "DB_PATH", str(tmp_path / "app.db"))
    monkeypatch.setattr(main, "IMAGES_DIR", tmp_path)
    monkeypatch.setattr(main, "classifier", FakeClassifier())
    client = TestClient(app)
    with open("tests/fixtures/tiny.jpg", "rb") as f:
        r = client.post("/images", files={"file": ("tiny.jpg", f, "image/jpeg")},
                        data={"country": "Portugal"})
    assert r.status_code == 200
    assert r.json()["attributes"]["garment_type"] == "dress"


def test_refusal_returns_422_with_detail(tmp_path, monkeypatch):
    monkeypatch.setattr(main, "DB_PATH", str(tmp_path / "app.db"))
    monkeypatch.setattr(main, "IMAGES_DIR", tmp_path)
    monkeypatch.setattr(main, "classifier", RefusingClassifier())
    client = TestClient(app)
    with open("tests/fixtures/tiny.jpg", "rb") as f:
        r = client.post("/images", files={"file": ("tiny.jpg", f, "image/jpeg")})
    assert r.status_code == 422
    assert "refused" in r.json()["detail"]
