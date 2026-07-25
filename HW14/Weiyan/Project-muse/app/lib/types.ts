export const CATEGORY_OPTIONS = [
  "Ready-to-wear",
  "Bags and leather goods",
  "Shoes",
  "Jewelry & Timepieces",
  "Accessories",
  "Beauté",
  "Home"
] as const;

export type MuseCategory = (typeof CATEGORY_OPTIONS)[number];

export type StructuredAttributes = {
  category: string[];
  garment: string[];
  brand: string[];
  gender: string[];
  style: string[];
  material: string[];
  colors: string[];
  pattern: string[];
  occasion: string[];
};

export type ClassificationResult = {
  title: string;
  description: string;
  attributes: StructuredAttributes;
  rawOutput: string;
};

export type LibraryFilters = {
  query?: string;
  category?: string | string[];
  garment?: string | string[];
  brand?: string | string[];
  gender?: string | string[];
  style?: string | string[];
  material?: string | string[];
  color?: string | string[];
  pattern?: string | string[];
  occasion?: string | string[];
  addedFrom?: string;
  addedTo?: string;
  year?: string | string[];
  month?: string | string[];
};

export type LibraryAnnotation = {
  id: string;
  notes: string;
  tags: string;
  authorName: string;
  createdAt: string;
};

export type LibraryImage = {
  id: string;
  title: string | null;
  imageUrl: string;
  sourceType: string;
  sourceUrl: string | null;
  description: string;
  category: string;
  garmentType: string;
  brand: string;
  gender: string;
  style: string;
  material: string;
  colorPalette: string;
  pattern: string;
  occasion: string;
  capturedYear: number | null;
  capturedMonth: number | null;
  designerName: string;
  createdAt: string;
  annotations: LibraryAnnotation[];
};
