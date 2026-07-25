import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser, UnauthorizedError } from "@/app/lib/auth-user";
import { addAnnotation, ImageAccessError } from "@/app/lib/repository";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireCurrentUser();
    const { id } = await params;
    const body = (await request.json()) as {
      designerName?: string;
      notes?: string;
    };

    if (!body.notes?.trim()) {
      return NextResponse.json({ error: "Annotation notes are required." }, { status: 400 });
    }

    const annotation = await addAnnotation({
      imageId: id,
      userId: user.id,
      notes: body.notes
    });

    return NextResponse.json({ annotation }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Annotation failed." },
      { status: statusForError(error) }
    );
  }
}

function statusForError(error: unknown) {
  if (error instanceof UnauthorizedError) return error.status;
  if (error instanceof ImageAccessError) return error.status;
  return 500;
}
