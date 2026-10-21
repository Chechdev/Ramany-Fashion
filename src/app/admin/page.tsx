import { prisma } from "@/lib/prisma";
import { getProductImages, ProductItem } from "@/types/product";
import { AdminClient } from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let initialProducts: ProductItem[] = [];
  let initialStats = {
    totalProducts: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
    totalStockQuantity: 0,
  };
  let initialCategories: string[] = [];
  let initialPagination = {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  };
  let initialDbStatus: "checking" | "connected" | "disconnected" = "connected";

  try {
    const [rawProducts, totalItems, totalProducts, activeProducts, outOfStockProducts, stockSum, categoriesRaw] =
      await Promise.all([
        prisma.product.findMany({
          skip: 0,
          take: 10,
          orderBy: { createdAt: "desc" },
        }),
        prisma.product.count(),
        prisma.product.count(),
        prisma.product.count({ where: { status: "ACTIVE" } }),
        prisma.product.count({ where: { stockQuantity: 0 } }),
        prisma.product.aggregate({ _sum: { stockQuantity: true } }),
        prisma.product.findMany({
          distinct: ["category"],
          select: { category: true },
          orderBy: { category: "asc" },
        }),
      ]);

    initialProducts = rawProducts.map((p) => {
      const images = getProductImages(p);
      return {
        ...p,
        price: p.price.toString(),
        costPrice: p.costPrice ? p.costPrice.toString() : null,
        images,
        imageUrl: images[0] || p.imageUrl || null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        status: p.status as "ACTIVE" | "INACTIVE",
      };
    });

    initialCategories = categoriesRaw.map((c) => c.category).filter(Boolean);
    initialPagination = {
      page: 1,
      pageSize: 10,
      totalItems,
      totalPages: Math.ceil(totalItems / 10) || 1,
    };
    initialStats = {
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalStockQuantity: stockSum._sum.stockQuantity || 0,
    };
  } catch (err) {
    console.error("Lỗi nạp admin ban đầu trên server:", err);
    initialDbStatus = "disconnected";
  }

  return (
    <AdminClient
      initialProducts={initialProducts}
      initialStats={initialStats}
      initialCategories={initialCategories}
      initialPagination={initialPagination}
      initialDbStatus={initialDbStatus}
    />
  );
}
