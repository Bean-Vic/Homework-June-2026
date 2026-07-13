function hasAny(text, keywords) {
  return keywords.some((word) => text.includes(word));
}

function classifyGarment(input = {}) {
  const fileName = String(input.fileName || input.imageUrl || "fashion-image").toLowerCase();

  let garmentType = "top";
  if (hasAny(fileName, ["dress", "gown"])) garmentType = "dress";
  else if (hasAny(fileName, ["jacket", "coat", "blazer"])) garmentType = "jacket";
  else if (hasAny(fileName, ["pants", "trouser", "jeans"])) garmentType = "pants";
  else if (hasAny(fileName, ["skirt"])) garmentType = "skirt";
  else if (hasAny(fileName, ["shoe", "sneaker", "boot"])) garmentType = "shoes";
  else if (hasAny(fileName, ["bag", "handbag", "tote"])) garmentType = "bag";

  let style = "casual";
  if (hasAny(fileName, ["street", "streetwear", "urban"])) style = "streetwear";
  else if (hasAny(fileName, ["formal", "evening", "gown"])) style = "formal";
  else if (hasAny(fileName, ["minimal", "clean"])) style = "minimal";
  else if (hasAny(fileName, ["vintage", "retro"])) style = "vintage";
  else if (hasAny(fileName, ["sport", "athletic"])) style = "sporty";

  let material = "cotton";
  if (hasAny(fileName, ["denim", "jeans"])) material = "denim";
  else if (hasAny(fileName, ["leather"])) material = "leather";
  else if (hasAny(fileName, ["silk", "satin"])) material = "silk";
  else if (hasAny(fileName, ["knit", "wool"])) material = "knit";
  else if (hasAny(fileName, ["linen"])) material = "linen";

  let colorPalette = ["neutral"];
  if (hasAny(fileName, ["black"])) colorPalette = ["black"];
  else if (hasAny(fileName, ["white", "cream"])) colorPalette = ["white", "cream"];
  else if (hasAny(fileName, ["red"])) colorPalette = ["red"];
  else if (hasAny(fileName, ["blue", "denim"])) colorPalette = ["blue"];
  else if (hasAny(fileName, ["green"])) colorPalette = ["green"];
  else if (hasAny(fileName, ["pink"])) colorPalette = ["pink"];

  let pattern = "solid";
  if (hasAny(fileName, ["stripe", "striped"])) pattern = "striped";
  else if (hasAny(fileName, ["floral", "flower"])) pattern = "floral";
  else if (hasAny(fileName, ["plaid", "check"])) pattern = "plaid";
  else if (hasAny(fileName, ["print", "graphic"])) pattern = "printed";

  let season = "all season";
  if (hasAny(fileName, ["summer", "linen"])) season = "summer";
  else if (hasAny(fileName, ["winter", "coat", "wool", "knit"])) season = "winter";
  else if (hasAny(fileName, ["spring", "floral"])) season = "spring";
  else if (hasAny(fileName, ["fall", "autumn", "leather"])) season = "fall";

  let occasion = "daily wear";
  if (hasAny(fileName, ["formal", "evening", "gown"])) occasion = "formal event";
  else if (hasAny(fileName, ["work", "office", "blazer"])) occasion = "work";
  else if (hasAny(fileName, ["sport", "athletic"])) occasion = "activewear";
  else if (hasAny(fileName, ["party"])) occasion = "party";

  const locationContext = hasAny(fileName, ["street", "urban", "city"])
    ? "urban street"
    : hasAny(fileName, ["market"])
      ? "market"
      : "general inspiration";

  const consumerProfile = style === "streetwear"
    ? "young urban consumer"
    : style === "formal"
      ? "occasion-driven consumer"
      : "everyday fashion consumer";

  const description = `AI-style description: ${style} ${garmentType} with ${material} material, ${pattern} pattern, and ${colorPalette.join("/")} color palette. It is suitable for ${season} and ${occasion}.`;

  return {
    garmentType,
    style,
    material,
    colorPalette,
    pattern,
    season,
    occasion,
    consumerProfile,
    trendNotes: `This item can be used as ${style} inspiration for future garment design.`,
    locationContext,
    description
  };
}

module.exports = { classifyGarment };
