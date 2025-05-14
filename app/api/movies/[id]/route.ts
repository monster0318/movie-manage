<<<<<<< HEAD
import { NextResponse } from "next/server";
=======
// app/api/movies/[id]/route.ts
import { NextResponse  } from "next/server";
>>>>>>> c0e6160b4071b30e470b0dd52ccef3848c617eab
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

/**
 * @swagger
 * tags:
 *   - name: Movies
 *     description: Operations related to movies
 */

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Update a movie
 *     description: Updates a movie's details in the database using the provided `id`, `title`, `year`, and `imgUrl`.
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the movie to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the movie
 *               year:
 *                 type: integer
 *                 description: The new publishing year of the movie
 *               imgUrl:
 *                 type: string
 *                 description: The new URL for the movie's image
 *     responses:
 *       200:
 *         description: Successfully updated movie
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to update movie
 */

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     description: Deletes a movie from the database based on the provided `id`.
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the movie to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Movie deleted
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to delete movie
 */

/**
 * @swagger
 * description: This function updates the details of a movie based on the `id` provided in the request URL. It expects a `title`, `year`, and `imgUrl` in the request body.
 * @param {Request} req - The incoming request containing movie details.
 * @param {Object} params - The URL parameters, including the `id` of the movie to update.
 * @returns {NextResponse} - Returns the updated movie details or an error message if something went wrong.
 */


export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id

    const { title, year, imgUrl } = await req.json();

    const updatedMovie = await prisma.movie.update({
      where: { id }, // ✅ Ensure `id` is used correctly
      data: { title, year, imgUrl },
    });

    return NextResponse.json(updatedMovie, { status: 200 });
  } catch (error) {
    console.error("Error updating movie:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


/**
 * @swagger
 * description: This function deletes a movie based on the provided `id` in the request URL.
 * @param {Request} req - The incoming request (not used in this case).
 * @param {Object} params - The URL parameters, including the `id` of the movie to delete.
 * @returns {NextResponse} - Returns a success message if the movie is deleted, or an error message if something went wrong.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  await prisma.movie.delete({ where: { id } });

  return NextResponse.json({ message: "Movie deleted" });
}
