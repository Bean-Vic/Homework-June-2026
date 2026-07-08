# Fashion Garment Classification & Inspiration Web App — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local FastAPI web app where designers upload garment photos, GPT-4o vision classifies them into a description + structured attributes, and the library is searchable, filterable, and annotatable.

**Architecture:** One FastAPI process serves a JSON API and a static frontend. Uploads are saved to disk; metadata lives in SQLite. Classification goes through a small `Classifier` interface with an OpenAI GPT-4o implementation, so the model is swappable and can be mocked in tests. Structured output is parsed by an isolated `parse_model_output` function that tolerates messy model responses.

**Tech Stack:** Python 3.14, FastAPI, Uvicorn, Pydantic v2, OpenAI Python SDK, SQLite (stdlib `sqlite3`), pytest, `httpx`/FastAPI `TestClient`.

## Global Constraints

- Runs locally with minimal setup: `pip install -r requirements.txt`, then one `uvicorn app.main:app` command.
- Secrets via environment: `OPENAI_API_KEY` read from env / `.env`; never committed. `.env.example` documents required vars.
- Repository layout is fixed by the assignment: `/app`, `/eval`, `/tests`, `README.md` at `HW14/` root.
- `app/data/` (images + `app.db`) is gitignored; never commit uploads or the DB.
- Filter options are generated dynamically from DB data, never hardcoded.
- Designer annotations are stored separately from AI output and clearly distinguished.
- Location / time / designer are user-provided at upload; the model infers fashion attributes + a loose `location_context` cue only.
- Tests must not hit the real OpenAI API: the classifier is mocked everywhere except `eval/evaluate.py` and the one explicit live JSON check in Task 4.
- All commands are run from the `HW14/` directory. All paths below are relative to `HW14/`.

---

### Task 1: Project scaffold & configuration

**Files:**
- Create: `requirements.txt`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `app/__init__.py` (empty)
- Create: `tests/__init__.py` (empty)
- Create: `app/data/.gitkeep` (empty), `app/data/images/.gitkeep` (empty)

**Interfaces:**
- Consumes: nothing.
- Produces: an installable environment. Later tasks assume `app` and `tests` are importable packages and that `pytest` runs from `HW14/`.

- [ ] **Step 1: Create `requirements.txt`**

```
fastapi==0.115.6
uvicorn==0.34.0
pydantic==2.10.4
python-multipart==0.0.20
openai==1.59.6
python-dotenv==1.0.1
pytest==8.3.4
httpx==0.28.1
Pillow==11.1.0
```

- [ ] **Step 2: Create `.env.example`**

```
# Copy to .env and fill in. .env is gitignored.
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o
```

- [ ] **Step 3: Create `.gitignore`**

```
__pycache__/
*.pyc
.env
.venv/
venv/
app/data/images/*
!app/data/images/.gitkeep
app/data/app.db
.pytest_cache/
```

- [ ] **Step 4: Create empty package/keep files**

```bash
touch app/__init__.py tests/__init__.py app/data/.gitkeep app/data/images/.gitkeep
```

- [ ] **Step 5: Install and verify**

Run: `python -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt`
Expected: installs without error. `python -c "import fastapi, openai, pydantic; print('ok')"` prints `ok`.

- [ ] **Step 6: Commit**

```bash
git add requirements.txt .env.example .gitignore app tests
git commit -m "hw14 scaffold"
```

---

### Task 2: Attribute & record schema

**Files:**
- Create: `app/schema.py`
- Test: `tests/test_schema.py`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `GarmentAttributes` (Pydantic model): `garment_type, style, material, pattern, season, occasion, consumer_profile, trend_notes, location_context` (all `Optional[str] = None`); `color_palette: list[str] = []`.
  - `ClassificationResult` (Pydantic model): `description: str = ""`, `attributes: GarmentAttributes`.
  - `UploadContext` (Pydantic model): `continent, country, city, season, designer` (`Optional[str] = None`); `year: Optional[int] = None`; `month: Optional[int] = None`.

- [ ] **Step 1: Write the failing test**

