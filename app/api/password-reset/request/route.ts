import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requestCustomerPasswordReset } from "@/lib/password-reset-requests";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!email) {
    return NextResponse.redirect(new URL("/forgot-password?error=1", request.url));
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.redirect(new URL("/forgot-password?error=1", request.url));
  }

  const result = await requestCustomerPasswordReset(user.id);
  if (result.kind === "issued") {
    return NextResponse.redirect(
      new URL(
        `/reset-password?token=${result.token}&type=customer&status=approved`,
        request.url,
      ),
    );
  }

  const status =
    result.kind === "pending"
      ? "pending"
      : result.kind === "requested_after_rejected"
        ? "rejected_requested"
        : "requested";
  return NextResponse.redirect(new URL(`/forgot-password?status=${status}`, request.url));
}
