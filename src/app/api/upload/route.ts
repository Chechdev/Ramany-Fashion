import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    // Lấy tất cả files từ field "files" hoặc "file"
    const files = [
      ...formData.getAll("files"),
      ...formData.getAll("file"),
    ] as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy file tải lên" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const savedUrls: string[] = [];

    for (const file of files) {
      if (typeof file === "string" || !file.name) continue;

      // Kiểm tra định dạng ảnh
      const ext = path.extname(file.name).toLowerCase() || ".jpg";
      const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];
      const safeExt = allowedExts.includes(ext) ? ext : ".jpg";

      // Tạo tên file duy nhất chống trùng lặp
      const uniqueName = `ramany_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${safeExt}`;
      const filePath = path.join(uploadDir, uniqueName);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await writeFile(filePath, buffer);

      savedUrls.push(`/uploads/${uniqueName}`);
    }

    if (savedUrls.length === 0) {
      return NextResponse.json(
        { success: false, message: "Không có file ảnh hợp lệ được lưu" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã tải lên thành công ${savedUrls.length} ảnh`,
      urls: savedUrls,
    });
  } catch (error) {
    console.error("Lỗi upload file:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi hệ thống khi tải ảnh lên",
        error: error instanceof Error ? error.message : "Upload error",
      },
      { status: 500 }
    );
  }
}