```python
# tests/test_schema.py
from app.schema import GarmentAttributes, ClassificationResult, UploadContext


def test_garment_attributes_defaults():
    a = GarmentAttributes()
    assert a.garment_type is None
    assert a.color_palette == []


def test_classification_result_nests_attributes():
    r = ClassificationResult(description="a red dress", attributes=GarmentAttributes(garment_type="dress"))
    assert r.description == "a red dress"
    assert r.attributes.garment_type == "dress"


def test_upload_context_types():
    c = UploadContext(country="Italy", year=2024, month=6)
    assert c.country == "Italy"
    assert c.year == 2024
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_schema.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'app.schema'`.

- [ ] **Step 3: Write minimal implementation**

```python
# app/schema.py
from typing import Optional
from pydantic import BaseModel, Field


class GarmentAttributes(BaseModel):
    garment_type: Optional[str] = None
    style: Optional[str] = None
    material: Optional[str] = None
    color_palette: list[str] = Field(default_factory=list)
    pattern: Optional[str] = None
    season: Optional[str] = None
    occasion: Optional[str] = None
    consumer_profile: Optional[str] = None
    trend_notes: Optional[str] = None
    location_context: Optional[str] = None


class ClassificationResult(BaseModel):
    description: str = ""
    attributes: GarmentAttributes = Field(default_factory=GarmentAttributes)


class UploadContext(BaseModel):
    continent: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    year: Optional[int] = None
    month: Optional[int] = None
    season: Optional[str] = None
    designer: Optional[str] = None
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_schema.py -v`
Expected: PASS (3 passed).

- [ ] **Step 5: Commit**

```bash
git add app/schema.py tests/test_schema.py
git commit -m "hw14 schema"
```

---

### Task 3: Model-output parsing (the required unit test)

**Files:**
- Create: `app/classifier.py` (parsing portion only)
- Test: `tests/test_parsing.py`

**Interfaces:**
- Consumes: `ClassificationResult`, `GarmentAttributes` from `app.schema`.
- Produces: `parse_model_output(raw_text: str) -> ClassificationResult`. Tolerates: (a) clean JSON, (b) JSON wrapped in ```` ```json ... ``` ```` fences, (c) missing keys → defaults. Raises `ValueError` on non-JSON garbage.

- [ ] **Step 1: Write the failing test**

```python
# tests/test_parsing.py
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_parsing.py -v`
Expected: FAIL — `ImportError: cannot import name 'parse_model_output'`.

- [ ] **Step 3: Write minimal implementation**

```python
# app/classifier.py
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_parsing.py -v`
Expected: PASS (4 passed).

- [ ] **Step 5: Commit**

```bash
git add app/classifier.py tests/test_parsing.py
git commit -m "hw14 parse model output + unit test"
```

---

### Task 4: OpenAI classifier + live JSON verification (user priority)

**Files:**
- Modify: `app/classifier.py` (add `Classifier` protocol + `OpenAIClassifier` + factory)
- Create: `scripts/check_openai_json.py`
- Create: `scripts/sample.jpg` (any one small garment photo — download manually)

**Interfaces:**
- Consumes: `parse_model_output`, `ClassificationResult` from this module; `OPENAI_API_KEY`, `OPENAI_MODEL` from env.
- Produces:
  - `class Classifier(Protocol)` with `def classify(self, image_bytes: bytes, mime_type: str = "image/jpeg") -> ClassificationResult`.
  - `class OpenAIClassifier` implementing it.
  - `def get_classifier() -> Classifier` factory returning an `OpenAIClassifier`.
  - `CLASSIFY_PROMPT: str`.

This task's automated deliverable is the code; the JSON guarantee is confirmed by a **manual live run** (Step 4) that requires a real API key and is not part of the pytest suite.

- [ ] **Step 1: Add the classifier interface and OpenAI implementation**

Append to `app/classifier.py`:

```python
import base64
import os
from typing import Protocol

from openai import OpenAI

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
```

- [ ] **Step 2: Write the live verification script**

```python
# scripts/check_openai_json.py
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
```

- [ ] **Step 3: Add a sample image**

Download one small garment/fashion photo from https://www.pexels.com/search/fashion/ and save it as `scripts/sample.jpg`.

- [ ] **Step 4: Run the live check (needs API key)**

