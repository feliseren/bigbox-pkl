import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import { normalizeEmployeeRole } from "@/lib/employee-role";

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
  const name = String(formData.get("name") || "").trim();
  const price = String(formData.get("price") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const duration = String(formData.get("duration") || "").trim();

  const employeeId = await readEmployeeSessionId();
  if (!employeeId) {
    return NextResponse.redirect(new URL("/login_karyawan", request.url));
  }
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId }, select: { role: true },
  });
  const roleName = normalizeEmployeeRole(employee?.role);
  if (
    !employee ||
    (roleName !== "admin" && roleName !== "marketing")
  ) {
    return NextResponse.redirect(new URL(`${redirectTo}?error=forbidden`, request.url));
  }

  if (!productType || !productId) {
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  const categoryName = productCategoryByType[productType];
  await prisma.product.updateMany({
    where: {
      id: productId,
      category: { categoryName },
      archivedProducts: { none: {} },
    },
    data: {
      ...(name ? { namaProduk: name } : {}),
      ...(price ? { hargaProduk: price } : {}),
      ...(description ? { deskripsiProduk: description } : {}),
      ...(duration ? { durasiProduk: duration } : {}),
    },
  });

  return NextResponse.redirect(new URL(redirectTo, request.url));
}

