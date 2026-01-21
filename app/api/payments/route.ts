import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionUserId } from "@/lib/auth";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

type ProductType = "big-assistant" | "big-legal" | "big-social" | "big-vision";

type OrderModel = {
  findUnique: (args: { where: { id: string } }) => Promise<{ id: string } | null>;
  create: (args: {
    data: {
      id: string;
      productType: "BIG_ASSISTANT" | "BIG_LEGAL" | "BIG_SOCIAL" | "BIG_VISION";
      productId: string;
      totalPesanan: string;
      namaCustomer: string;
      statusPesanan: string;
      jenisPembayaran: string;
      buktiPembayaran: string;
      userId: string;
    };
  }) => Promise<unknown>;
};

const productTypeMap: Record<
  ProductType,
  "BIG_ASSISTANT" | "BIG_LEGAL" | "BIG_SOCIAL" | "BIG_VISION"
> = {
  "big-assistant": "BIG_ASSISTANT",
  "big-legal": "BIG_LEGAL",
  "big-social": "BIG_SOCIAL",
  "big-vision": "BIG_VISION",
};

async function generateUniqueOrderId(model: OrderModel) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const id = String(Math.floor(1000 + Math.random() * 9000));
    const exists = await model.findUnique({ where: { id } });
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
  if (!productTypeMap[productType]) {
    return NextResponse.redirect(new URL("/", request.url));
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

  const orderModel = prisma.order as unknown as OrderModel;
  const id = await generateUniqueOrderId(orderModel);

  await orderModel.create({
    data: {
      id,
      productType: productTypeMap[productType],
      productId,
      totalPesanan: total,
      namaCustomer: user.fullName,
      statusPesanan: "Pending",
      jenisPembayaran: paymentMethod,
      buktiPembayaran: proofPath,
      userId,
    },
  });

  return NextResponse.redirect(new URL("/", request.url));
}
