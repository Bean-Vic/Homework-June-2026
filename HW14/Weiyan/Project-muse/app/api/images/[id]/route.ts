import { NextRequest, NextResponse } from "next/server";
import { normalizeCategory, normalizeList } from "@/app/lib/attribute-utils";
import { requireCurrentUser, UnauthorizedError } from "@/app/lib/auth-user";
import {
  deleteImageRecord,
  getImageDeletionTarget,
  ImageAccessError,
  updateImageMetadata
} from "@/app/lib/repository";
import { deleteImageFromStorage } from "@/app/lib/storage";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireCurrentUser();
    const { id } = await params;
    const body = (await request.json()) as {
      title?: string | null;
      description?: string | null;
      tags?: Record<string, unknown>;
    };

    const image = await updateImageMetadata({
      imageId: id,
      userId: user.id,
      title: body.title,
      description: body.description,
      tags: {
        category: normalizeCategory(body.tags?.category),
        garment: normalizeList(body.tags?.garment),
        brand: normalizeList(body.tags?.brand),
        gender: normalizeList(body.tags?.gender),
        style: normalizeList(body.tags?.style),
        material: normalizeList(body.tags?.material),
        colors: normalizeList(body.tags?.colors),
        pattern: normalizeList(body.tags?.pattern),
        occasion: normalizeList(body.tags?.occasion)
      }
    });

    return NextResponse.json({ image });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed." },
      { status: statusForError(error) }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireCurrentUser();
    const { id } = await params;
    const target = await getImageDeletionTarget(id, user.id);

    if (!target) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    if (!target.storageKey.startsWith("external:")) {
      await deleteImageFromStorage(target.storageKey);
    }

    await deleteImageRecord(id, user.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed." },
      { status: statusForError(error) }
    );
  }
}

function statusForError(error: unknown) {
  if (error instanceof UnauthorizedError) return error.status;
  if (error instanceof ImageAccessError) return error.status;
  return 500;
}
