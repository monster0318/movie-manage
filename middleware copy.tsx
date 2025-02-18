import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const token = await getToken({ req });

  // List of protected routes
  const protectedRoutes = ["/movies", "/movies/add", "/movies/edit"];
  const { pathname, locale } = req.nextUrl;  // Get the current pathname and locale

  // Set default locale if it's not present
  const newlocale = locale || 'en'; // Fallback to 'en' if no locale is provided

  // Log the current path


  // Redirect to login page if not authenticated and trying to access protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL(`/auth/login`, req.url);
    loginUrl.searchParams.set("locale", newlocale); // Add locale to the query string
    console.log(loginUrl)
    return NextResponse.redirect(loginUrl);
  }

  // Redirect from "/" to "/movies" with the correct locale
  if (pathname === "/") {
    const redirectUrl = new URL(`/${newlocale}/movies`, req.url); // Correct the path format
    console.log("redirect", redirectUrl.pathname)
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Apply middleware to these routes
export const config = {
  matcher: ["/:path*"], // Apply middleware to all paths
};
