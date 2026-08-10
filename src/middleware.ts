import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

const AUTH_ROUTES = [
  "/login",
  "/forgot-password",
  "/forgot-password/otp",
  "/forgot-password/otp/reset-password",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/assets/")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (AUTH_ROUTES.includes(pathname)) {
    if (token?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

