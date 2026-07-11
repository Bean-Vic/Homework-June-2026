import sqlite3
import pytest
from fastapi.testclient import TestClient
from app import db, main
from app.main import app, get_db
from app.schema import ClassificationResult, GarmentAttributes


class FakeClassifier:
    def classify(self, image_bytes, mime_type="image/jpeg"):
        return ClassificationResult(
            description="an embroidered linen dress from an artisan market",
            attributes=GarmentAttributes(garment_type="dress", material="linen",
                                         color_palette=["cream"], location_context="artisan market"),
        )


@pytest.fixture
def client(tmp_path, monkeypatch):
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    db.init_db(conn)
    app.dependency_overrides[get_db] = lambda: conn
    monkeypatch.setattr(main, "classifier", FakeClassifier())
    monkeypatch.setattr(main, "IMAGES_DIR", tmp_path)
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_upload_classify_filter_flow(client):
    with open("tests/fixtures/tiny.jpg", "rb") as f:
        res = client.post("/images",
                          files={"file": ("tiny.jpg", f, "image/jpeg")},
                          data={"country": "Portugal", "year": "2024"})
    assert res.status_code == 200
    created = res.json()
    assert created["attributes"]["garment_type"] == "dress"
    assert created["country"] == "Portugal"

    # filter finds it
    r = client.get("/images", params={"country": "Portugal"})
    assert len(r.json()["images"]) == 1

    # full-text search finds it by description
    r = client.get("/search", params={"q": "embroidered"})
    assert len(r.json()["images"]) == 1

    # annotation attaches and is searchable
    img_id = created["id"]
    client.post(f"/images/{img_id}/annotations", json={"text": "great neckline"})
    r = client.get("/search", params={"q": "neckline"})
    assert len(r.json()["images"]) == 1
