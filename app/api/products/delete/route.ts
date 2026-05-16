import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";

type ProductType = "big-assistant" | "big-legal" | "big-social" | "big-vision";

const productCategoryByType: Record<ProductType, string> = {
  "big-assistant": "Big Assistant",
  "big-legal": "Big Legal",
  "big-social": "Big Social",
  "big-vision": "Big Vision",
};

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
    select: { role: { select: { name: true } } },
  });
  if (
    !employee ||
    (employee.role.name !== "ADMIN" && employee.role.name !== "MARKETING")
  ) {
    return NextResponse.redirect(new URL(`${redirectTo}?error=forbidden`, request.url));
  }

  if (!productType || !productId) {
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  const categoryName = productCategoryByType[productType];
  const existing = await prisma.product.findFirst({
    where: { id: productId, category: { categoryName } },
  });
  if (!existing) {
    return NextResponse.redirect(new URL(`${redirectTo}?error=1`, request.url));
  }
  const now = new Date();
  await prisma.$transaction([
    prisma.archivedProduct.create({
      data: {
        originalId: existing.id,
        categoryId: existing.categoryId,
        namaProduk: existing.namaProduk,
        hargaProduk: existing.hargaProduk,
        deskripsiProduk: existing.deskripsiProduk,
        durasiProduk: existing.durasiProduk,
        terjual: existing.terjual,
        deletedAt: now,
        deletedBy: employeeId,
      },
    }),
    prisma.product.delete({ where: { id: productId } }),
  ]);

  return NextResponse.redirect(new URL(redirectTo, request.url));
}

