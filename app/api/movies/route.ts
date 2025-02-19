// app/api/movies/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * tags:
 *   - name: Movies
 *     description: Operations related to movies
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     description: Fetches a list of all movies in the database.
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Successfully fetched movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   imgUrl:
 *                     type: string
 *                   userId:
 *                     type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch movies
 */

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
 *     description: Adds a new movie to the database with the provided details.
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the movie
 *               year:
 *                 type: integer
 *                 description: The publishing year of the movie
 *               imgUrl:
 *                 type: string
 *                 description: The URL of the movie's image
 *               userId:
 *                 type: string
 *                 description: The user ID of the person adding the movie
 *     responses:
 *       201:
 *         description: Movie successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 year:
 *                   type: integer
 *                 imgUrl:
 *                   type: string
 *                 userId:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to create movie
 */

/**
 * @swagger
 * description: This function fetches all movies from the database.
 * @returns {NextResponse} - Returns a list of movies, or an error message if something goes wrong.
 */
export async function GET() {
  try {
    const movies = await prisma.movie.findMany();
    return NextResponse.json(movies);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}

/**
 * @swagger
 * description: This function creates a new movie in the database based on the provided details.
 * @param {Request} req - The incoming request containing movie details (title, year, imgUrl, userId).
 * @returns {NextResponse} - Returns the newly created movie object, or an error message if something went wrong.
 */

export async function POST(req: Request) {
  const { title, year, imgUrl, userId } = await req.json();

  const newMovie = await prisma.movie.create({
    data: { title, year, imgUrl, userId },
  });

  return NextResponse.json(newMovie, { status: 201 });
}
