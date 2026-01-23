import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const TIME_ZONE = "Asia/Jakarta";

function getDatePartsInTimeZone(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const lookup: Record<string, string> = {};
  parts.forEach((part) => {
    if (part.type !== "literal") {
      lookup[part.type] = part.value;
    }
  });
  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
  };
}

function dateKeyInTimeZone(date: Date) {
  const { year, month, day } = getDatePartsInTimeZone(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseCurrency(value: string) {
  const numeric = value.replace(/[^0-9]/g, "");
  const parsed = Number(numeric);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatRupiah(value: number) {
  if (!value) return "Rp 0";
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function escapePdf(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildSimplePdf(content: string) {
  const objects = [
    "",
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream\nendobj\n`,
  ];
  let output = "%PDF-1.4\n";
  const offsets: number[] = [0];
  let offset = Buffer.byteLength(output);
  for (let i = 1; i < objects.length; i += 1) {
    offsets[i] = offset;
    output += objects[i];
    offset += Buffer.byteLength(objects[i]);
  }
  const xrefOffset = offset;
  output += `xref\n0 ${objects.length}\n`;
  output += "0000000000 65535 f \n";
  for (let i = 1; i < objects.length; i += 1) {
    output += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  output += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(output, "ascii");
}

export async function GET() {
  const doneOrdersAll = await prisma.order.findMany({
    where: { statusPesanan: "Done" },
  });
  const [bigAssistant, bigLegal, bigSocial, bigVision] = await Promise.all([
    prisma.bigAssistant.findMany(),
    prisma.bigLegal.findMany(),
    prisma.bigSocial.findMany(),
    prisma.bigVision.findMany(),
  ]);

  const productByKey = new Map<string, { name: string; price: string; type: string }>();
  bigAssistant.forEach((item) => {
    productByKey.set(`BIG_ASSISTANT:${item.id}`, {
      name: item.namaProduk,
      price: item.hargaProduk,
      type: "Big Assistant",
    });
  });
  bigLegal.forEach((item) => {
    productByKey.set(`BIG_LEGAL:${item.id}`, {
      name: item.namaProduk,
      price: item.hargaProduk,
      type: "Big Legal",
    });
  });
  bigSocial.forEach((item) => {
    productByKey.set(`BIG_SOCIAL:${item.id}`, {
      name: item.namaProduk,
      price: item.hargaProduk,
      type: "Big Social",
    });
  });
  bigVision.forEach((item) => {
    productByKey.set(`BIG_VISION:${item.id}`, {
      name: item.namaProduk,
      price: item.hargaProduk,
      type: "Big Vision",
    });
  });

  const productStats = new Map<
    string,
    { name: string; type: string; count: number; revenue: number }
  >();
  doneOrdersAll.forEach((order) => {
    const key = `${order.productType}:${order.productId}`;
    const product = productByKey.get(key);
    if (!product) return;
    const entry = productStats.get(key) ?? {
      name: product.name,
      type: product.type,
      count: 0,
      revenue: 0,
    };
    entry.count += 1;
    entry.revenue += parseCurrency(product.price);
    productStats.set(key, entry);
  });

  const rows = Array.from(productStats.values()).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 40;
  const tableTop = 660;
  const rowHeight = 18;
  const columns = [
    { title: "No", width: 28, align: "center" },
    { title: "Nama Produk", width: 240, align: "left" },
    { title: "Jenis AI", width: 90, align: "left" },
    { title: "Total Penjualan", width: 90, align: "right" },
    { title: "Total Pendapatan", width: 120, align: "right" },
  ] as const;
  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);
  const startX = margin;
  const maxRows = Math.max(0, Math.floor((tableTop - 120) / rowHeight) - 1);
  const visibleRows = rows.slice(0, maxRows);
  const hiddenCount = rows.length - visibleRows.length;
  const totalRows = visibleRows.length + 1;
  const tableBottom = tableTop - rowHeight * totalRows;
  const colX: number[] = [startX];
  columns.forEach((col) => {
    colX.push(colX[colX.length - 1] + col.width);
  });
  const truncateToFit = (value: string, width: number) => {
    const maxChars = Math.max(1, Math.floor(width / 5.5));
    if (value.length <= maxChars) return value;
    return `${value.slice(0, Math.max(1, maxChars - 3))}...`;
  };
  const textAt = (x: number, y: number, text: string, size = 10) =>
    `BT\n/F1 ${size} Tf\n${x} ${y} Td\n(${escapePdf(text)}) Tj\nET`;
  const line = (x1: number, y1: number, x2: number, y2: number) =>
    `${x1} ${y1} m\n${x2} ${y2} l\nS`;

  const contentParts: string[] = [];
  contentParts.push("0.5 w");
  contentParts.push(textAt(startX, pageHeight - 60, "AI Orders Report", 14));
  contentParts.push(
    textAt(
      startX,
      pageHeight - 80,
      `Generated: ${dateKeyInTimeZone(new Date())} (${TIME_ZONE})`,
      9,
    ),
  );
  contentParts.push(line(startX, tableTop, startX + tableWidth, tableTop));
  for (let i = 1; i <= totalRows; i += 1) {
    const y = tableTop - rowHeight * i;
    contentParts.push(line(startX, y, startX + tableWidth, y));
  }
  colX.forEach((x) => {
    contentParts.push(line(x, tableTop, x, tableBottom));
  });
  const headerY = tableTop - rowHeight + 5;
  columns.forEach((col, index) => {
    const x = colX[index] + 4;
    contentParts.push(textAt(x, headerY, col.title, 9));
  });
  visibleRows.forEach((row, rowIndex) => {
    const y = tableTop - rowHeight * (rowIndex + 2) + 5;
    const cells = [
      String(rowIndex + 1),
      row.name,
      row.type,
      String(row.count),
      formatRupiah(row.revenue),
    ];
    cells.forEach((cell, colIndex) => {
      const col = columns[colIndex];
      const width = col.width - 8;
      const text = truncateToFit(cell, width);
      let x = colX[colIndex] + 4;
      if (col.align === "right") {
        x = colX[colIndex] + col.width - 4 - Math.max(0, text.length * 4.8);
      }
      contentParts.push(textAt(x, y, text, 9));
    });
  });
  const totalRevenue = rows.reduce((sum, row) => sum + row.revenue, 0);
  const totalSales = rows.reduce((sum, row) => sum + row.count, 0);
  const footerY = tableBottom - 26;
  contentParts.push(
    textAt(startX, footerY, `Total Penjualan: ${totalSales} | Total Pendapatan: ${formatRupiah(totalRevenue)}`, 11),
  );
  if (hiddenCount > 0) {
    contentParts.push(
      textAt(startX, footerY - 16, `Catatan: ${hiddenCount} baris tidak ditampilkan.`, 9),
    );
  }
  const pdfBuffer = buildSimplePdf(contentParts.join("\n"));
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ai-orders-report.pdf"',
      "Content-Length": String(pdfBuffer.length),
    },
  });
}
