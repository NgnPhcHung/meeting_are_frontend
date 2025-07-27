import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("authorization")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (!accessToken && refreshToken && !isPublicPath) {
    const refreshRes = await fetch(
      `${request.nextUrl.origin}/api/refresh-token`,
      {
        method: "POST",
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      },
    );

    if (refreshRes.ok) {
      const response = NextResponse.next();
      const setCookie = refreshRes.headers.get("set-cookie");
      if (setCookie) response.headers.set("Set-Cookie", setCookie);
      return response;
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (!accessToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (accessToken && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
