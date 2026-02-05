import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";

type ProductType = "big-assistant" | "big-legal" | "big-social" | "big-vision";

type ProductModel = {
  findUnique: (args: { where: { id: string } }) => Promise<{
    id: string;
    namaProduk: string;
    hargaProduk: string;
    deskripsiProduk: string;
    durasiProduk: string;
    terjual: string;
  } | null>;
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

  const employeeId = await readEmployeeSessionId();
  if (!employeeId) {
    return NextResponse.redirect(new URL("/login_karyawan", request.url));
  }
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { role: true },
  });
  if (!employee || (employee.role !== "ADMIN" && employee.role !== "MARKETING")) {
    return NextResponse.redirect(new URL(`${redirectTo}?error=forbidden`, request.url));
  }

  if (!productType || !productId) {
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  const model = getModel(productType);
  const existing = await model.findUnique({ where: { id: productId } });
  if (!existing) {
    return NextResponse.redirect(new URL(`${redirectTo}?error=1`, request.url));
  }
  const now = new Date();
  await prisma.$transaction([
    prisma.archivedProduct.create({
      data: {
        originalId: existing.id,
        productType:
          productType === "big-assistant"
            ? "BIG_ASSISTANT"
            : productType === "big-legal"
              ? "BIG_LEGAL"
              : productType === "big-social"
                ? "BIG_SOCIAL"
                : "BIG_VISION",
        namaProduk: existing.namaProduk,
        hargaProduk: existing.hargaProduk,
        deskripsiProduk: existing.deskripsiProduk,
        durasiProduk: existing.durasiProduk,
        terjual: existing.terjual,
        deletedAt: now,
        deletedBy: employeeId,
      },
    }),
    model.delete({ where: { id: productId } }),
  ]);

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
