import { NextResponse } from "next/server";
import { requireCurrentUser, UnauthorizedError } from "@/app/lib/auth-user";
import { listDesigners } from "@/app/lib/repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const designers = await listDesigners(user.id);
    return NextResponse.json({
      designers: designers.map((designer) => ({
        id: designer.id,
        name: designer.name || designer.email || "muse user"
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load designers." },
      { status: error instanceof UnauthorizedError ? error.status : 500 }
    );
  }
}
