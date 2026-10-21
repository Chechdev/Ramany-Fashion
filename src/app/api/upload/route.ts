import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary nếu đã có các biến môi trường
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// Hàm upload buffer lên Cloudinary
function uploadToCloudinary(buffer: Buffer, folder = "ramany-fashion"): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error || new Error("Upload Cloudinary thất bại"));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(buffer);
  });
}

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

    const savedUrls: string[] = [];

    for (const file of files) {
      if (typeof file === "string" || !file.name) continue;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Nếu đã cấu hình Cloudinary: Tải trực tiếp lên Cloudinary (ưu tiên hàng đầu)
      if (isCloudinaryConfigured) {
        try {
          const cloudUrl = await uploadToCloudinary(buffer);
          savedUrls.push(cloudUrl);
          continue;
        } catch (cloudErr) {
          console.error("Lỗi khi tải lên Cloudinary, chuyển sang lưu local:", cloudErr);
        }
      }

      // Fallback: Lưu vào thư mục public/uploads
      const ext = path.extname(file.name).toLowerCase() || ".jpg";
      const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];
      const safeExt = allowedExts.includes(ext) ? ext : ".jpg";

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const uniqueName = `ramany_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${safeExt}`;
      const filePath = path.join(uploadDir, uniqueName);

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
      message: `Đã tải lên thành công ${savedUrls.length} ảnh ${isCloudinaryConfigured ? "(Cloudinary)" : "(Local)"}`,
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
