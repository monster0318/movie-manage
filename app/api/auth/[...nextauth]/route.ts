// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Operations related to user authentication
 */

/**
 * @swagger
 * /api/auth/[...nextauth]:
 *   post:
 *     summary: Authenticate a user
 *     description: Authenticates a user using email and password with the credentials provider.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated the user. Returns a session JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid credentials or missing email/password.
 *       500:
 *         description: Server error during authentication process.
 */

/**
 * @swagger
 * /api/auth/[...nextauth]:
 *   get:
 *     summary: Fetch session information for the authenticated user.
 *     description: Retrieves the session information, including the user ID, if the user is authenticated.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: The authenticated user session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: User is not authenticated or session is invalid.
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     JWT:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * security:
 *   - JWT: []
 */

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      /**
       * @swagger
       * description: Validates the credentials and checks if the user exists in the database.
       * @param {object} credentials - The user's email and password.
       * @returns {object} - Returns the user object with id and email if credentials are valid.
       * @throws {Error} - Throws an error if credentials are invalid.
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid credentials");
        }
        return { id: user.id, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    /**
     * @swagger
     * description: This callback is used to add user ID to the session object.
     * @param {object} session - The session object to be modified.
     * @param {object} token - The JWT token containing the user ID.
     * @returns {object} - Returns the session with user ID added.
     */
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id; // Add user ID to session
      }
      return session;
    },
    /**
     * @swagger
     * description: This callback is used to add the user ID to the JWT token.
     * @param {object} token - The token object.
     * @param {object} user - The authenticated user object.
     * @returns {object} - Returns the JWT token with user ID added.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add user ID to JWT token
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
