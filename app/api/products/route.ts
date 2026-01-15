import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ProductType = "big-assistant" | "big-legal" | "big-social" | "big-vision";

type ProductModel = {
  findUnique: (args: { where: { id: string } }) => Promise<{ id: string } | null>;
  create: (args: {
    data: {
      id: string;
      namaProduk: string;
      hargaProduk: string;
      deskripsiProduk: string;
      durasiProduk: string;
      terjual: string;
    };
  }) => Promise<unknown>;
};

function getModel(productType: ProductType) {
  switch (productType) {
    case "big-assistant":
      return prisma.bigAssistant as unknown as ProductModel;
    case "big-legal":
      return prisma.bigLegal as unknown as ProductModel;
    case "big-social":
      return prisma.bigSocial as unknown as ProductModel;
    case "big-vision":
      return prisma.bigVision as unknown as ProductModel;
    default:
      return prisma.bigAssistant as unknown as ProductModel;
  }
}

async function generateUniqueId(model: ProductModel) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const id = String(Math.floor(1000 + Math.random() * 9000));
    const exists = await model.findUnique({ where: { id } });
    if (!exists) {
      return id;
    }
  }
  throw new Error("Unable to generate unique id.");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const productType = String(formData.get("productType") || "").trim() as ProductType;
  const redirectTo = String(formData.get("redirect") || "/dashboard_karyawan/daftar-produk");
  const name = String(formData.get("name") || "").trim();
  const price = String(formData.get("price") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const duration = String(formData.get("duration") || "").trim();

  if (!productType || !name || !price || !description || !duration) {
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  const model = getModel(productType);
  const id = await generateUniqueId(model);

  await model.create({
    data: {
      id,
      namaProduk: name,
      hargaProduk: price,
      deskripsiProduk: description,
      durasiProduk: duration,
      terjual: "0",
    },
  });

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
