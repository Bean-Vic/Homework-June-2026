import { NextRequest, NextResponse } from "next/server";
import { classifyImage } from "@/app/lib/classifier";
import { requireCurrentUser, UnauthorizedError } from "@/app/lib/auth-user";
import { createImageRecord, listImages } from "@/app/lib/repository";
import { uploadImageToStorage } from "@/app/lib/storage";
import type { LibraryFilters } from "@/app/lib/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await requireCurrentUser();
    const params = request.nextUrl.searchParams;
    const filters: LibraryFilters = {
      query: value(params, "query"),
      category: values(params, "category"),
      garment: values(params, "garment"),
      brand: values(params, "brand"),
      gender: values(params, "gender"),
      style: values(params, "style"),
      material: values(params, "material"),
      color: values(params, "color"),
      pattern: values(params, "pattern"),
      occasion: values(params, "occasion"),
      addedFrom: value(params, "addedFrom"),
      addedTo: value(params, "addedTo"),
      year: values(params, "year"),
      month: values(params, "month")
    };

    const images = await listImages(filters, user.id);
    return NextResponse.json({ images });
  } catch (error) {
    return routeError(error, "Could not load images.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireCurrentUser();
    const form = await request.formData();
    const file = form.get("image");
    const photoUrl = text(form, "photoUrl");
    const title = text(form, "title");
    const hasFile = file instanceof File && file.size > 0;
    const hasUrl = photoUrl.length > 0;

    if (hasFile === hasUrl) {
      return NextResponse.json(
        { error: "Choose either an image upload or a photo URL." },
        { status: 400 }
      );
    }

    if (hasFile && !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are supported." }, { status: 400 });
    }

    const upload = hasFile
      ? await uploadUploadedFile(file, user.id)
      : await uploadRemoteUrl(photoUrl, user.id);
    const classification = await classifyImage(upload.publicUrl, title);

    const image = await createImageRecord({
      title,
      userId: user.id,
      upload: {
        ...upload
      },
      classification,
      capturedAt: new Date()
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    return routeError(error, "Upload failed.");
  }
}

function value(params: URLSearchParams, key: string) {
  return params.get(key)?.trim() || undefined;
}

function values(params: URLSearchParams, key: string) {
  const selected = params
    .getAll(key)
    .flatMap((value) => value.split(/[;,]/))
    .map((value) => value.trim())
    .filter(Boolean);

  return selected.length > 0 ? selected : undefined;
}

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function uploadUploadedFile(file: File, userId: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const upload = await uploadImageToStorage({
    buffer,
    fileName: file.name,
    mimeType: file.type,
    userId
  });

  return {
    ...upload,
    mimeType: file.type,
    sizeBytes: buffer.byteLength,
    sourceType: "upload" as const,
    sourceUrl: null
  };
}

async function uploadRemoteUrl(photoUrl: string, userId: string) {
  let url: URL;

  try {
    url = new URL(photoUrl);
  } catch {
    throw new RequestError("Photo URL must be a valid URL.", 400);
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new RequestError("Photo URL must start with http:// or https://.", 400);
  }

  if (process.env.MOCK_EXTERNAL_SERVICES === "true") {
    return {
      publicUrl: url.toString(),
      storageKey: `external:${url.toString()}`,
      mimeType: "image/remote",
      sizeBytes: 0,
      sourceType: "url" as const,
      sourceUrl: url.toString()
    };
  }

  const response = await fetch(url, {
    headers: {
      Accept: "image/jpeg,image/png,image/webp,image/*;q=0.8,*/*;q=0.5",
      "User-Agent":
        "Mozilla/5.0 (compatible; muse/1.0; +https://localhost)"
    }
  });

  if (!response.ok) {
    throw new RequestError(
      `Could not download photo URL (${response.status}). Try uploading the image file instead.`,
      400
    );
  }

  const mimeType = response.headers.get("content-type")?.split(";")[0]?.trim() || "image/jpeg";
  if (!mimeType.startsWith("image/")) {
    throw new RequestError("Photo URL must point to an image file.", 400);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const upload = await uploadImageToStorage({
    buffer,
    fileName: fileNameFromUrl(url, mimeType),
    mimeType,
    userId
  });

  return {
    ...upload,
    mimeType,
    sizeBytes: buffer.byteLength,
    sourceType: "url" as const,
    sourceUrl: url.toString()
  };
}

function fileNameFromUrl(url: URL, mimeType: string) {
  const pathName = decodeURIComponent(url.pathname.split("/").filter(Boolean).at(-1) || "");
  const fallbackExtension = extensionForMimeType(mimeType);
  const baseName = pathName && pathName.includes(".") ? pathName : `${url.hostname}${fallbackExtension}`;

  return baseName || `remote-image${fallbackExtension}`;
}

function extensionForMimeType(mimeType: string) {
  if (mimeType.includes("png")) return ".png";
  if (mimeType.includes("webp")) return ".webp";
  if (mimeType.includes("gif")) return ".gif";
  if (mimeType.includes("avif")) return ".avif";
  if (mimeType.includes("svg")) return ".svg";
  return ".jpg";
}

class RequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function routeError(error: unknown, fallback: string) {
  const status =
    error instanceof UnauthorizedError
      ? error.status
      : error instanceof RequestError
        ? error.status
        : isClassifierImageDecodeError(error)
          ? 400
        : 500;

  return NextResponse.json(
    { error: friendlyErrorMessage(error, fallback) },
    { status }
  );
}

function friendlyErrorMessage(error: unknown, fallback: string) {
  if (error instanceof RequestError) {
    return error.message;
  }

  if (error instanceof UnauthorizedError) {
    return error.message;
  }

  if (isClassifierImageDecodeError(error)) {
    return "This image format could not be read. Try uploading the file, or use a JPEG/PNG image URL.";
  }

  return error instanceof Error ? error.message : fallback;
}

function isClassifierImageDecodeError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return /invalid image content|decode image config|unknown format|invalid image/i.test(error.message);
}
