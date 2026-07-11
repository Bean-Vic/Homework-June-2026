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
STATIC_DIR = BASE_DIR / "static"
DB_PATH = str(DATA_DIR / "app.db")
IMAGES_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Fashion Inspiration Library")

# The OpenAI client requires an API key at construction time. We build it lazily
# so importing this module (e.g. in tests, which mock or bypass the classifier)
# never needs a key or a network call. `classifier` stays a module attribute so
# tests can monkeypatch it directly.
classifier = None


def _classifier():
    global classifier
    if classifier is None:
        classifier = get_classifier()
    return classifier


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

    result = _classifier().classify(content, mime_type=file.content_type or "image/jpeg")
    context = UploadContext(continent=continent, country=country, city=city,
                            year=year, month=month, season=season, designer=designer)
    image_id = db.insert_image(conn, filename=stored_name, description=result.description,
                               attributes=result.attributes, context=context)
    return _one(conn, image_id)


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
    return FileResponse(STATIC_DIR / "index.html")


def _one(conn, image_id: int) -> dict:
    rows = db.list_images(conn)
    for r in rows:
        if r["id"] == image_id:
            return r
    raise HTTPException(status_code=404, detail="image not found")


app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
