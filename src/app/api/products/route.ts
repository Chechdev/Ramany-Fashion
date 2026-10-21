import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/lib/validations";
import { getProductImages } from "@/types/product";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)));
    const skip = (page - 1) * pageSize;

    // Xây dựng điều kiện lọc
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && category !== "ALL") {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    // Truy vấn dữ liệu song song để tối ưu hiệu năng
    const [products, totalItems, totalProducts, activeProducts, outOfStockProducts, stockSum, categoriesRaw] =
      await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
        }),
        prisma.product.count({ where }),
        prisma.product.count(),
        prisma.product.count({ where: { status: "ACTIVE" } }),
        prisma.product.count({ where: { stockQuantity: 0 } }),
        prisma.product.aggregate({
          _sum: { stockQuantity: true },
        }),
        prisma.product.findMany({
          select: { category: true },
          distinct: ["category"],
          orderBy: { category: "asc" },
        }),
      ]);

    const categories = categoriesRaw.map((c) => c.category).filter(Boolean);
    const totalPages = Math.ceil(totalItems / pageSize) || 1;

    const formattedProducts = products.map((p) => {
      const pImages = getProductImages(p as { imageUrl?: string | null; images?: string[] | null });

      return {
        ...p,
        images: pImages,
        imageUrl: pImages[0] || p.imageUrl || null,
        price: p.price.toString(),
        costPrice: p.costPrice ? p.costPrice.toString() : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      items: formattedProducts,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
      stats: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        totalStockQuantity: stockSum._sum.stockQuantity || 0,
      },
      categories,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      {
        message: "Không thể tải danh sách sản phẩm từ database. Hãy kiểm tra kết nối Supabase.",
        error: error instanceof Error ? error.message : "Database error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ProductSchema.safeParse(body);

    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      return NextResponse.json(
        {
          message: firstIssue.message,
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Kiểm tra SKU duy nhất (không phân biệt hoa thường)
    const existingSku = await prisma.product.findFirst({
      where: {
        sku: {
          equals: data.sku,
          mode: "insensitive",
        },
      },
    });

    if (existingSku) {
      return NextResponse.json(
        {
          message: `Mã SKU "${data.sku}" đã được sử dụng bởi sản phẩm khác`,
          field: "sku",
        },
        { status: 409 }
      );
    }

    const validImages = Array.isArray(data.images) ? data.images.filter(Boolean) : (data.imageUrl ? [data.imageUrl] : []);
    const serializedImages = validImages.length > 1 ? JSON.stringify(validImages) : (validImages[0] || data.imageUrl || null);

    const created = await prisma.product.create({
      data: {
        sku: data.sku,
        name: data.name,
        description: data.description || null,
        category: data.category,
        gender: data.gender,
        price: new Prisma.Decimal(data.price),
        costPrice: data.costPrice !== undefined && data.costPrice !== null ? new Prisma.Decimal(data.costPrice) : null,
        stockQuantity: data.stockQuantity,
        size: data.size,
        color: data.color,
        imageUrl: serializedImages,
        status: data.status,
      },
    });

    const parsedCreatedImages = getProductImages(created as { imageUrl?: string | null; images?: string[] | null });

    return NextResponse.json(
      {
        message: "Thêm sản phẩm thành công",
        product: {
          ...created,
          images: parsedCreatedImages,
          imageUrl: parsedCreatedImages[0] || created.imageUrl || null,
          price: created.price.toString(),
          costPrice: created.costPrice ? created.costPrice.toString() : null,
          createdAt: created.createdAt.toISOString(),
          updatedAt: created.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      {
        message: "Không thể tạo sản phẩm. Lỗi kết nối database.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
