import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const RESET_TOKEN_TTL_MINUTES = 60;

export function createResetToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);
  return { token, tokenHash, expiresAt };
}

export async function markPreviousTokensUsed(userId: string) {
  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });
}

export async function findValidToken(token: string) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const now = new Date();
  return prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: now },
    },
    include: { user: true },
  });
}
