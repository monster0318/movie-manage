import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: any) {
  console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);
  const intlResponse = await intlMiddleware(req);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const protectedRoutes = ["/movies", "/movies/add", "/movies/edit"];
  const { pathname, locale } = req.nextUrl;
  const newlocale = locale || 'en';
  if (protectedRoutes.some((route) => String(pathname).includes(route)) && !token) {
    const loginUrl = new URL(`${newlocale}/auth/signin`, req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/") {
    const redirectUrl = new URL(`/${newlocale}/movies`, req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Apply middleware to these routes
export const config = {
  matcher: ["/", "/(fr|en)/:path*"], // Combine matchers for both middlewares
};