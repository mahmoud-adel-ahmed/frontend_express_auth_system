import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, max-age=0");

  if (
    pathname.startsWith("/auth/verify") ||
    pathname.startsWith("/auth/resetpassword")
  ) {
    const token = req.cookies.get("token");
    // console.log("🚀 ~ middleware ~ token:", token)
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signup", req.url));
    }
  }

  return NextResponse.next();
}

// Apply the middleware to only the /verify route
export const config = {
  matcher: ["/auth/verify", "/auth/resetpassword"],
};
