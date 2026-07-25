import type { StructuredAttributes } from "./types";
import { CATEGORY_OPTIONS } from "./types";

export const UNKNOWN_VALUE = "Unknown";
export const TAG_SEPARATOR = "; ";

export function cleanText(value: unknown, fallback = UNKNOWN_VALUE) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

export function normalizeList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeList(item)).filter(Boolean).slice(0, 5);
  }

  if (typeof value === "string") {
    return value
      .split(/[,\n;/|]+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5);
  }

  return [];
}

export function serializeList(value: string[]) {
  return Array.from(new Set(value.map((item) => item.trim()).filter(Boolean)))
    .slice(0, 5)
    .join(TAG_SEPARATOR);
}

export function deserializeList(value: string) {
  return normalizeList(value);
}

export function monthToSeason(month: number | null) {
  if (!month || month < 1 || month > 12) {
    return null;
  }

  if ([12, 1, 2].includes(month)) {
    return "Winter";
  }

  if ([3, 4, 5].includes(month)) {
    return "Spring";
  }

  if ([6, 7, 8].includes(month)) {
    return "Summer";
  }

  return "Fall";
}

export function normalizeAttributes(input: Partial<StructuredAttributes>): StructuredAttributes {
  return {
    category: normalizeCategory(input.category),
    garment: normalizeTagField(input.garment),
    brand: normalizeTagField(input.brand, []),
    gender: normalizeTagField(input.gender, ["neutral"]),
    style: normalizeTagField(input.style),
    material: normalizeTagField(input.material),
    colors: normalizeTagField(input.colors),
    pattern: normalizeTagField(input.pattern),
    occasion: normalizeTagField(input.occasion)
  };
}

function normalizeTagField(value: unknown, fallback = [UNKNOWN_VALUE]) {
  const normalized = normalizeList(value);
  return normalized.length > 0 ? normalized : fallback;
}

export function normalizeCategory(value: unknown) {
  const normalized = normalizeList(value);
  const match = normalized
    .map((item) => CATEGORY_OPTIONS.find((option) => option.toLowerCase() === item.toLowerCase()))
    .find(Boolean);

  return [match || "Ready-to-wear"];
}
