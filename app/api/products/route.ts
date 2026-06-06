import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import { normalizeEmployeeRole } from "@/lib/employee-role";
import { toAppUrl } from "@/lib/app-url";

type ProductType = "big-assistant" | "big-legal" | "big-social" | "big-vision";

const productCategoryByType: Record<ProductType, string> = {
  "big-assistant": "Big Assistant",
  "big-legal": "Big Legal",
  "big-social": "Big Social",
  "big-vision": "Big Vision",
};

async function generateUniqueId() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const id = String(Math.floor(1000 + Math.random() * 9000));
    const exists = await prisma.product.findUnique({ where: { id } });
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

  const employeeId = await readEmployeeSessionId();
  if (!employeeId) {
    return NextResponse.redirect(toAppUrl("/login_karyawan", request.url));
  }
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId }, select: { role: true },
  });
  const roleName = normalizeEmployeeRole(employee?.role);
  if (
    !employee ||
    (roleName !== "admin" && roleName !== "marketing")
  ) {
    return NextResponse.redirect(toAppUrl(`${redirectTo}?error=forbidden`, request.url));
  }

  if (!productType || !name || !price || !description || !duration) {
    return NextResponse.redirect(toAppUrl(redirectTo, request.url));
  }

  const categoryName = productCategoryByType[productType];
  const category = await prisma.productCategory.findFirst({
    where: { categoryName },
    select: { id: true },
  });
  if (!category) {
    return NextResponse.redirect(toAppUrl(`${redirectTo}?error=category`, request.url));
  }
  const id = await generateUniqueId();

  await prisma.product.create({
    data: {
      id,
      categoryId: category.id,
      namaProduk: name,
      hargaProduk: price,
      deskripsiProduk: description,
      durasiProduk: duration,
      terjual: "0",
    },
  });

  return NextResponse.redirect(toAppUrl(redirectTo, request.url));
}

