import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getProductImages, ProductItem } from "@/types/product";
import { ProductDetailClient } from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  let raw = await prisma.product.findUnique({
    where: { id },
  });

  if (!raw) {
    raw = await prisma.product.findUnique({
      where: { sku: id },
    });
  }

  if (!raw) {
    notFound();
  }

  const images = getProductImages(raw);
  const product: ProductItem = {
    ...raw,
    price: raw.price.toString(),
    costPrice: raw.costPrice ? raw.costPrice.toString() : null,
    images,
    imageUrl: images[0] || raw.imageUrl || null,
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
    status: raw.status as "ACTIVE" | "INACTIVE",
  };

  const rawRelated = await prisma.product.findMany({
    where: {
      category: raw.category,
      id: { not: raw.id },
      status: "ACTIVE",
    },
    take: 4,
  });

  const relatedProducts: ProductItem[] = rawRelated.map((rel) => {
    const relImages = getProductImages(rel);
    return {
      ...rel,
      price: rel.price.toString(),
      costPrice: rel.costPrice ? rel.costPrice.toString() : null,
      images: relImages,
      imageUrl: relImages[0] || rel.imageUrl || null,
      createdAt: rel.createdAt.toISOString(),
      updatedAt: rel.updatedAt.toISOString(),
      status: rel.status as "ACTIVE" | "INACTIVE",
    };
  });

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
