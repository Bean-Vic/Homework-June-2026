# HW14 Notes

## What I built

A fashion garment classification and inspiration web app. Designers upload
garment photos, GPT-4o vision classifies each one into a description plus
structured attributes (garment type, style, material, pattern, occasion,
season, …), and the collection becomes a searchable, filterable library where
you can also attach your own notes to each image.

## How it works

- **FastAPI** serves the JSON API and the static frontend from one process.
- **SQLite** stores the metadata; the image files live on disk. Uploads and the
  DB file are gitignored.
- The **classifier** is an interface with a GPT-4o implementation behind it, so
  tests can mock it — the 18 tests never touch the real API.
- Filter options are always derived from what is actually in the database, and
  designer annotations are stored in a separate table so they never mix with
  AI-generated output.

## What I learned

- Model output is messy: the JSON parsing step has to tolerate code fences and
  missing fields, so I isolated it in one function and unit-tested it hard.
- A photo cannot tell you the true city or capture date, so location / time /
  designer are user-entered at upload; the model only infers visual attributes.
- Building the frontend DOM with `textContent` / `createElement` instead of
  `innerHTML` means model output and user notes cannot inject markup.

## Evaluation

I ran GPT-4o over 15 hand-labeled photos: **76% overall attribute accuracy**.
It is strong on coarse visual attributes (garment_type 87%, season 86%) and
weaker on subjective ones (occasion 71%, pattern 67%, location_context 50%).
Caveat: the ground-truth labels were drafted by visual inspection rather than
an independent domain expert, so the numbers are indicative. With more time I
would expand to 50–100 independently labeled images and add embedding search.

## How to run

See `README.md` — `pip install -r requirements.txt`, add `OPENAI_API_KEY` to
`.env`, then `uvicorn app.main:app --reload` and open http://127.0.0.1:8000/.
`pytest -q` runs the 18 API-free tests.
