const test = require("node:test");
const assert = require("node:assert");
const { filterImages, buildFilterOptions } = require("../app/src/search");

const sampleImages = [
  {
    id: "1",
    originalName: "dress.jpg",
    notes: "embroidery inspiration",
    tags: ["market"],
    metadata: {
      garmentType: "dress",
      style: "formal",
      material: "silk",
      season: "summer",
      occasion: "formal event",
      locationContext: "market",
      description: "formal silk dress"
    }
  },
  {
    id: "2",
    originalName: "jacket.jpg",
    notes: "urban look",
    tags: ["streetwear"],
    metadata: {
      garmentType: "jacket",
      style: "streetwear",
      material: "denim",
      season: "fall",
      occasion: "daily wear",
      locationContext: "urban street",
      description: "denim streetwear jacket"
    }
  }
];

test("filterImages filters by garment type", () => {
  const result = filterImages(sampleImages, { garmentType: "dress" });

  assert.equal(result.length, 1);
  assert.equal(result[0].metadata.garmentType, "dress");
});

test("filterImages searches notes and descriptions", () => {
  const result = filterImages(sampleImages, { search: "urban" });

  assert.equal(result.length, 1);
  assert.equal(result[0].id, "2");
});

test("buildFilterOptions creates dynamic filter values", () => {
  const options = buildFilterOptions(sampleImages);

  assert.deepEqual(options.garmentType, ["dress", "jacket"]);
  assert.deepEqual(options.material, ["denim", "silk"]);
});
