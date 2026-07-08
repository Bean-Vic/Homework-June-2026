# Fashion Garment Classification & Inspiration Web App — Design Spec

**Date:** 2026-07-07
**Assignment:** HW14
**Timebox:** ~1 day (proof of concept)

## 1. Goal

A lightweight AI-powered web app for fashion designers to upload inspiration
photos, have them automatically classified by a multimodal model into a rich
natural-language description plus structured attributes, then search, filter,
and annotate the resulting library.

This is a proof of concept. Simplifying assumptions are acceptable and must be
documented in the README.

## 2. Stack decisions (locked)

| Concern       | Choice                                            |
|---------------|---------------------------------------------------|
| Backend       | Python + FastAPI (one process, run via uvicorn)   |
| Frontend      | Static `index.html` + `app.js` calling JSON API   |
| Storage       | SQLite for metadata, local filesystem for images  |
| Multimodal AI | OpenAI GPT-4o vision (behind a swappable interface)|

No build step. Runs locally with `pip install -r requirements.txt` + one
`uvicorn` command + an `OPENAI_API_KEY` in `.env`.

## 3. Repository structure (inside `HW14/`)

```
/app
  main.py            # FastAPI app: routes + static mount
  classifier.py      # Classifier interface + OpenAI impl (swappable)
  schema.py          # Pydantic models: GarmentAttributes, ImageRecord
  db.py              # SQLite setup + queries (insert, list, filter, search)
  static/
    index.html       # upload form + filter sidebar + image grid
    app.js           # fetch calls, dynamic filter rendering
    style.css
  data/
    images/          # uploaded files (gitignored)
    app.db           # sqlite (gitignored)
/eval
  labels.json        # hand-labeled expected attributes (~15-20 images to start)
  images/            # the eval image set
  evaluate.py        # runs classifier over set, reports per-attribute accuracy
/tests
  test_parsing.py    # UNIT: parse model output -> structured attributes
  test_filters.py    # INTEGRATION: filter behavior (location + time especially)
  test_e2e.py        # E2E: upload -> classify (mocked) -> filter
README.md            # setup, architecture, evaluation summary, assumptions
requirements.txt
.env.example         # OPENAI_API_KEY=...
```

## 4. Data model / attribute schema

Each image produces two stored outputs:

- `description` — natural-language paragraph, used for full-text search.
- `attributes` — structured JSON:
  - **Fashion (model-inferred):** garment_type, style, material,
    color_palette (list), pattern, season, occasion, consumer_profile,
    trend_notes, location_context (loose cue, e.g. "artisan market")
  - **Context (user-provided at upload):** location {continent, country, city},
    time {year, month, season}, designer

### 4.1 Stated simplifying assumption (approved)

GPT-4o can reliably infer *fashion* attributes and a loose *location cue* from
a photo, but it cannot know the true city/country, capture date, or designer —
and Pexels images carry no reliable EXIF. Therefore **location, time, and
designer are entered by the user in the upload form** (optional fields), while
the model fills all fashion attributes plus a `location_context` cue. This
keeps the contextual filters honest. Documented in README.

### 4.2 SQLite tables

- `images` — id, filename, description, attributes (JSON column), plus
  denormalized context columns (continent, country, city, year, month, season,
  designer) so filters are simple SQL `WHERE` clauses.
- `annotations` — id, image_id (FK), text, created_at. Kept in a **separate
  table** so designer annotations are clearly distinguished from AI output and
  independently searchable.

## 5. Data flow

- **Upload:** `POST /images` (multipart: file + optional location/time/designer)
  -> save file to `data/images/` -> call classifier -> merge model attributes
  with user-provided context -> insert into SQLite -> return record.
- **Browse/filter:** `GET /images?garment_type=...&country=...&year=...`
  -> SQLite query -> JSON list.
- **Filter options:** `GET /filters` -> distinct values pulled from the DB so
  the frontend renders filter controls **dynamically, not hardcoded**.
- **Search:** `GET /search?q=embroidered+neckline` -> match over description
  and annotations.
- **Annotate:** `POST /images/{id}/annotations` -> insert into `annotations`.

## 6. Classifier design

`classifier.py` exposes:

```
classify(image_bytes) -> ClassificationResult   # {description, attributes}
parse_model_output(raw_text) -> GarmentAttributes
```

The OpenAI implementation sends the image + a prompt demanding **strict JSON**
matching the schema. `parse_model_output` isolates the fragile parsing step:
it must handle clean JSON, JSON wrapped in ```` ```json ```` fences, and
missing fields (fall back to defaults / null). This function is the target of
the unit test.

## 7. Testing

- **Unit** (`test_parsing.py`): feed sample raw model strings ->
  assert correct structured attributes. No network.
- **Integration** (`test_filters.py`): seed DB with fixtures -> hit filter
  endpoints -> assert location & time filters return the correct subset.
- **E2E** (`test_e2e.py`): upload a fixture image with the classifier
  **mocked** (deterministic, no API cost) -> confirm it appears -> filter
  finds it.

## 8. Evaluation

`evaluate.py` loads `labels.json`, runs the **real** classifier per image,
compares predicted vs expected per attribute, and prints per-attribute accuracy
plus a short strengths/weaknesses summary. Start with ~15-20 hand-labeled
images to prove the pipeline end to end; document scaling to the full 50-100 as
the next step.

## 9. Build order (incremental commits)

Ordered by dependency. **The classifier + a live JSON-return check come first**
because everything downstream depends on the model returning parseable
structured output (explicit user priority).

1. **Scaffold** — folders, `requirements.txt`, `.env.example`, `.gitignore`.
2. **Schema** — `schema.py` Pydantic models for attributes + records.
3. **Classifier + JSON verification** — `classifier.py` (OpenAI impl +
   `parse_model_output`), and a small script/test that sends one real image and
   confirms the model returns valid, parseable JSON matching the schema.
4. **DB** — `db.py` tables + insert/list/filter/search queries.
5. **API + frontend** — `main.py` routes, `index.html`/`app.js`/`style.css`.
6. **Annotations** — endpoint + table + UI.
7. **Tests** — unit, integration, e2e.
8. **Eval** — label set + `evaluate.py` + summary.
9. **README** — setup, architecture notes, evaluation summary, assumptions.

## 10. Out of scope (YAGNI)

Auth, multi-user accounts, cloud deploy, image editing, pagination, vector
search. Full-text search uses simple SQL matching; document that a real system
would use FTS5 or embeddings.