Run: `cp .env.example .env` then edit `.env` to add your real key, then `python scripts/check_openai_json.py scripts/sample.jpg`
Expected: prints `OK — parsed ClassificationResult:` followed by indented JSON with a non-empty `description` and populated `attributes`. This confirms the model returns JSON we can parse — the milestone you asked to hit first.

- [ ] **Step 5: Confirm the unit tests still pass**

Run: `pytest tests/test_parsing.py tests/test_schema.py -v`
Expected: PASS (no regressions; these do not call the API).

- [ ] **Step 6: Commit**

```bash
git add app/classifier.py scripts/check_openai_json.py scripts/sample.jpg
git commit -m "hw14 openai classifier + live json check"
```

---

### Task 5: SQLite persistence layer

**Files:**
- Create: `app/db.py`
- Test: `tests/test_db.py`

**Interfaces:**
- Consumes: `GarmentAttributes`, `UploadContext` from `app.schema`.
- Produces (all take an explicit `sqlite3.Connection` as first arg so tests can use in-memory DBs):
  - `init_db(conn) -> None` — create `images` and `annotations` tables.
  - `insert_image(conn, *, filename, description, attributes: GarmentAttributes, context: UploadContext) -> int` — returns new image id.
  - `list_images(conn, filters: dict | None = None) -> list[dict]` — filters keyed by column (`garment_type`, `country`, `year`, …); values matched with equality (case-insensitive for text).
  - `search_images(conn, query: str) -> list[dict]` — substring match over `description` and joined annotation text.
  - `distinct_filter_values(conn) -> dict[str, list]` — for each filterable column, its distinct non-null values.
  - `add_annotation(conn, image_id: int, text: str) -> int`.
  - `get_connection(path: str) -> sqlite3.Connection` — opens with `row_factory = sqlite3.Row`.
- Each image row is returned as a dict with keys: `id, filename, description, attributes` (parsed from JSON to dict), `continent, country, city, year, month, season, designer, annotations` (list of strings).

- [ ] **Step 1: Write the failing test**

```python
# tests/test_db.py
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_db.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'app.db'`.

- [ ] **Step 3: Write minimal implementation**

```python
# app/db.py
import json
import sqlite3
from app.schema import GarmentAttributes, UploadContext

CONTEXT_COLUMNS = ["continent", "country", "city", "year", "month", "season", "designer"]
FILTER_COLUMNS = ["garment_type", "style", "material", "pattern", "occasion",
                  "consumer_profile"] + CONTEXT_COLUMNS
_TEXT_ATTR = {"garment_type", "style", "material", "pattern", "occasion", "consumer_profile"}


def get_connection(path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            description TEXT DEFAULT '',
            attributes TEXT NOT NULL,
            garment_type TEXT, style TEXT, material TEXT, pattern TEXT,
            occasion TEXT, consumer_profile TEXT,
            continent TEXT, country TEXT, city TEXT,
            year INTEGER, month INTEGER, season TEXT, designer TEXT
        );
        CREATE TABLE IF NOT EXISTS annotations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id INTEGER NOT NULL REFERENCES images(id),
            text TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        """
    )
    conn.commit()


def insert_image(conn, *, filename, description, attributes: GarmentAttributes,
                 context: UploadContext) -> int:
    a = attributes.model_dump()
    c = context.model_dump()
    cur = conn.execute(
        """INSERT INTO images
           (filename, description, attributes, garment_type, style, material,
            pattern, occasion, consumer_profile, continent, country, city,
            year, month, season, designer)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        (filename, description, json.dumps(a),
         a.get("garment_type"), a.get("style"), a.get("material"),
         a.get("pattern"), a.get("occasion"), a.get("consumer_profile"),
         c.get("continent"), c.get("country"), c.get("city"),
         c.get("year"), c.get("month"), c.get("season"), c.get("designer")),
    )
    conn.commit()
    return cur.lastrowid


def _row_to_dict(conn, row: sqlite3.Row) -> dict:
    d = dict(row)
    d["attributes"] = json.loads(d["attributes"])
    ann = conn.execute(
        "SELECT text FROM annotations WHERE image_id = ? ORDER BY id", (d["id"],)
    ).fetchall()
    d["annotations"] = [r["text"] for r in ann]
    return d


def list_images(conn, filters: dict | None = None) -> list[dict]:
    sql = "SELECT * FROM images"
    params: list = []
    if filters:
        clauses = []
        for key, value in filters.items():
            if key not in FILTER_COLUMNS or value in (None, ""):
                continue
            if key in _TEXT_ATTR or key in ("continent", "country", "city", "season", "designer"):
                clauses.append(f"LOWER({key}) = LOWER(?)")
            else:
                clauses.append(f"{key} = ?")
            params.append(value)
        if clauses:
            sql += " WHERE " + " AND ".join(clauses)
    sql += " ORDER BY id DESC"
    rows = conn.execute(sql, params).fetchall()
    return [_row_to_dict(conn, r) for r in rows]


def search_images(conn, query: str) -> list[dict]:
    like = f"%{query}%"
    rows = conn.execute(
        """SELECT DISTINCT i.* FROM images i
           LEFT JOIN annotations an ON an.image_id = i.id
           WHERE i.description LIKE ? OR an.text LIKE ?
           ORDER BY i.id DESC""",
        (like, like),
    ).fetchall()
    return [_row_to_dict(conn, r) for r in rows]


def distinct_filter_values(conn) -> dict[str, list]:
    out: dict[str, list] = {}
    for col in FILTER_COLUMNS:
        rows = conn.execute(
            f"SELECT DISTINCT {col} AS v FROM images WHERE {col} IS NOT NULL AND {col} != '' ORDER BY v"
        ).fetchall()
        out[col] = [r["v"] for r in rows]
    return out


def add_annotation(conn, image_id: int, text: str) -> int:
    cur = conn.execute(
        "INSERT INTO annotations (image_id, text) VALUES (?, ?)", (image_id, text)
    )
    conn.commit()
    return cur.lastrowid
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_db.py -v`
Expected: PASS (5 passed).

