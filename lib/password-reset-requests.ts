import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const RESET_TOKEN_TTL_MINUTES = 60;

export function createResetAccessToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);
  return { token, tokenHash, expiresAt };
}

function approvedOrIssuedFilter() {
  return {
    OR: [{ status: "approved" }, { status: "issued" }],
  };
}

export async function requestCustomerPasswordReset(userId: string) {
  const activeRequest = await prisma.passwordResetRequest.findFirst({
    where: {
      userId,
      ...approvedOrIssuedFilter(),
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  if (activeRequest) {
    const { token, tokenHash, expiresAt } = createResetAccessToken();
    await prisma.passwordResetRequest.update({
      where: { id: activeRequest.id },
      data: {
        status: "issued",
        tokenHash,
        expiresAt,
        usedAt: null,
      },
    });
    return { kind: "issued" as const, token };
  }

  const pendingRequest = await prisma.passwordResetRequest.findFirst({
    where: { userId, status: "pending" },
    orderBy: [{ createdAt: "desc" }],
  });

  if (pendingRequest) {
    return { kind: "pending" as const };
  }

  const latestRequest = await prisma.passwordResetRequest.findFirst({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }],
  });

  await prisma.passwordResetRequest.create({
    data: {
      accountType: "customer",
      status: "pending",
      userId,
      rejectedAt: null,
      approvedAt: null,
      usedAt: null,
      tokenHash: null,
      expiresAt: null,
    },
  });

  return {
    kind:
      latestRequest?.status === "rejected"
        ? ("requested_after_rejected" as const)
        : ("requested" as const),
  };
}

export async function requestEmployeePasswordReset(employeeId: string) {
  const activeRequest = await prisma.passwordResetRequest.findFirst({
    where: {
      employeeId,
      ...approvedOrIssuedFilter(),
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  if (activeRequest) {
    const { token, tokenHash, expiresAt } = createResetAccessToken();
    await prisma.passwordResetRequest.update({
      where: { id: activeRequest.id },
      data: {
        status: "issued",
        tokenHash,
        expiresAt,
        usedAt: null,
      },
    });
    return { kind: "issued" as const, token };
  }

  const pendingRequest = await prisma.passwordResetRequest.findFirst({
    where: { employeeId, status: "pending" },
    orderBy: [{ createdAt: "desc" }],
  });

  if (pendingRequest) {
    return { kind: "pending" as const };
  }

  const latestRequest = await prisma.passwordResetRequest.findFirst({
    where: { employeeId },
    orderBy: [{ updatedAt: "desc" }],
  });

  await prisma.passwordResetRequest.create({
    data: {
      accountType: "employee",
      status: "pending",
      employeeId,
      rejectedAt: null,
      approvedAt: null,
      usedAt: null,
      tokenHash: null,
      expiresAt: null,
    },
  });

  return {
    kind:
      latestRequest?.status === "rejected"
        ? ("requested_after_rejected" as const)
        : ("requested" as const),
  };
}

export async function approvePasswordResetRequest(id: string, approvedById: string) {
  const request = await prisma.passwordResetRequest.findUnique({
    where: { id },
  });
  if (!request || request.status !== "pending") return false;

  await prisma.passwordResetRequest.update({
    where: { id },
    data: {
      status: "approved",
      approvedAt: new Date(),
      rejectedAt: null,
      approvedById,
      tokenHash: null,
      expiresAt: null,
      usedAt: null,
    },
  });
  return true;
}

export async function rejectPasswordResetRequest(id: string, approvedById: string) {
  const request = await prisma.passwordResetRequest.findUnique({
    where: { id },
  });
  if (!request || request.status !== "pending") return false;

  await prisma.passwordResetRequest.update({
    where: { id },
    data: {
      status: "rejected",
      rejectedAt: new Date(),
      approvedById,
      tokenHash: null,
      expiresAt: null,
      usedAt: null,
    },
  });
  return true;
}

export async function findValidPasswordResetRequestToken(token: string) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const now = new Date();
  return prisma.passwordResetRequest.findFirst({
    where: {
      tokenHash,
      status: "issued",
      usedAt: null,
      expiresAt: { gt: now },
    },
    include: {
      user: true,
      employee: true,
    },
  });
}

export async function completePasswordResetRequest(id: string) {
  await prisma.passwordResetRequest.update({
    where: { id },
    data: {
      status: "completed",
      usedAt: new Date(),
    },
  });
}
