import { z } from "zod";

export const ProductSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, "Mã SKU không được để trống")
    .max(50, "Mã SKU không được vượt quá 50 ký tự")
    .regex(/^[A-Za-z0-9-_]+$/, "Mã SKU chỉ được chứa chữ cái, số, dấu gạch nối (-) hoặc gạch dưới (_)"),
  name: z
    .string()
    .trim()
    .min(1, "Tên sản phẩm không được để trống")
    .max(255, "Tên sản phẩm không được vượt quá 255 ký tự"),
  description: z.string().trim().optional().nullable(),
  category: z
    .string()
    .trim()
    .min(1, "Danh mục không được để trống")
    .max(100, "Danh mục tối đa 100 ký tự"),
  gender: z
    .string()
    .trim()
    .min(1, "Đối tượng sử dụng không được để trống")
    .default("Unisex"),
  price: z.coerce
    .number()
    .min(0, "Giá bán không được âm"),
  costPrice: z.coerce
    .number()
    .min(0, "Giá vốn không được âm")
    .optional()
    .nullable(),
  stockQuantity: z.coerce
    .number()
    .int("Tồn kho phải là số nguyên")
    .min(0, "Tồn kho không được âm")
    .default(0),
  size: z.string().trim().min(1, "Kích cỡ không được để trống").default("Free Size"),
  color: z.string().trim().min(1, "Màu sắc không được để trống").default("Default"),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .or(z.literal("")),
  images: z.array(z.string().trim()).optional().default([]),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const ProductUpdateSchema = ProductSchema.partial();

export const CsvRowSchema = z.object({
  sku: z.string().trim().min(1, "Thiếu SKU"),
  name: z.string().trim().min(1, "Thiếu tên sản phẩm"),
  description: z.string().trim().optional().default(""),
  category: z.string().trim().min(1, "Thiếu danh mục"),
  gender: z.string().trim().optional().default("Unisex"),
  price: z.coerce.number().min(0, "Giá bán không hợp lệ"),
  costPrice: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? null : val),
    z.coerce.number().min(0, "Giá vốn không được âm").optional().nullable()
  ),
  stockQuantity: z.coerce.number().int("Tồn kho phải là số nguyên").min(0, "Tồn kho không được âm"),
  size: z.string().trim().optional().default("Free Size"),
  color: z.string().trim().optional().default("Default"),
  imageUrl: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? null : val),
    z.string().trim().url().optional().nullable()
  ),
  status: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE")
  ),
});
