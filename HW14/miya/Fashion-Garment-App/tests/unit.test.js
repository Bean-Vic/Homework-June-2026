const test = require("node:test");
const assert = require("node:assert");
const { classifyGarment } = require("../app/src/classifier");

test("classifier returns structured garment metadata", () => {
  const result = classifyGarment({ fileName: "street-denim-jacket-blue.jpg" });

  assert.equal(result.garmentType, "jacket");
  assert.equal(result.style, "streetwear");
  assert.equal(result.material, "denim");
  assert.ok(Array.isArray(result.colorPalette));
  assert.ok(result.description.includes("jacket"));
});
