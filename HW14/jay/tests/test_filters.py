import sqlite3
import pytest
from fastapi.testclient import TestClient
from app import db
from app.main import app, get_db
from app.schema import GarmentAttributes, UploadContext


@pytest.fixture
def client():
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    db.init_db(conn)
    # seed rows directly through the db layer
    db.insert_image(conn, filename="a.jpg", description="silk dress",
                    attributes=GarmentAttributes(garment_type="dress"),
                    context=UploadContext(country="Italy", year=2024, continent="Europe"))
    db.insert_image(conn, filename="b.jpg", description="wool coat",
                    attributes=GarmentAttributes(garment_type="coat"),
                    context=UploadContext(country="France", year=2023, continent="Europe"))
    db.insert_image(conn, filename="c.jpg", description="linen coat",
                    attributes=GarmentAttributes(garment_type="coat"),
                    context=UploadContext(country="Italy", year=2023, continent="Europe"))
    app.dependency_overrides[get_db] = lambda: conn
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_filter_by_country(client):
    r = client.get("/images", params={"country": "Italy"})
    assert r.status_code == 200
    assert len(r.json()["images"]) == 2


def test_filter_by_year(client):
    r = client.get("/images", params={"year": 2023})
    assert len(r.json()["images"]) == 2


def test_filter_by_country_and_year(client):
    r = client.get("/images", params={"country": "Italy", "year": 2023})
    assert len(r.json()["images"]) == 1
    assert r.json()["images"][0]["attributes"]["garment_type"] == "coat"


def test_filters_endpoint_is_dynamic(client):
    vals = client.get("/filters").json()
    assert set(vals["country"]) == {"France", "Italy"}
    assert set(vals["garment_type"]) == {"coat", "dress"}


def test_search_endpoint(client):
    r = client.get("/search", params={"q": "silk"})
    assert len(r.json()["images"]) == 1
