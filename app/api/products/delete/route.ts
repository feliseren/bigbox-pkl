import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ProductType = "big-assistant" | "big-legal" | "big-social" | "big-vision";

type ProductModel = {
  delete: (args: { where: { id: string } }) => Promise<unknown>;
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

export async function POST(request: Request) {
  const formData = await request.formData();
  const productType = String(formData.get("productType") || "").trim() as ProductType;
  const redirectTo = String(formData.get("redirect") || "/dashboard_karyawan/daftar-produk");
  const productId = String(formData.get("productId") || "").trim();

  if (!productType || !productId) {
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  const model = getModel(productType);
  await model.delete({ where: { id: productId } });

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
