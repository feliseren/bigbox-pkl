import { prisma } from "@/lib/prisma";

export type WhatsNewFilters = {
  query?: string;
  category?: string;
};

export const SYSTEM_UPDATE_CATEGORY = "Pembaruan Sistem";
export const LEGACY_SYSTEM_UPDATE_CATEGORY = "Update Sistem";

export function normalizeWhatsNewCategory(category?: string | null) {
  const value = category?.trim();
  if (!value) return "";
  return value === LEGACY_SYSTEM_UPDATE_CATEGORY
    ? SYSTEM_UPDATE_CATEGORY
    : value;
}

function buildCategoryFilter(category?: string) {
  const normalizedCategory = normalizeWhatsNewCategory(category);
  if (!normalizedCategory) return [];
  if (normalizedCategory === SYSTEM_UPDATE_CATEGORY) {
    return [
      {
        OR: [
          { category: SYSTEM_UPDATE_CATEGORY },
          { category: LEGACY_SYSTEM_UPDATE_CATEGORY },
        ],
      },
    ];
  }
  return [{ category: normalizedCategory }];
}

export async function fetchWhatsNew(filters: WhatsNewFilters = {}) {
  const query = filters.query?.trim();
  const category = normalizeWhatsNewCategory(filters.category);
  const where =
    query || category
      ? {
          AND: [
            ...(query
              ? [
                  {
                    OR: [
                      { title: { contains: query } },
                      { summary: { contains: query } },
                      { contentText: { contains: query } },
                    ],
                  },
                ]
              : []),
            ...buildCategoryFilter(category),
          ],
        }
      : undefined;

  return prisma.whatsNew.findMany({
    where,
    include: { employee: { select: { fullName: true } } },
    orderBy: [{ publishDate: "desc" }, { createdAt: "desc" }],
  }).then((items) =>
    items.map((item) => ({
      ...item,
      category: normalizeWhatsNewCategory(item.category),
    })),
  );
}

export async function fetchWhatsNewHighlight() {
  return prisma.whatsNew.findFirst({
    where: { isHighlight: true },
    include: { employee: { select: { fullName: true } } },
    orderBy: [{ publishDate: "desc" }, { createdAt: "desc" }],
  }).then((item) =>
    item
      ? {
          ...item,
          category: normalizeWhatsNewCategory(item.category),
        }
      : null,
  );
}

export async function createWhatsNew(data: {
  title: string;
  category: string;
  summary: string;
  contentText: string | null;
  imageUrl: string | null;
  isHighlight: boolean;
  publishDate: Date;
  employeeId: string;
}) {
  return prisma.whatsNew.create({
    data: {
      ...data,
      category: normalizeWhatsNewCategory(data.category),
    },
  });
}

export async function updateWhatsNew(data: {
  id: string;
  title: string;
  category: string;
  summary: string;
  contentText: string | null;
  imageUrl?: string | null;
  isHighlight: boolean;
  publishDate: Date;
}) {
  const { id, ...rest } = data;
  return prisma.whatsNew.update({
    where: { id },
    data: {
      ...rest,
      category: normalizeWhatsNewCategory(rest.category),
    },
  });
}

export async function deleteWhatsNew(id: string, deletedBy?: string | null) {
  const existing = await prisma.whatsNew.findUnique({ where: { id } });
  if (!existing) return null;
  return prisma.$transaction([
    prisma.archivedWhatsNew.create({
      data: {
        originalId: existing.id,
        title: existing.title,
        category: existing.category,
        summary: existing.summary,
        contentText: existing.contentText,
        imageUrl: existing.imageUrl,
        isHighlight: existing.isHighlight,
        publishDate: existing.publishDate,
        employeeId: existing.employeeId,
        createdAt: existing.createdAt,
        updatedAt: existing.updatedAt,
        deletedAt: new Date(),
        deletedBy: deletedBy ?? null,
      },
    }),
    prisma.whatsNew.delete({ where: { id } }),
  ]);
}
