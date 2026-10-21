import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductUpdateSchema } from "@/lib/validations";
import { getProductImages } from "@/types/product";


interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    const images = getProductImages(product as { imageUrl?: string | null; images?: string[] | null });

    return NextResponse.json({
      product: {
        ...product,
        images,
        imageUrl: images[0] || product.imageUrl || null,
        price: product.price.toString(),
        costPrice: product.costPrice ? product.costPrice.toString() : null,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { message: "Lỗi truy vấn sản phẩm", error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const validated = ProductUpdateSchema.safeParse(body);
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

    // Kiểm tra sản phẩm có tồn tại không
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Sản phẩm không tồn tại để cập nhật" },
        { status: 404 }
      );
    }

    // Nếu thay đổi SKU, kiểm tra xem SKU mới có bị trùng với sản phẩm khác không
    if (data.sku && data.sku.toUpperCase() !== existing.sku.toUpperCase()) {
      const conflict = await prisma.product.findFirst({
        where: {
          sku: {
            equals: data.sku,
            mode: "insensitive",
          },
          NOT: { id },
        },
      });

      if (conflict) {
        return NextResponse.json(
          {
            message: `Mã SKU "${data.sku}" đã được sử dụng bởi sản phẩm khác`,
            field: "sku",
          },
          { status: 409 }
        );
      }
    }

    const updateData: Prisma.ProductUpdateInput = {};

    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.price !== undefined) updateData.price = new Prisma.Decimal(data.price);
    if (data.costPrice !== undefined) {
      updateData.costPrice = data.costPrice !== null ? new Prisma.Decimal(data.costPrice) : null;
    }
    if (data.stockQuantity !== undefined) updateData.stockQuantity = data.stockQuantity;
    if (data.size !== undefined) updateData.size = data.size;
    if (data.color !== undefined) updateData.color = data.color;
    
    // Xử lý cập nhật danh sách ảnh
    if (data.images !== undefined) {
      const validImages = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
      updateData.imageUrl = validImages.length > 1 ? JSON.stringify(validImages) : (validImages[0] || null);
    } else if (data.imageUrl !== undefined) {
      updateData.imageUrl = data.imageUrl || null;
    }

    if (data.status !== undefined) updateData.status = data.status;

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    const parsedImages = getProductImages(updated as { imageUrl?: string | null; images?: string[] | null });

    return NextResponse.json({
      message: "Cập nhật sản phẩm thành công",
      product: {
        ...updated,
        images: parsedImages,
        imageUrl: parsedImages[0] || updated.imageUrl || null,
        price: updated.price.toString(),
        costPrice: updated.costPrice ? updated.costPrice.toString() : null,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("PATCH /api/products/[id] error:", error);
    return NextResponse.json(
      { message: "Không thể cập nhật sản phẩm", error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Sản phẩm không tồn tại hoặc đã bị xóa" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: `Đã xóa sản phẩm "${existing.name}" (SKU: ${existing.sku}) thành công`,
      deletedId: id,
    });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { message: "Không thể xóa sản phẩm", error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
}
