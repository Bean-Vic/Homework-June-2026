function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function itemMatchesSearch(item, searchText) {
  const search = normalize(searchText);
  if (!search) return true;

  const metadata = item.metadata || {};
  const searchableText = [
    item.originalName,
    item.notes,
    ...(item.tags || []),
    metadata.garmentType,
    metadata.style,
    metadata.material,
    metadata.pattern,
    metadata.season,
    metadata.occasion,
    metadata.consumerProfile,
    metadata.trendNotes,
    metadata.locationContext,
    metadata.description,
    ...(metadata.colorPalette || [])
  ].join(" ").toLowerCase();

  return searchableText.includes(search);
}

function itemMatchesFilters(item, filters = {}) {
  const metadata = item.metadata || {};
  const keys = [
    "garmentType",
    "style",
    "material",
    "pattern",
    "season",
    "occasion",
    "locationContext"
  ];

  return keys.every((key) => {
    const filterValue = normalize(filters[key]);
    if (!filterValue) return true;
    return normalize(metadata[key]) === filterValue;
  });
}

function filterImages(items, options = {}) {
  return items.filter((item) => {
    return itemMatchesSearch(item, options.search) && itemMatchesFilters(item, options);
  });
}

function buildFilterOptions(items) {
  const fields = [
    "garmentType",
    "style",
    "material",
    "pattern",
    "season",
    "occasion",
    "locationContext"
  ];

  const result = {};

  for (const field of fields) {
    result[field] = [
      ...new Set(
        items
          .map((item) => item.metadata && item.metadata[field])
          .filter(Boolean)
      )
    ].sort();
  }

  return result;
}

module.exports = { filterImages, buildFilterOptions };
