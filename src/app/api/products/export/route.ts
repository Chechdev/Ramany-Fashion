import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateProductsCsv, getSampleCsvTemplate } from "@/lib/csv-export";
import { ProductItem } from "@/types/product";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // Nếu người dùng tải template mẫu
    if (type === "template") {
      const templateCsv = getSampleCsvTemplate();
      return new NextResponse(templateCsv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="ramany_template.csv"',
        },
      });
    }

    // Xuất sản phẩm (toàn bộ hoặc theo bộ lọc)
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";

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

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formattedProducts: ProductItem[] = products.map((p) => ({
      ...p,
      price: p.price.toString(),
      costPrice: p.costPrice ? p.costPrice.toString() : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      status: p.status as "ACTIVE" | "INACTIVE",
    }));

    const csvContent = generateProductsCsv(formattedProducts);
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `products_${dateStr}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("GET /api/products/export error:", error);
    return NextResponse.json(
      {
        message: "Lỗi khi xuất dữ liệu CSV từ database",
        error: error instanceof Error ? error.message : "Export error",
      },
      { status: 500 }
    );
  }
}
