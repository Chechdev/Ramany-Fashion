import { prisma } from "@/lib/prisma";
import { getProductImages, ProductItem } from "@/types/product";
import { StorefrontClient } from "@/components/StorefrontClient";

export default async function StorefrontPage() {
  let initialProducts: ProductItem[] = [];

  try {
    const raw = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    initialProducts = raw.map((p) => {
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
  } catch (err) {
    console.error("Lỗi nạp sản phẩm ban đầu trên Server:", err);
  }

  return <StorefrontClient initialProducts={initialProducts} />;
}
