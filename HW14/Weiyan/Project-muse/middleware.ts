import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  if (
    process.env.MOCK_AUTH_ENABLED === "true" &&
    request.headers.get("x-muse-test-user-id")
  ) {
    return NextResponse.next();
  }

  if (process.env.MOCK_AUTH_USER_ID) {
    return NextResponse.next();
  }

  const isLoginPage = request.nextUrl.pathname === "/login";
  const hasSessionCookie =
    request.cookies.has("authjs.session-token") ||
    request.cookies.has("__Secure-authjs.session-token") ||
    request.cookies.has("next-auth.session-token") ||
    request.cookies.has("__Secure-next-auth.session-token");

  if (!hasSessionCookie && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSessionCookie && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"]
};
