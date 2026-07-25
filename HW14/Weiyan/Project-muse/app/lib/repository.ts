import type { Annotation, InspirationImage, User } from "@prisma/client";
import { deserializeList, monthToSeason, serializeList } from "./attribute-utils";
import { matchesLibraryFilters, uniqueSorted } from "./filtering";
import { prisma } from "./prisma";
import { CATEGORY_OPTIONS, type ClassificationResult, type LibraryFilters, type LibraryImage } from "./types";

type ImageWithRelations = InspirationImage & {
  designer: User;
  annotations: Array<Annotation & { author: User }>;
};

export class ImageAccessError extends Error {
  status = 404;

  constructor() {
    super("Image not found.");
  }
}

export async function listImages(filters: LibraryFilters, userId: string) {
  const images = await prisma.inspirationImage.findMany({
    where: { designerId: userId },
    include: {
      designer: true,
      annotations: {
        include: { author: true },
        orderBy: { createdAt: "desc" }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return images.map(toLibraryImage).filter((image) => matchesLibraryFilters(image, filters));
}

export async function listFilterOptions(userId: string, optionFilters: Pick<LibraryFilters, "category"> = {}) {
  const images = await listImages({}, userId);
  const scopedImages = optionFilters.category
    ? images.filter((image) => matchesLibraryFilters(image, optionFilters))
    : images;

  return {
    categories: orderedCategories(images.flatMap((image) => deserializeList(image.category))),
    garments: uniqueSorted(scopedImages.flatMap((image) => deserializeList(image.garmentType))),
    brands: uniqueSorted(scopedImages.flatMap((image) => deserializeList(image.brand))),
    genders: uniqueSorted(scopedImages.flatMap((image) => deserializeList(image.gender))),
    styles: uniqueSorted(scopedImages.flatMap((image) => deserializeList(image.style))),
    materials: uniqueSorted(scopedImages.flatMap((image) => deserializeList(image.material))),
    colors: uniqueSorted(scopedImages.flatMap((image) => deserializeList(image.colorPalette))),
    patterns: uniqueSorted(scopedImages.flatMap((image) => deserializeList(image.pattern))),
    occasions: uniqueSorted(scopedImages.flatMap((image) => deserializeList(image.occasion))),
    years: uniqueSorted(scopedImages.map((image) => image.capturedYear)),
    months: uniqueSorted(scopedImages.map((image) => image.capturedMonth))
  };
}

function orderedCategories(values: string[]) {
  const existing = new Set(values.map((value) => value.toLowerCase()));
  return CATEGORY_OPTIONS.filter((category) => existing.has(category.toLowerCase()));
}

export async function createImageRecord(input: {
  title?: string;
  userId: string;
  upload: {
    publicUrl: string;
    storageKey: string;
    mimeType: string;
    sizeBytes: number;
    sourceType: "upload" | "url";
    sourceUrl?: string | null;
  };
  classification: ClassificationResult;
  capturedAt?: Date | null;
}) {
  const capturedMonth = input.capturedAt ? input.capturedAt.getUTCMonth() + 1 : null;
  const capturedYear = input.capturedAt ? input.capturedAt.getUTCFullYear() : null;
  const capturedSeason = monthToSeason(capturedMonth);
  const attrs = input.classification.attributes;

  const image = await prisma.inspirationImage.create({
    data: {
      title: input.classification.title || input.title || null,
      imageUrl: input.upload.publicUrl,
      sourceType: input.upload.sourceType,
      sourceUrl: input.upload.sourceUrl ?? null,
      storageKey: input.upload.storageKey,
      mimeType: input.upload.mimeType,
      sizeBytes: input.upload.sizeBytes,
      designerId: input.userId,
      description: input.classification.description,
      category: serializeList(attrs.category),
      garmentType: serializeList(attrs.garment),
      brand: serializeList(attrs.brand),
      gender: serializeList(attrs.gender),
      style: serializeList(attrs.style),
      material: serializeList(attrs.material),
      colorPalette: serializeList(attrs.colors),
      pattern: serializeList(attrs.pattern),
      season: "",
      occasion: serializeList(attrs.occasion),
      consumerProfile: "",
      trendNotes: "",
      locationContinent: null,
      locationCountry: null,
      locationCity: null,
      capturedAt: input.capturedAt ?? null,
      capturedYear,
      capturedMonth,
      capturedSeason,
      aiRawOutput: input.classification.rawOutput
    },
    include: {
      designer: true,
      annotations: { include: { author: true } }
    }
  });

  await refreshSearchIndex(image.id);

  return toLibraryImage(image);
}

export async function addAnnotation(input: {
  imageId: string;
  userId: string;
  notes: string;
}) {
  const image = await prisma.inspirationImage.findFirst({
    where: {
      id: input.imageId,
      designerId: input.userId
    },
    select: { id: true }
  });

  if (!image) {
    throw new ImageAccessError();
  }

  const annotation = await prisma.annotation.create({
    data: {
      imageId: input.imageId,
      authorId: input.userId,
      notes: input.notes.trim(),
      tags: ""
    },
    include: { author: true }
  });

  await refreshSearchIndex(input.imageId);

  return {
    id: annotation.id,
    notes: annotation.notes,
    tags: annotation.tags,
    authorName: annotation.author.name || annotation.author.email || "muse user",
    createdAt: annotation.createdAt.toISOString()
  };
}

export async function updateImageMetadata(input: {
  imageId: string;
  userId: string;
  title?: string | null;
  description?: string | null;
  tags: {
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
}) {
  const update = await prisma.inspirationImage.updateMany({
    where: {
      id: input.imageId,
      designerId: input.userId
    },
    data: {
      title: input.title?.trim() || null,
      ...(input.description !== undefined ? { description: input.description?.trim() || "" } : {}),
      category: serializeList(input.tags.category),
      garmentType: serializeList(input.tags.garment),
      brand: serializeList(input.tags.brand),
      gender: serializeList(input.tags.gender),
      style: serializeList(input.tags.style),
      material: serializeList(input.tags.material),
      colorPalette: serializeList(input.tags.colors),
      pattern: serializeList(input.tags.pattern),
      occasion: serializeList(input.tags.occasion)
    }
  });

  if (update.count === 0) {
    throw new ImageAccessError();
  }

  const image = await prisma.inspirationImage.findUniqueOrThrow({
    where: { id: input.imageId },
    include: {
      designer: true,
      annotations: { include: { author: true } }
    }
  });

  await refreshSearchIndex(input.imageId);

  return toLibraryImage(image);
}

export async function getImageDeletionTarget(imageId: string, userId: string) {
  return prisma.inspirationImage.findFirst({
    where: { id: imageId, designerId: userId },
    select: {
      id: true,
      sourceType: true,
      storageKey: true
    }
  });
}

export async function deleteImageRecord(imageId: string, userId: string) {
  const deleted = await prisma.inspirationImage.deleteMany({
    where: { id: imageId, designerId: userId }
  });

  if (deleted.count === 0) {
    throw new ImageAccessError();
  }
}

export async function listDesigners(userId: string) {
  return prisma.user.findMany({
    where: { id: userId },
    orderBy: { name: "asc" }
  });
}

async function refreshSearchIndex(imageId: string) {
  const image = await prisma.inspirationImage.findUnique({
    where: { id: imageId },
    include: {
      designer: true,
      annotations: { include: { author: true } }
    }
  });

  if (!image) {
    return;
  }

  const text = [
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
    image.season,
    image.occasion,
    image.consumerProfile,
    image.trendNotes,
    image.locationContinent,
    image.locationCountry,
    image.locationCity,
    image.designer.name,
    ...image.annotations.flatMap((annotation) => [
      annotation.notes,
      annotation.tags,
      annotation.author.name
    ])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  await prisma.imageSearchIndex.upsert({
    where: { imageId },
    update: { text },
    create: { imageId, text }
  });
}

function toLibraryImage(image: ImageWithRelations): LibraryImage {
  return {
    id: image.id,
    title: image.title,
    imageUrl: image.imageUrl,
    sourceType: image.sourceType,
    sourceUrl: image.sourceUrl,
    description: image.description,
    category: image.category,
    garmentType: image.garmentType,
    brand: image.brand,
    gender: image.gender,
    style: image.style,
    material: image.material,
    colorPalette: image.colorPalette,
    pattern: image.pattern,
    occasion: image.occasion,
    capturedYear: image.capturedYear,
    capturedMonth: image.capturedMonth,
    designerName: image.designer.name || image.designer.email || "muse user",
    createdAt: image.createdAt.toISOString(),
    annotations: image.annotations.map((annotation) => ({
      id: annotation.id,
      notes: annotation.notes,
      tags: annotation.tags,
      authorName: annotation.author.name || annotation.author.email || "muse user",
      createdAt: annotation.createdAt.toISOString()
    }))
  };
}
