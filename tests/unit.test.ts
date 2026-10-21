import { ProductSchema, CsvRowSchema } from "../src/lib/validations";
import { generateProductsCsv, getSampleCsvTemplate } from "../src/lib/csv-export";
import { ProductItem } from "../src/types/product";

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log("🧪 BẮT ĐẦU KIỂM THỬ ĐƠN VỊ (UNIT TESTS) CHO CHECH FASHION MVP\n");

// 1. Kiểm tra validation sản phẩm hợp lệ
console.log("1. Kiểm tra ProductSchema:");
const validProduct = {
  sku: "TS-TEST-001",
  name: "Áo Thun Cotton",
  category: "Áo thun",
  gender: "Unisex",
  price: 150000,
  costPrice: 80000,
  stockQuantity: 10,
  size: "M",
  color: "Đen",
  status: "ACTIVE",
};

const validRes = ProductSchema.safeParse(validProduct);
assert(validRes.success === true, "Sản phẩm hợp lệ vượt qua validate");

// 2. Kiểm tra giá âm
const negativePriceProduct = { ...validProduct, price: -5000 };
const negPriceRes = ProductSchema.safeParse(negativePriceProduct);
assert(negPriceRes.success === false, "Giá âm bị từ chối chính xác");

// 3. Kiểm tra tồn kho âm
const negativeStockProduct = { ...validProduct, stockQuantity: -1 };
const negStockRes = ProductSchema.safeParse(negativeStockProduct);
assert(negStockRes.success === false, "Tồn kho âm bị từ chối chính xác");

// 4. Kiểm tra SKU chứa ký tự đặc biệt không hợp lệ
const invalidSkuProduct = { ...validProduct, sku: "TS 001 @#$" };
const invalidSkuRes = ProductSchema.safeParse(invalidSkuProduct);
assert(invalidSkuRes.success === false, "SKU chứa khoảng trắng/ký tự đặc biệt bị từ chối");

// 5. Kiểm tra CsvRowSchema
console.log("\n2. Kiểm tra CsvRowSchema:");
const validCsvRow = {
  sku: "SH001",
  name: "Áo Sơ Mi Nam",
  category: "Sơ mi",
  price: "250000",
  stockQuantity: "30",
  status: "active",
};
const csvRowRes = CsvRowSchema.safeParse(validCsvRow);
assert(csvRowRes.success === true, "Dòng CSV hợp lệ parse thành công và chuẩn hóa");
if (csvRowRes.success) {
  assert(csvRowRes.data.status === "ACTIVE", "Trạng thái tự động viết hoa (ACTIVE)");
}

// 6. Kiểm tra CSV Export và bảo vệ Formula Injection
console.log("\n3. Kiểm tra CSV Export & Bảo mật Formula Injection:");
const testProducts: ProductItem[] = [
  {
    id: "uuid-1",
    sku: "=cmd|' /C calc'!A0", // Thử nghiệm injection
    name: "Áo Polo Đỏ",
    description: "Mô tả có dấu phẩy, và tiếng Việt",
    category: "Áo polo",
    gender: "Men",
    price: "299000",
    costPrice: "150000",
    stockQuantity: 12,
    size: "L",
    color: "Đỏ",
    imageUrl: null,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const csvOutput = generateProductsCsv(testProducts);
assert(csvOutput.startsWith("\uFEFF"), "File CSV có tiền tố UTF-8 BOM để tương thích Excel");
assert(csvOutput.includes("'=cmd|"), "Ký tự '=' nguy hiểm được sanitize chống CSV Injection");

// 7. Kiểm tra Sample Template
const templateOutput = getSampleCsvTemplate();
assert(templateOutput.startsWith("\uFEFF"), "Template CSV có tiền tố UTF-8 BOM");
assert(templateOutput.includes("TS-DEMO-01"), "Template CSV chứa dữ liệu mẫu chuẩn");

console.log(`\n========================================`);
console.log(`KẾT QUẢ: ${passed} passed, ${failed} failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
