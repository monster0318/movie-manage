// app/api/docs/route.ts

import { NextResponse } from "next/server";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerSpec from "@/lib/swagger"; // Your Swagger config file

export async function GET() {
  const spec = swaggerJSDoc(swaggerSpec);
  return NextResponse.json(spec);
}
