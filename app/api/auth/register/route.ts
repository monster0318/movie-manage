// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
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
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with the provided email and password, ensuring the user does not already exist.
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
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       201:
 *         description: User successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Validation error (e.g., missing email or password, or user already exists).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: All fields are required or User already exists
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Something went wrong
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

/**
 * @swagger
 * description: This function handles the user registration process by validating inputs, hashing the password, and creating a new user in the database.
 * @param {Request} req - The incoming request containing user email and password in JSON format.
 * @returns {NextResponse} - Returns a response with a success message and the newly created user, or an error if something went wrong.
 */
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
