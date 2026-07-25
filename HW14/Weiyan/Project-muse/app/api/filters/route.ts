import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser, UnauthorizedError } from "@/app/lib/auth-user";
import { listFilterOptions } from "@/app/lib/repository";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await requireCurrentUser();
    const filters = await listFilterOptions(user.id, {
      category: values(request.nextUrl.searchParams, "category")
    });
    return NextResponse.json(filters);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load filters." },
      { status: error instanceof UnauthorizedError ? error.status : 500 }
    );
  }
}

function values(params: URLSearchParams, key: string) {
  const selected = params
    .getAll(key)
    .flatMap((value) => value.split(/[;,]/))
    .map((value) => value.trim())
    .filter(Boolean);

  return selected.length > 0 ? selected : undefined;
}
