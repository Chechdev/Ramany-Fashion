import Papa from "papaparse";
import { ProductItem } from "@/types/product";

/**
 * Ngăn chặn CSV formula injection nếu ô bắt đầu bằng ký tự nguy hiểm: =, +, -, @, tab, cr
 */
function sanitizeCsvValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

export function generateProductsCsv(products: ProductItem[]): string {
  const data = products.map((p) => ({
    sku: sanitizeCsvValue(p.sku),
    name: sanitizeCsvValue(p.name),
    description: sanitizeCsvValue(p.description),
    category: sanitizeCsvValue(p.category),
    gender: sanitizeCsvValue(p.gender),
    price: sanitizeCsvValue(p.price),
    costPrice: sanitizeCsvValue(p.costPrice),
    stockQuantity: sanitizeCsvValue(p.stockQuantity),
    size: sanitizeCsvValue(p.size),
    color: sanitizeCsvValue(p.color),
    imageUrl: sanitizeCsvValue(p.imageUrl),
    status: sanitizeCsvValue(p.status),
  }));

  const csv = Papa.unparse(data, {
    quotes: true, // bọc quotes để an toàn với dấu phẩy và xuống dòng
    header: true,
  });

  // UTF-8 BOM (\uFEFF) giúp Microsoft Excel hiển thị đúng tiếng Việt có dấu
  return "\uFEFF" + csv;
}

export function getSampleCsvTemplate(): string {
  const sampleData = [
    {
      sku: "TS-DEMO-01",
      name: "Áo Thun Cotton Trơn Trắng",
      description: "Chất liệu cotton mềm mịn thấm hút mồ hôi",
      category: "Áo thun",
      gender: "Unisex",
      price: "199000",
      costPrice: "90000",
      stockQuantity: "50",
      size: "M",
      color: "Trắng",
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
      status: "ACTIVE",
    },
    {
      sku: "SH-DEMO-02",
      name: "Áo Sơ Mi Tay Dài Kẻ Sọc",
      description: "Thiết kế trẻ trung thanh lịch",
      category: "Áo sơ mi",
      gender: "Men",
      price: "350000",
      costPrice: "180000",
      stockQuantity: "25",
      size: "L",
      color: "Xanh dương",
      imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
      status: "ACTIVE",
    },
  ];

  const csv = Papa.unparse(sampleData, {
    quotes: true,
    header: true,
  });

  return "\uFEFF" + csv;
}
