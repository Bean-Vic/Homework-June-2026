import sqlite3
import pytest
from app import db
from app.schema import GarmentAttributes, UploadContext


@pytest.fixture
def conn():
    c = sqlite3.connect(":memory:")
    c.row_factory = sqlite3.Row
    db.init_db(c)
    return c


def _seed(conn, garment_type, country, year, desc="x"):
    return db.insert_image(
        conn,
        filename=f"{garment_type}.jpg",
        description=desc,
        attributes=GarmentAttributes(garment_type=garment_type, color_palette=["red"]),
        context=UploadContext(country=country, year=year, continent="Europe"),
    )


def test_insert_and_list_roundtrip(conn):
    _seed(conn, "dress", "Italy", 2024, desc="a red silk dress")
    rows = db.list_images(conn)
    assert len(rows) == 1
    assert rows[0]["attributes"]["garment_type"] == "dress"
    assert rows[0]["country"] == "Italy"
    assert rows[0]["attributes"]["color_palette"] == ["red"]


def test_filter_by_country_and_year(conn):
    _seed(conn, "dress", "Italy", 2024)
    _seed(conn, "coat", "France", 2023)
    _seed(conn, "coat", "Italy", 2023)
    assert len(db.list_images(conn, {"country": "Italy"})) == 2
    assert len(db.list_images(conn, {"year": 2023})) == 2
    assert len(db.list_images(conn, {"country": "Italy", "year": 2023})) == 1


def test_search_matches_description(conn):
    _seed(conn, "dress", "Italy", 2024, desc="embroidered neckline detail")
    _seed(conn, "coat", "France", 2023, desc="plain wool coat")
    hits = db.search_images(conn, "embroidered")
    assert len(hits) == 1
    assert hits[0]["attributes"]["garment_type"] == "dress"


def test_distinct_filter_values(conn):
    _seed(conn, "dress", "Italy", 2024)
    _seed(conn, "coat", "France", 2023)
    vals = db.distinct_filter_values(conn)
    assert set(vals["garment_type"]) == {"coat", "dress"}
    assert set(vals["country"]) == {"France", "Italy"}


def test_annotations_are_separate_and_searchable(conn):
    img_id = _seed(conn, "dress", "Italy", 2024, desc="plain dress")
    db.add_annotation(conn, img_id, "reminds me of 90s minimalism")
    rows = db.list_images(conn)
    assert rows[0]["annotations"] == ["reminds me of 90s minimalism"]
    assert len(db.search_images(conn, "minimalism")) == 1
