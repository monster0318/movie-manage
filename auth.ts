import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        if (typeof email !== "string") {
          throw new Error("Invalid email type");
        }
        const user = await prisma.user.findUnique({
          where: { email },
        });
      
        if (!user || !user.password) {
          throw new Error("No user Found");
        }
      
        if (!(await bcrypt.compare(String(password), user.password))) {
            throw new Error("Invalid credentials");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const ProtectedRoutes = ["/movies", "/movies/add", "movies/edit"];

      if (!isLoggedIn && ProtectedRoutes.includes(nextUrl.pathname)) {
        return Response.redirect(new URL("/auth/signin", nextUrl));
      }
      if (isLoggedIn && nextUrl.pathname.startsWith("/auth/signin")) {
        return Response.redirect(new URL("/movies", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) token.role = user.id;
      return token;
    },
    session({ session, token }) {
      if (typeof token.sub === "string") {
        session.user.id = token.sub;
      } else {
        throw new Error("Token sub is missing or invalid");
      }
      return session;
    },
  },
});