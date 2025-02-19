import { NextResponse } from "next/server";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerSpec from "@/lib/swagger";

export async function GET() {
  try {
    const spec = swaggerJSDoc(swaggerSpec); 
    return NextResponse.json(spec);
  } catch (error) {
    const err = error as Error; // ✅ Typecast error to Error
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
