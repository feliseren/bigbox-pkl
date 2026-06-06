import { NextResponse } from "next/server";
import { clearEmployeeSessionCookie } from "@/lib/auth";
import { toAppUrl } from "@/lib/app-url";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.redirect(
    toAppUrl("/login_karyawan", request.url),
    303,
  );
  response.cookies.set(clearEmployeeSessionCookie());
  return response;
}
