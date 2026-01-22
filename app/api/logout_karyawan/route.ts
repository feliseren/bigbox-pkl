import { NextResponse } from "next/server";
import { clearEmployeeSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.redirect(
    new URL("/login_karyawan", request.url),
    303,
  );
  response.cookies.set(clearEmployeeSessionCookie());
  return response;
}
