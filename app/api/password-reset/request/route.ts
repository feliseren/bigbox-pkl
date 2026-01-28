import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createResetToken, markPreviousTokensUsed } from "@/lib/password-reset";
import { sendEmail } from "@/lib/email";

function getAppUrl(requestUrl: string) {
  return process.env.APP_URL || new URL(requestUrl).origin;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!email) {
    return NextResponse.redirect(new URL("/forgot-password?error=1", request.url));
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.hasLocalPassword) {
    return NextResponse.redirect(new URL("/forgot-password?error=1", request.url));
  }

  await markPreviousTokensUsed(user.id);
  const { token, tokenHash, expiresAt } = createResetToken();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  const appUrl = getAppUrl(request.url);
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset Password BigBox",
    html: `
      <p>Halo ${user.fullName},</p>
      <p>Silakan reset password Anda dengan klik link berikut (berlaku 60 menit):</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Jika Anda tidak meminta reset, abaikan email ini.</p>
    `,
  });

  return NextResponse.redirect(new URL("/login?reset=1", request.url));
}
