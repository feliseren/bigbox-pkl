import { prisma } from "@/lib/prisma";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
};

const monthLabel = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

function formatDate(value: Date) {
  const year = value.getFullYear();
  const month = monthLabel[value.getMonth()];
  const day = String(value.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
}

function parseDuration(value: string | null | undefined) {
  const raw = (value ?? "").toLowerCase();
  const numberMatch = raw.match(/\d+/);
  const amount = numberMatch ? Number(numberMatch[0]) : 1;
  if (raw.includes("tahun")) {
    return { months: amount * 12 };
  }
  if (raw.includes("bulan")) {
    return { months: amount };
  }
  if (raw.includes("hari")) {
    return { days: amount };
  }
  return { months: 1 };
}

function addDuration(base: Date, duration: { months?: number; days?: number }) {
  const result = new Date(base);
  if (duration.months) {
    result.setMonth(result.getMonth() + duration.months);
  }
  if (duration.days) {
    result.setDate(result.getDate() + duration.days);
  }
  return result;
}

export async function getUserNotifications(
  userId: string,
): Promise<NotificationItem[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          namaProduk: true,
          durasiProduk: true,
        },
      },
    },
  });
  if (orders.length === 0) return [];

  const now = new Date();
  return orders.flatMap((order) => {
    const product = order.product;
    if (!product) return [];
    const duration = parseDuration(product.durasiProduk);
    const endDate = addDuration(order.createdAt, duration);
    if (now <= endDate) return [];
    return [
      {
        id: order.id,
        title: product.namaProduk,
        message: `Langganan produk ${product.namaProduk} sudah berakhir pada ${formatDate(
          endDate,
        )}.`,
      },
    ];
  });
}
