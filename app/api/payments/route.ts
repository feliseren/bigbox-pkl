import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

type ProductType = "big-assistant" | "big-legal" | "big-social" | "big-vision";

const productCategoryByType: Record<ProductType, string> = {
  "big-assistant": "Big Assistant",
  "big-legal": "Big Legal",
  "big-social": "Big Social",
  "big-vision": "Big Vision",
};

async function generateUniqueOrderId() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const id = String(Math.floor(1000 + Math.random() * 9000));
    const exists = await prisma.order.findUnique({ where: { id } });
    if (!exists) {
      return id;
    }
  }
  throw new Error("Unable to generate unique order id.");
}

export async function POST(request: Request) {
  const userId = await readSessionUserId();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const formData = await request.formData();
  const productType = String(formData.get("productType") || "").trim() as ProductType;
  const productId = String(formData.get("productId") || "").trim();
  const total = String(formData.get("total") || "").trim();
  const paymentMethod = String(formData.get("paymentMethod") || "").trim();
  const paymentProof = formData.get("paymentProof");

  if (!productType || !productId || !total || !paymentMethod) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  const categoryName = productCategoryByType[productType];
  if (!categoryName) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  const product = await prisma.product.findFirst({
    where: { id: productId, category: { categoryName } },
    select: { id: true },
  });
  if (!product) {
    return NextResponse.redirect(new URL("/pembayaran?error=product", request.url));
  }

  const proofFile =
    paymentProof && typeof paymentProof !== "string" ? paymentProof : null;
  if (!proofFile) {
    return NextResponse.redirect(new URL("/pembayaran", request.url));
  }
  const originalName = proofFile.name || "bukti";
  const ext = path.extname(originalName).toLowerCase();
  const safeBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "");
  const filename = `${safeBase || "bukti"}-${Date.now()}-${Math.floor(
    Math.random() * 10000,
  )}${ext || ".bin"}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const fileBuffer = Buffer.from(await proofFile.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), fileBuffer);
  const proofPath = `/uploads/${filename}`;

  const id = await generateUniqueOrderId();
  const defaultConfirmer = await prisma.employee.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
  if (!defaultConfirmer) {
    return NextResponse.redirect(new URL("/pembayaran?error=employee", request.url));
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.create({
      data: {
        id,
        productId: product.id,
        totalPesanan: total,
        namaCustomer: user.fullName,
        statusPesanan: "Pending",
        userId,
      },
    });
    await tx.payment.create({
      data: {
        orderId: id,
        confirmedBy: defaultConfirmer.id,
        jenisPembayaran: paymentMethod,
        buktiPembayaran: proofPath,
        statusPembayaran: "Pending",
      },
    });
  });

  return NextResponse.redirect(new URL("/", request.url));
}
