import json
import sqlite3
from app.schema import GarmentAttributes, UploadContext

CONTEXT_COLUMNS = ["continent", "country", "city", "year", "month", "season", "designer"]
FILTER_COLUMNS = ["garment_type", "style", "material", "pattern", "occasion",
                  "consumer_profile"] + CONTEXT_COLUMNS
_TEXT_ATTR = {"garment_type", "style", "material", "pattern", "occasion", "consumer_profile"}


def get_connection(path: str) -> sqlite3.Connection:
    # check_same_thread=False: FastAPI runs sync dependencies (get_db) in a
    # threadpool thread while async endpoints run on the event loop thread, so
    # the same per-request connection is touched from two threads (sequentially,
    # never concurrently — safe).
    conn = sqlite3.connect(path, check_same_thread=False)
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
