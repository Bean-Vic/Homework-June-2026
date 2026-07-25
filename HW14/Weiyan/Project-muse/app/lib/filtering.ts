import type { LibraryFilters, LibraryImage } from "./types";

export function matchesLibraryFilters(image: LibraryImage, filters: LibraryFilters) {
  return (
    matchesQuery(image, filters.query) &&
    containsListValue(image.category, filters.category) &&
    containsListValue(image.garmentType, filters.garment) &&
    containsListValue(image.brand, filters.brand) &&
    containsListValue(image.gender, filters.gender) &&
    containsListValue(image.style, filters.style) &&
    containsListValue(image.material, filters.material) &&
    containsListValue(image.colorPalette, filters.color) &&
    containsListValue(image.pattern, filters.pattern) &&
    containsListValue(image.occasion, filters.occasion) &&
    matchesAddedMonthRange(image.createdAt, filters.addedFrom, filters.addedTo) &&
    equalsFilter(image.capturedYear?.toString() ?? null, filters.year) &&
    equalsFilter(image.capturedMonth?.toString() ?? null, filters.month)
  );
}

export function makeSearchText(image: LibraryImage) {
  return [
    image.title,
    image.description,
    image.category,
    image.garmentType,
    image.brand,
    image.gender,
    image.style,
    image.material,
    image.colorPalette,
    image.pattern,
    image.occasion,
    image.designerName,
    ...image.annotations.flatMap((annotation) => [
      annotation.notes,
      annotation.tags,
      annotation.authorName
    ])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function uniqueSorted(values: Array<string | number | null | undefined>) {
  return Array.from(
    new Set(
      values
        .map((value) => (value === null || value === undefined ? "" : String(value).trim()))
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));
}

function matchesQuery(image: LibraryImage, query?: string) {
  if (!query) {
    return true;
  }

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => makeSearchText(image).includes(term));
}

function equalsFilter(actual: string | null, expected?: string | string[]) {
  const expectedValues = normalizeExpected(expected);
  if (expectedValues.length === 0) {
    return true;
  }

  const normalizedActual = (actual ?? "").toLowerCase();
  return expectedValues.some((value) => normalizedActual === value.toLowerCase());
}

function containsListValue(actual: string, expected?: string | string[]) {
  const expectedValues = normalizeExpected(expected);
  if (expectedValues.length === 0) {
    return true;
  }

  const actualValues = actual
    .split(/[;,]/)
    .map((item) => item.trim().toLowerCase());

  return expectedValues.some((value) => actualValues.includes(value.toLowerCase()));
}

function matchesAddedMonthRange(createdAt: string, from?: string, to?: string) {
  if (!from && !to) {
    return true;
  }

  const actualMonth = monthIndexFromIso(createdAt);
  if (actualMonth === null) {
    return false;
  }

  const fromMonth = from ? monthIndexFromMonthInput(from) : null;
  const toMonth = to ? monthIndexFromMonthInput(to) : null;

  if (from && fromMonth === null) {
    return false;
  }

  if (to && toMonth === null) {
    return false;
  }

  return (fromMonth === null || actualMonth >= fromMonth) && (toMonth === null || actualMonth <= toMonth);
}

function monthIndexFromIso(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.getUTCFullYear() * 12 + date.getUTCMonth();
}

function monthIndexFromMonthInput(value: string) {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) {
    return null;
  }

  return year * 12 + (month - 1);
}

function normalizeExpected(expected?: string | string[]) {
  if (!expected) {
    return [];
  }

  return (Array.isArray(expected) ? expected : [expected])
    .flatMap((value) => value.split(/[;,]/))
    .map((value) => value.trim())
    .filter(Boolean);
}
