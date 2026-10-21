import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates: Record<string, string[]> = {
  // Áo Sơ Mi Oxford Dài Tay (sản phẩm trong hình chụp của người dùng)
  "SH001-M-BLU": [
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&auto=format&fit=crop&q=80",
  ],
  // Áo Thun Cotton Basic Đen M
  "TS001-M-BLK": [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
  ],
  // Áo Thun Cotton Basic Đen L
  "TS001-L-BLK": [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
  ],
  // Áo Thun Oversize Trắng
  "TS002-L-WHT": [
    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
  ],
  // Áo Sơ Mi Linen Cổ Tàu
  "SH002-L-WHT": [
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&auto=format&fit=crop&q=80",
  ],
  // Quần Jeans Slim-fit
  "JN001-30-BLU": [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&auto=format&fit=crop&q=80",
  ],
  // Đầm Xòe Hoa Nhí Vintage
  "DR001-S-FLR": [
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80",
  ],
  // Áo Khoác Da Biker Jacket
  "JK001-L-BRN": [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80",
  ],
};

async function updateSampleGalleries() {
  console.log("Cập nhật danh sách ảnh minh họa cho các sản phẩm...");
  for (const [sku, images] of Object.entries(updates)) {
    try {
      const serialized = JSON.stringify(images);
      await prisma.$executeRawUnsafe(
        `UPDATE "products" SET "imageUrl" = $1 WHERE "sku" ILIKE $2`,
        serialized,
        `%${sku}%`
      );
      console.log(`Đã cập nhật ${images.length} ảnh cho SKU: ${sku}`);
    } catch (err) {
      console.error(`Lỗi cập nhật SKU ${sku}:`, err);
    }
  }
  console.log("Hoàn tất cập nhật ảnh minh họa mẫu!");
  await prisma.$disconnect();
}

updateSampleGalleries();
