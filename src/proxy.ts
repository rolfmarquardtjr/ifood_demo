import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes (except login page)
  if (pathname.startsWith("/admin/") && pathname !== "/admin") {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      // Renew token on each request (sliding window)
      const response = NextResponse.next();
      const newToken = jwt.sign({ role: "admin" }, process.env.JWT_SECRET!, {
        expiresIn: "8h",
      });
      response.cookies.set("admin_token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 8,
        path: "/",
      });
      return response;
    } catch {
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