- [ ] **Step 5: Commit**

```bash
git add app/db.py tests/test_db.py
git commit -m "hw14 sqlite layer"
```

---

### Task 6: FastAPI app, endpoints & the required integration test

**Files:**
- Create: `app/main.py`
- Test: `tests/test_filters.py`

**Interfaces:**
- Consumes: `app.db`, `app.schema`, `get_classifier` from `app.classifier`.
- Produces a FastAPI `app` with:
  - `POST /images` — multipart form: `file` (UploadFile) + optional `continent, country, city, season, designer` (str), `year, month` (int). Saves file, classifies, merges, inserts. Returns the created image dict.
  - `GET /images` — query params matching `FILTER_COLUMNS`; returns `{"images": [...]}`.
  - `GET /filters` — returns `distinct_filter_values`.
  - `GET /search?q=` — returns `{"images": [...]}`.
  - `POST /images/{id}/annotations` — JSON body `{"text": "..."}`; returns the updated image dict.
  - `GET /` and static mount at `/static` serving `app/static/`.
  - Dependency `get_db()` yields a connection to `app/data/app.db`; overridable in tests.
  - Module-level `classifier` obtained from `get_classifier()`, overridable in tests via `app.dependency_overrides` / attribute injection.

- [ ] **Step 1: Write the failing integration test**

```python
# tests/test_filters.py
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_filters.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'app.main'`.

- [ ] **Step 3: Write minimal implementation**

