import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    // Kiểm tra kết nối database bằng truy vấn đơn giản
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "ok",
        database: "connected",
        message: "Hệ thống và cơ sở dữ liệu Supabase hoạt động bình thường",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health check database connection failed:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        message: "Không thể kết nối đến cơ sở dữ liệu Supabase. Vui lòng kiểm tra DATABASE_URL trong .env.",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
