// app/api/upload/route.ts
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

/**
 * @swagger
 * tags:
 *   - name: Uploads
 *     description: Operations related to file uploads
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file
 *     description: Uploads a file to the server and saves it to the `public/uploads` directory.
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: /uploads/1616161616161-image.jpg
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No file uploaded
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to upload file
 */

/**
 * @swagger
 * description: This function handles the file upload by receiving a file in a multipart/form-data request, saving it to the server's `public/uploads` folder, and returning the URL to access the uploaded file.
 * @param {Request} req - The incoming request containing the file to upload.
 * @returns {NextResponse} - Returns a response with the URL of the uploaded file or an error message.
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    console.log(file);
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${fileName}` }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