```python
# app/main.py
import os
import uuid
from pathlib import Path

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app import db
from app.classifier import get_classifier
from app.schema import UploadContext

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
IMAGES_DIR = DATA_DIR / "images"
DB_PATH = str(DATA_DIR / "app.db")
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Fashion Inspiration Library")
classifier = get_classifier()


def get_db():
    conn = db.get_connection(DB_PATH)
    db.init_db(conn)
    try:
        yield conn
    finally:
        conn.close()


class AnnotationIn(BaseModel):
    text: str


@app.post("/images")
async def upload_image(
    file: UploadFile = File(...),
    continent: str | None = Form(None),
    country: str | None = Form(None),
    city: str | None = Form(None),
    year: int | None = Form(None),
    month: int | None = Form(None),
    season: str | None = Form(None),
    designer: str | None = Form(None),
    conn=Depends(get_db),
):
    content = await file.read()
    ext = Path(file.filename or "upload.jpg").suffix or ".jpg"
    stored_name = f"{uuid.uuid4().hex}{ext}"
    (IMAGES_DIR / stored_name).write_bytes(content)

    result = classifier.classify(content, mime_type=file.content_type or "image/jpeg")
    context = UploadContext(continent=continent, country=country, city=city,
                            year=year, month=month, season=season, designer=designer)
    image_id = db.insert_image(conn, filename=stored_name, description=result.description,
                               attributes=result.attributes, context=context)
    return _one(conn, image_id)


@app.get("/images")
def get_images(conn=Depends(get_db), **_):
    # FastAPI can't bind **kwargs; read filters from a fixed set below.
    raise NotImplementedError  # replaced in Step 3b


@app.get("/filters")
def get_filters(conn=Depends(get_db)):
    return db.distinct_filter_values(conn)


@app.get("/search")
def search(q: str = "", conn=Depends(get_db)):
    return {"images": db.search_images(conn, q)}


@app.post("/images/{image_id}/annotations")
def annotate(image_id: int, body: AnnotationIn, conn=Depends(get_db)):
    row = conn.execute("SELECT id FROM images WHERE id = ?", (image_id,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="image not found")
    db.add_annotation(conn, image_id, body.text)
    return _one(conn, image_id)


@app.get("/")
def index():
    return FileResponse(BASE_DIR / "static" / "index.html")


def _one(conn, image_id: int) -> dict:
    rows = db.list_images(conn)
    for r in rows:
        if r["id"] == image_id:
            return r
    raise HTTPException(status_code=404, detail="image not found")


app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
```

- [ ] **Step 3b: Replace the `/images` handler with explicit filter params**

Replace the placeholder `get_images` function above with:

```python
@app.get("/images")
def get_images(
    garment_type: str | None = None,
    style: str | None = None,
    material: str | None = None,
    pattern: str | None = None,
    occasion: str | None = None,
    consumer_profile: str | None = None,
    continent: str | None = None,
    country: str | None = None,
    city: str | None = None,
    year: int | None = None,
    month: int | None = None,
    season: str | None = None,
    designer: str | None = None,
    conn=Depends(get_db),
):
    filters = {k: v for k, v in {
        "garment_type": garment_type, "style": style, "material": material,
        "pattern": pattern, "occasion": occasion, "consumer_profile": consumer_profile,
        "continent": continent, "country": country, "city": city,
        "year": year, "month": month, "season": season, "designer": designer,
    }.items() if v is not None}
    return {"images": db.list_images(conn, filters)}
```

Note: the `app/static/` directory must exist before the `StaticFiles` mount runs. Create it now: `mkdir -p app/static`. The frontend files land there in Task 7.

- [ ] **Step 4: Run test to verify it passes**

Run: `mkdir -p app/static && pytest tests/test_filters.py -v`
Expected: PASS (5 passed).

- [ ] **Step 5: Commit**

```bash
git add app/main.py tests/test_filters.py
git commit -m "hw14 fastapi endpoints + filter integration test"
```

---

### Task 7: Static frontend (upload, grid, dynamic filters, search, annotations)

**Files:**
- Create: `app/static/index.html`
- Create: `app/static/app.js`
- Create: `app/static/style.css`

**Interfaces:**
- Consumes: `POST /images`, `GET /images`, `GET /filters`, `GET /search`, `POST /images/{id}/annotations`; images served from `/static/../data/images`? No — add an image route in Step 4.
- Produces: a working single-page UI. No automated test in this task; verified manually and by the Task 9 e2e test.

