const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const { randomUUID } = require("crypto");

const { classifyGarment } = require("./src/classifier");
const { filterImages, buildFilterOptions } = require("./src/search");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "data", "images.json");
const UPLOAD_DIR = path.join(__dirname, "public", "uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function readImages() {
  try {
    const text = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(text);
  } catch (error) {
    return [];
  }
}

async function writeImages(images) {
  await fs.writeFile(DATA_FILE, JSON.stringify(images, null, 2));
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Fashion inspiration app is running." });
});

app.get("/api/images", async (req, res) => {
  const images = await readImages();
  const filtered = filterImages(images, {
    search: req.query.search,
    garmentType: req.query.garmentType,
    style: req.query.style,
    material: req.query.material,
    pattern: req.query.pattern,
    season: req.query.season,
    occasion: req.query.occasion,
    locationContext: req.query.locationContext
  });

  res.json(filtered);
});

app.get("/api/filters", async (req, res) => {
  const images = await readImages();
  res.json(buildFilterOptions(images));
});

app.post("/api/images", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Image file is required." });
  }

  const images = await readImages();

  const metadata = classifyGarment({
    fileName: req.file.originalname,
    imageUrl: `/uploads/${req.file.filename}`
  });

  const newImage = {
    id: randomUUID(),
    originalName: req.file.originalname,
    fileName: req.file.filename,
    imageUrl: `/uploads/${req.file.filename}`,
    metadata,
    notes: "",
    tags: [],
    createdAt: new Date().toISOString(),
    source: "user upload"
  };

  images.unshift(newImage);
  await writeImages(images);

  res.status(201).json(newImage);
});

app.patch("/api/images/:id/annotations", async (req, res) => {
  const images = await readImages();
  const image = images.find((item) => item.id === req.params.id);

  if (!image) {
    return res.status(404).json({ error: "Image not found." });
  }

  image.notes = typeof req.body.notes === "string" ? req.body.notes : image.notes;

  if (Array.isArray(req.body.tags)) {
    image.tags = req.body.tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  image.updatedAt = new Date().toISOString();
  await writeImages(images);

  res.json(image);
});

app.delete("/api/images/:id", async (req, res) => {
  const images = await readImages();
  const index = images.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Image not found." });
  }

  const [removed] = images.splice(index, 1);
  await writeImages(images);

  res.json({ deleted: true, image: removed });
});

app.listen(PORT, () => {
  console.log(`Fashion Garment App running at http://localhost:${PORT}`);
});
