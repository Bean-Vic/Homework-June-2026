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

Requires Python 3.12 (3.14 lacks prebuilt wheels for the pinned deps).

## Architecture

- **FastAPI** serves a JSON API + static frontend from one process (`app/main.py`).
- **SQLite** stores metadata (`app/db.py`); images live on disk in
  `app/data/images/`. Both the DB file and uploads are gitignored.
- **Classifier** is an interface (`app/classifier.py`) with an OpenAI GPT-4o
  implementation, swappable and mockable. `parse_model_output` isolates the
  fragile JSON-parsing step so messy model responses (code fences, missing
  fields) are tolerated. The client is constructed lazily, so importing the app
  needs no API key — only an actual upload does.
- **Filters** are generated dynamically from DB values via `GET /filters` —
  never hardcoded.
- **Annotations** live in a separate table (`annotations`), clearly distinct
  from AI-generated output.

### API

| Method & path | Purpose |
|---|---|
| `POST /images` | Multipart upload → classify → store; returns the created record |
| `GET /images` | List with dynamic filters (garment_type, country, year, …) |
| `GET /filters` | Distinct filter values, derived from stored data |
| `GET /search?q=` | Substring search over descriptions + annotations |
| `POST /images/{id}/annotations` | Attach a designer note |
| `GET /image/{filename}` | Serve a stored image (path-traversal guarded) |
| `GET /` , `/static/*` | Frontend |

## Key design choices & assumptions

- Location / time / designer are **user-entered at upload** — a photo can't tell
  us the true city or capture date, so the model only infers fashion attributes
  plus a loose `location_context` cue.
- Full-text search is simple SQL `LIKE`; a production system would use FTS5 or
  embeddings.
- The frontend builds the DOM with `textContent` / `createElement` (not
  `innerHTML` interpolation) so model output and notes can't inject markup.
- No auth / multi-user / cloud deploy (proof of concept).

## Testing

    pytest -q

18 tests, all API-free (the classifier is mocked or bypassed):

- `tests/test_schema.py` — unit: Pydantic models & defaults
- `tests/test_parsing.py` — unit: model output → structured attributes (fences,
  missing fields, bad JSON)
- `tests/test_db.py` — unit: insert/list/filter/search/annotations on an
  in-memory SQLite DB
- `tests/test_filters.py` — integration: filter + search endpoints
- `tests/test_e2e.py` — e2e: upload → classify (mocked) → filter → search →
  annotate

The **only** two things that call the real OpenAI API are run manually and are
not part of the suite: `scripts/check_openai_json.py` (one live JSON sanity
check) and `eval/evaluate.py` (accuracy measurement below).

## Evaluation

Populate `eval/images/` with ~15–20 fashion photos and label their expected
attributes in `eval/labels.json`, then run (with `OPENAI_API_KEY` set):

    python eval/evaluate.py

`labels.json` is a list of `{ "file": "images/NNN.jpg", "expected": { ... } }`.
Only attributes you can confidently judge need to be listed; missing keys are
skipped in scoring. Scored attributes: `garment_type, style, material, pattern,
occasion, consumer_profile, season, location_context`. Matching is
substring-tolerant in either direction.

Results (gpt-4o over 15 hand-labeled Pexels photos: dresses, coats, denim
jackets, suits, knit sweaters). `n` is the number of images that labeled a given
attribute:

| attribute | accuracy | n |
|-----------|----------|---|
| garment_type | 87% | 15 |
| season | 86% | 7 |
| material | 79% | 14 |
| style | 75% | 12 |
| occasion | 71% | 14 |
| pattern | 67% | 6 |
| location_context | 50% | 4 |
| **OVERALL** | **76%** | 72 |

**Where it does well:** coarse, visually obvious attributes — `garment_type`
(87%) and `season` (86%). Coats, denim jackets and knit sweaters are recognized
reliably, and material follows when the weave is distinctive (denim, wool knit).

**Where it struggles:** subjective or fine-grained attributes. `location_context`
(50%, small n) is inherently loose — the model guesses a plausible setting that
rarely matches a specific label. `pattern` (67%) confuses related weaves
(herringbone vs. plain, ribbed vs. cable knit). `occasion` (71%) is judgment-heavy
(smart-casual vs. casual). Ambiguous inputs hurt too: a couple in mixed outfits
and suits on shop mannequins have no single "correct" garment.

**Caveat on ground truth:** these labels were drafted by visual inspection (by an
AI assistant), not an independent domain expert, so the numbers gauge agreement
more than absolute correctness — treat them as indicative. Spot-check or replace
`eval/labels.json` for a rigorous measure.

**With more time:** expand the labeled set to 50–100 with independent human
labels, add embeddings-based search, and constrain attributes with enums for
stricter, less substring-dependent scoring.