- [ ] **Step 1: Create `app/static/index.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Fashion Inspiration Library</title>
  <link rel="stylesheet" href="/static/style.css" />
</head>
<body>
  <header><h1>Fashion Inspiration Library</h1></header>
  <main>
    <section id="upload">
      <h2>Upload</h2>
      <form id="upload-form">
        <input type="file" name="file" accept="image/*" required />
        <input type="text" name="country" placeholder="country" />
        <input type="text" name="city" placeholder="city" />
        <input type="text" name="continent" placeholder="continent" />
        <input type="number" name="year" placeholder="year" />
        <input type="number" name="month" placeholder="month" />
        <input type="text" name="season" placeholder="season" />
        <input type="text" name="designer" placeholder="designer" />
        <button type="submit">Upload & classify</button>
      </form>
      <p id="upload-status"></p>
    </section>
    <section id="controls">
      <input id="search" type="search" placeholder="Search descriptions & notes…" />
      <div id="filters"></div>
      <button id="clear">Clear filters</button>
    </section>
    <section id="grid"></section>
  </main>
  <script src="/static/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `app/static/app.js`**

```javascript
const grid = document.getElementById("grid");
const filtersEl = document.getElementById("filters");
const searchEl = document.getElementById("search");
let activeFilters = {};

async function loadFilters() {
  const vals = await (await fetch("/filters")).json();
  filtersEl.innerHTML = "";
  for (const [key, options] of Object.entries(vals)) {
    if (!options.length) continue;
    const sel = document.createElement("select");
    sel.innerHTML = `<option value="">${key}: any</option>` +
      options.map((o) => `<option value="${o}">${o}</option>`).join("");
    sel.onchange = () => {
      if (sel.value) activeFilters[key] = sel.value;
      else delete activeFilters[key];
      loadImages();
    };
    filtersEl.appendChild(sel);
  }
}

async function loadImages() {
  const params = new URLSearchParams(activeFilters);
  const data = await (await fetch("/images?" + params)).json();
  render(data.images);
}

async function runSearch() {
  const q = searchEl.value.trim();
  if (!q) return loadImages();
  const data = await (await fetch("/search?q=" + encodeURIComponent(q))).json();
  render(data.images);
}

function render(images) {
  grid.innerHTML = "";
  for (const img of images) {
    const card = document.createElement("div");
    card.className = "card";
    const a = img.attributes || {};
    card.innerHTML = `
      <img src="/image/${img.filename}" alt="${a.garment_type || "garment"}" />
      <p class="desc">${img.description || ""}</p>
      <p class="attrs">${a.garment_type || "?"} · ${a.material || "?"} · ${(a.color_palette||[]).join(", ")}</p>
      <p class="ctx">${[img.city, img.country, img.year].filter(Boolean).join(", ")}</p>
      <ul class="notes">${(img.annotations||[]).map((n)=>`<li>📝 ${n}</li>`).join("")}</ul>
      <form class="ann"><input placeholder="add note…" /><button>Add</button></form>`;
    card.querySelector(".ann").onsubmit = async (e) => {
      e.preventDefault();
      const input = e.target.querySelector("input");
      await fetch(`/images/${img.id}/annotations`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.value }),
      });
      loadImages();
    };
    grid.appendChild(card);
  }
}

document.getElementById("upload-form").onsubmit = async (e) => {
  e.preventDefault();
  const status = document.getElementById("upload-status");
  status.textContent = "Uploading & classifying…";
  const res = await fetch("/images", { method: "POST", body: new FormData(e.target) });
  status.textContent = res.ok ? "Done." : "Upload failed.";
  e.target.reset();
  await loadFilters();
  await loadImages();
};

document.getElementById("clear").onclick = () => {
  activeFilters = {}; searchEl.value = "";
  loadFilters(); loadImages();
};
searchEl.oninput = () => { if (!searchEl.value.trim()) loadImages(); };
searchEl.onchange = runSearch;

