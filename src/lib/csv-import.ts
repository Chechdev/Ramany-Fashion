import Papa from "papaparse";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CsvRowSchema } from "@/lib/validations";
import { ImportResult, ImportErrorDetail } from "@/types/product";

const REQUIRED_HEADERS = ["sku", "name", "category", "price"];
const MAX_CSV_ROWS = 500; // Giới hạn an toàn cho MVP

export async function processProductCsv(csvContent: string): Promise<ImportResult> {
  // Loại bỏ BOM nếu có
  const cleanContent = csvContent.replace(/^\uFEFF/, "").trim();

  const parseResult = Papa.parse<Record<string, string>>(cleanContent, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim(),
  });

  const errors: ImportErrorDetail[] = [];
  const rows = parseResult.data;

  if (!rows || rows.length === 0) {
    return {
      totalRows: 0,
      validRows: 0,
      successCount: 0,
      errorCount: 1,
      errors: [{ row: 0, message: "File CSV trống hoặc không chứa dữ liệu hợp lệ" }],
    };
  }

  if (rows.length > MAX_CSV_ROWS) {
    return {
      totalRows: rows.length,
      validRows: 0,
      successCount: 0,
      errorCount: 1,
      errors: [
        {
          row: 0,
          message: `Số dòng (${rows.length}) vượt quá giới hạn cho phép (${MAX_CSV_ROWS} dòng). Vui lòng chia nhỏ file.`,
        },
      ],
    };
  }

  // Kiểm tra headers
  const actualHeaders = parseResult.meta.fields || [];
  const missingHeaders = REQUIRED_HEADERS.filter(
    (req) => !actualHeaders.some((h) => h.toLowerCase() === req.toLowerCase())
  );

  if (missingHeaders.length > 0) {
    return {
      totalRows: rows.length,
      validRows: 0,
      successCount: 0,
      errorCount: 1,
      errors: [
        {
          row: 1,
          message: `Thiếu các cột bắt buộc trong file CSV: ${missingHeaders.join(", ")}`,
        },
      ],
    };
  }

  // Theo dõi SKU đã gặp trong file
  const seenSkusInFile = new Map<string, number>();
  const validItemsToInsert: Array<{
    rowNumber: number;
    data: Prisma.ProductCreateInput;
  }> = [];

  // Lấy danh sách tất cả SKU trong file để kiểm tra trùng database 1 lần
  const allSkus = rows
    .map((r) => r.sku?.trim())
    .filter(Boolean);

  const existingProducts = await prisma.product.findMany({
    where: {
      sku: {
        in: allSkus,
        mode: "insensitive",
      },
    },
    select: { sku: true },
  });

  const existingSkuSet = new Set(existingProducts.map((p) => p.sku.toUpperCase()));

  for (let i = 0; i < rows.length; i++) {
    const rawRow = rows[i];
    const rowNumber = i + 2; // Dòng 1 là header

    // Bỏ qua dòng hoàn toàn rỗng
    const hasValues = Object.values(rawRow).some((v) => v && v.trim().length > 0);
    if (!hasValues) continue;

    const validated = CsvRowSchema.safeParse(rawRow);
    if (!validated.success) {
      const issue = validated.error.issues[0];
      errors.push({
        row: rowNumber,
        sku: rawRow.sku || "N/A",
        field: issue.path.join("."),
        message: issue.message,
      });
      continue;
    }

    const item = validated.data;
    const normalizedSku = item.sku.toUpperCase();

    // Kiểm tra trùng trong file
    if (seenSkusInFile.has(normalizedSku)) {
      errors.push({
        row: rowNumber,
        sku: item.sku,
        field: "sku",
        message: `Mã SKU "${item.sku}" bị trùng lặp với dòng ${seenSkusInFile.get(normalizedSku)} trong cùng file`,
      });
      continue;
    }
    seenSkusInFile.set(normalizedSku, rowNumber);

    // Kiểm tra trùng trong database
    if (existingSkuSet.has(normalizedSku)) {
      errors.push({
        row: rowNumber,
        sku: item.sku,
        field: "sku",
        message: `Mã SKU "${item.sku}" đã tồn tại trong cơ sở dữ liệu (chế độ Thêm mới không ghi đè)`,
      });
      continue;
    }

    validItemsToInsert.push({
      rowNumber,
      data: {
        sku: item.sku,
        name: item.name,
        description: item.description || null,
        category: item.category,
        gender: item.gender || "Unisex",
        price: new Prisma.Decimal(item.price),
        costPrice: item.costPrice !== null && item.costPrice !== undefined ? new Prisma.Decimal(item.costPrice) : null,
        stockQuantity: item.stockQuantity,
        size: item.size || "Free Size",
        color: item.color || "Default",
        imageUrl: item.imageUrl || null,
        status: item.status,
      },
    });
  }

  // Thực hiện ghi dữ liệu hợp lệ vào database
  let successCount = 0;
  for (const item of validItemsToInsert) {
    try {
      await prisma.product.create({
        data: item.data,
      });
      successCount++;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Lỗi khi lưu sản phẩm";
      errors.push({
        row: item.rowNumber,
        sku: item.data.sku,
        message: `Lưu thất bại: ${errorMsg}`,
      });
    }
  }

  return {
    totalRows: rows.length,
    validRows: validItemsToInsert.length,
    successCount,
    errorCount: errors.length,
    errors,
  };
}
