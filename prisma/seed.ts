import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const sampleProducts = [
  {
    sku: "TS001-M-BLK",
    name: "Áo Thun Cotton Cổ Tròn Basic - Đen M",
    description: "Áo thun cotton 100% 4 chiều thoáng mát, co giãn nhẹ, phù hợp mặc hàng ngày.",
    category: "Áo thun",
    gender: "Unisex",
    price: new Prisma.Decimal("189000.00"),
    costPrice: new Prisma.Decimal("95000.00"),
    stockQuantity: 45,
    size: "M",
    color: "Đen",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60",
    status: "ACTIVE",
  },
  {
    sku: "TS001-L-BLK",
    name: "Áo Thun Cotton Cổ Tròn Basic - Đen L",
    description: "Áo thun cotton 100% 4 chiều thoáng mát, co giãn nhẹ, phù hợp mặc hàng ngày.",
    category: "Áo thun",
    gender: "Unisex",
    price: new Prisma.Decimal("189000.00"),
    costPrice: new Prisma.Decimal("95000.00"),
    stockQuantity: 30,
    size: "L",
    color: "Đen",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60",
    status: "ACTIVE",
  },
  {
    sku: "TS002-L-WHT",
    name: "Áo Thun Oversize Streetwear - Trắng L",
    description: "Form áo rộng rãi cá tính, phong cách đường phố năng động trẻ trung.",
    category: "Áo thun",
    gender: "Unisex",
    price: new Prisma.Decimal("220000.00"),
    costPrice: new Prisma.Decimal("110000.00"),
    stockQuantity: 15,
    size: "L",
    color: "Trắng",
    imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=60",
    status: "ACTIVE",
  },
  {
    sku: "SH001-M-BLU",
    name: "Áo Sơ Mi Oxford Dài Tay - Xanh Nhạt M",
    description: "Chất vải Oxford dệt thoi bền đẹp, đứng form chuẩn công sở và sự kiện lịch sự.",
    category: "Áo sơ mi",
    gender: "Men",
    price: new Prisma.Decimal("380000.00"),
    costPrice: new Prisma.Decimal("210000.00"),
    stockQuantity: 25,
    size: "M",
    color: "Xanh nhạt",
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=60",
    status: "ACTIVE",
  },
  {
    sku: "SH002-L-WHT",
    name: "Áo Sơ Mi Linen Cổ Tàu - Trắng L",
    description: "Chất liệu đũi linen tự nhiên thấm hút mồ hôi cực tốt, thoáng mát cho mùa hè.",
    category: "Áo sơ mi",
    gender: "Men",
    price: new Prisma.Decimal("420000.00"),
    costPrice: new Prisma.Decimal("230000.00"),
    stockQuantity: 0,
    size: "L",
    color: "Trắng",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60",
    status: "ACTIVE", // Out of stock demo
  },
  {
    sku: "JN001-30-BLU",
    name: "Quần Jeans Slim-fit Co Giãn - Xanh Indigo 30",
    description: "Quần bò nam wash nhẹ, dáng ôm vừa vặn tôn dáng thoải mái vận động.",
    category: "Quần jeans",
    gender: "Men",
    price: new Prisma.Decimal("499000.00"),
    costPrice: new Prisma.Decimal("270000.00"),
    stockQuantity: 40,
    size: "30",
    color: "Xanh Indigo",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60",
    status: "ACTIVE",
  },
  {
    sku: "DR001-S-FLR",
    name: "Đầm Xòe Hoa Nhí Vintage - Họa Tiết Hoa S",
    description: "Váy voan lụa 2 lớp mềm mại, thắt eo duyên dáng thích hợp dạo phố, tiệc trà.",
    category: "Đầm & Váy",
    gender: "Women",
    price: new Prisma.Decimal("450000.00"),
    costPrice: new Prisma.Decimal("220000.00"),
    stockQuantity: 18,
    size: "S",
    color: "Họa tiết hoa",
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60",
    status: "ACTIVE",
  },
  {
    sku: "JK001-L-BRN",
    name: "Áo Khoác Da Biker Jacket - Nâu Da Bò L",
    description: "Chất da PU cao cấp chống xước, lót dù ấm áp, phong cách biker cá tính.",
    category: "Áo khoác",
    gender: "Unisex",
    price: new Prisma.Decimal("750000.00"),
    costPrice: new Prisma.Decimal("420000.00"),
    stockQuantity: 8,
    size: "L",
    color: "Nâu da bò",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60",
    status: "ACTIVE",
  },
];

async function main() {
  console.log("🌱 Bắt đầu chạy seed dữ liệu mẫu cho CHECH FASHION...");
  let createdCount = 0;
  let updatedCount = 0;

  for (const product of sampleProducts) {
    const existing = await prisma.product.findUnique({
      where: { sku: product.sku },
    });

    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        name: product.name,
        description: product.description,
        category: product.category,
        gender: product.gender,
        price: product.price,
        costPrice: product.costPrice,
        stockQuantity: product.stockQuantity,
        size: product.size,
        color: product.color,
        imageUrl: product.imageUrl,
        status: product.status,
      },
      create: product,
    });

    if (existing) {
      updatedCount++;
    } else {
      createdCount++;
    }
  }

  console.log(`✅ Hoàn tất seed: Tạo mới ${createdCount} sản phẩm, Cập nhật ${updatedCount} sản phẩm.`);
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi chạy seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