loadFilters();
loadImages();
```

- [ ] **Step 3: Create `app/static/style.css`**

```css
* { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; margin: 0; color: #1a1a1a; }
header { background: #111; color: #fff; padding: 1rem 1.5rem; }
main { padding: 1.5rem; max-width: 1100px; margin: 0 auto; }
section { margin-bottom: 1.5rem; }
#upload-form, #controls { display: flex; flex-wrap: wrap; gap: .5rem; }
input, select, button { padding: .5rem; font-size: .9rem; }
#grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
.card { border: 1px solid #ddd; border-radius: 8px; padding: .75rem; }
.card img { width: 100%; height: 220px; object-fit: cover; border-radius: 6px; }
.desc { font-size: .85rem; } .attrs { font-weight: 600; font-size: .8rem; }
.ctx { color: #666; font-size: .8rem; } .notes { padding-left: 1rem; font-size: .8rem; }
.ann { display: flex; gap: .25rem; margin-top: .5rem; }
.ann input { flex: 1; }
```

- [ ] **Step 4: Add the image-serving route to `app/main.py`**

Add near the other routes (before the `/static` mount):

```python
@app.get("/image/{filename}")
def serve_image(filename: str):
    safe = Path(filename).name  # prevent path traversal
    path = IMAGES_DIR / safe
    if not path.exists():
        raise HTTPException(status_code=404, detail="not found")
    return FileResponse(path)
```

- [ ] **Step 5: Manual smoke check**

Run: `uvicorn app.main:app --reload` and open http://127.0.0.1:8000/
Expected: page loads, upload form + empty grid visible. (Full upload needs an API key; covered by Task 9 with a mock.)

- [ ] **Step 6: Commit**

```bash
git add app/static app/main.py
git commit -m "hw14 frontend"
```

---

### Task 8: End-to-end test (upload → classify → filter, classifier mocked)

**Files:**
- Test: `tests/test_e2e.py`
- Create: `tests/fixtures/tiny.jpg` (a tiny valid JPEG; generate in Step 1)

**Interfaces:**
- Consumes: `app.main.app`, `get_db`, and the module-level `classifier` (monkeypatched).
- Produces: the required e2e test proving the full flow with no network calls.

- [ ] **Step 1: Generate a tiny fixture image**

```bash
mkdir -p tests/fixtures
python -c "from PIL import Image; Image.new('RGB',(32,32),'red').save('tests/fixtures/tiny.jpg')"
```

- [ ] **Step 2: Write the e2e test**

```python
# tests/test_e2e.py
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
```

- [ ] **Step 3: Run the full suite**

Run: `pytest -v`
Expected: PASS across `test_schema`, `test_parsing`, `test_db`, `test_filters`, `test_e2e`.

- [ ] **Step 4: Commit**

```bash
git add tests/test_e2e.py tests/fixtures/tiny.jpg
git commit -m "hw14 e2e test"
```

---

### Task 9: Evaluation harness

**Files:**
- Create: `eval/labels.json`
- Create: `eval/evaluate.py`
- Create: `eval/images/` (hand-collected images, gitignored if large — keep ~15-20 small ones)

**Interfaces:**
- Consumes: `get_classifier` from `app.classifier`; label file.
- Produces: `evaluate.py` prints per-attribute accuracy over the labeled set. Requires an API key (uses the real classifier).

- [ ] **Step 1: Collect ~15-20 images and write `eval/labels.json`**

Download ~15-20 fashion photos from https://www.pexels.com/search/fashion/ into `eval/images/`. Hand-label expected attributes. Format:

```json
[
  {
    "file": "images/001.jpg",
    "expected": {
      "garment_type": "dress",
      "style": "bohemian",
      "material": "cotton",
      "occasion": "casual",
      "location_context": "market"
    }
  }
]
```

Only include attributes you can confidently judge. Missing keys are skipped in scoring.

- [ ] **Step 2: Write `eval/evaluate.py`**

```python
# eval/evaluate.py
"""Run the classifier over a labeled set and report per-attribute accuracy.

Usage (from HW14/, with OPENAI_API_KEY set): python eval/evaluate.py
"""
import json
from collections import defaultdict
from pathlib import Path

from dotenv import load_dotenv
from app.classifier import get_classifier

load_dotenv()
EVAL_DIR = Path(__file__).resolve().parent
SCORED = ["garment_type", "style", "material", "pattern", "occasion",
          "consumer_profile", "season", "location_context"]


def norm(v) -> str:
    if isinstance(v, list):
        v = " ".join(v)
    return str(v or "").strip().lower()


def main() -> None:
    labels = json.loads((EVAL_DIR / "labels.json").read_text())
    classifier = get_classifier()
    correct = defaultdict(int)
    total = defaultdict(int)

    for item in labels:
        image_bytes = (EVAL_DIR / item["file"]).read_bytes()
        pred = classifier.classify(image_bytes).attributes.model_dump()
        for attr, exp in item["expected"].items():
            if attr not in SCORED:
                continue
            total[attr] += 1
            # substring-tolerant match either direction
            e, p = norm(exp), norm(pred.get(attr))
            if e and (e == p or e in p or p in e):
                correct[attr] += 1

    print(f"Evaluated {len(labels)} images\n")
    print(f"{'attribute':<20} {'accuracy':>10}  n")
    overall_c = overall_t = 0
    for attr in SCORED:
        if total[attr] == 0:
            continue
        acc = correct[attr] / total[attr]
        overall_c += correct[attr]; overall_t += total[attr]
        print(f"{attr:<20} {acc:>9.0%}  {total[attr]}")
    if overall_t:
        print(f"\n{'OVERALL':<20} {overall_c/overall_t:>9.0%}  {overall_t}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 3: Run the evaluation (needs API key)**

Run: `python eval/evaluate.py`
Expected: a per-attribute accuracy table plus an OVERALL line. Record the numbers for the README.

- [ ] **Step 4: Commit**

```bash
git add eval/evaluate.py eval/labels.json eval/images
git commit -m "hw14 eval harness"
```

---

### Task 10: README with setup, architecture & evaluation summary

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: results from Task 9; the design spec.
- Produces: the graded communication artifact.

- [ ] **Step 1: Write `README.md`**

Include these sections (fill the eval numbers from Task 9's actual run):

```markdown
# Fashion Garment Classification & Inspiration Web App

AI-powered library where designers upload garment photos, GPT-4o vision
classifies them into a description + structured attributes, and the collection
is searchable, filterable, and annotatable.

## Setup

    python -m venv .venv && . .venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env    # add your OPENAI_API_KEY
    uvicorn app.main:app --reload
    # open http://127.0.0.1:8000/

## Architecture

- **FastAPI** serves a JSON API + static frontend from one process.
- **SQLite** stores metadata; images live on disk in `app/data/images/`.
- **Classifier** is an interface (`app/classifier.py`) with an OpenAI GPT-4o
  implementation, swappable and mockable. `parse_model_output` isolates the
  fragile JSON-parsing step.
- **Filters** are generated dynamically from DB values via `GET /filters`.
- **Annotations** live in a separate table, clearly distinct from AI output.

## Key design choices & assumptions

- Location / time / designer are **user-entered at upload** — a photo can't tell
  us the true city or capture date, so the model only infers fashion attributes
  plus a loose `location_context` cue.
- Full-text search is simple SQL `LIKE`; a production system would use FTS5 or
  embeddings.
- No auth / multi-user / cloud deploy (proof of concept).

## Testing

    pytest -v

- `tests/test_parsing.py` — unit: model output → structured attributes
- `tests/test_filters.py` — integration: filter behavior (location + time)
- `tests/test_e2e.py` — e2e: upload → classify (mocked) → filter

## Evaluation

Run `python eval/evaluate.py` against `eval/labels.json` (~N hand-labeled images).

| attribute | accuracy | n |
|-----------|----------|---|
| garment_type | XX% | N |
| ... | ... | ... |

**Where it does well:** <fill in>.
**Where it struggles:** <fill in — e.g. material vs. print confusion, season inference>.
**With more time:** expand the labeled set to 50-100, add embeddings-based
search, and constrain attributes with enums for stricter scoring.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "hw14 readme"
```

---

## Self-Review Notes

- **Spec coverage:** upload+classify (T4,T6), structured+description storage (T2,T5), visual grid (T7), dynamic filters (T5,T6,T7), full-text search (T5,T6,T7), annotations separate+searchable (T5,T6,T7), unit/integration/e2e tests (T3,T6,T8), eval (T9), README (T10), repo structure (T1). All spec items map to a task.
- **Classifier-first priority:** T3 (parse) + T4 (live JSON check) precede DB/API/frontend, per the user's explicit request.
- **No network in tests:** classifier mocked in T8; T4 and T9 are the only live-API steps and are run manually.
- **Type consistency:** `classify(image_bytes, mime_type=...) -> ClassificationResult`, `parse_model_output`, `list_images(conn, filters)`, `distinct_filter_values`, `add_annotation` are used consistently across tasks.
