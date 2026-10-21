import { NextRequest, NextResponse } from "next/server";
import { processProductCsv } from "@/lib/csv-import";


export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let csvContent = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { message: "Không tìm thấy file tải lên. Hãy chọn một file .csv." },
          { status: 400 }
        );
      }

      // Giới hạn kích thước file 5MB
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "Kích thước file vượt quá 5MB. Vui lòng giảm dung lượng file." },
          { status: 400 }
        );
      }

      csvContent = await file.text();
    } else {
      // Body dạng text thô hoặc JSON { content: "..." }
      const body = await request.text();
      try {
        const json = JSON.parse(body);
        csvContent = json.content || body;
      } catch {
        csvContent = body;
      }
    }

    if (!csvContent || csvContent.trim().length === 0) {
      return NextResponse.json(
        { message: "Nội dung file CSV trống." },
        { status: 400 }
      );
    }

    const result = await processProductCsv(csvContent);

    return NextResponse.json(
      {
        message: `Đã nhập thành công ${result.successCount}/${result.totalRows} sản phẩm.`,
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/products/import error:", error);
    return NextResponse.json(
      {
        message: "Lỗi trong quá trình xử lý file CSV.",
        error: error instanceof Error ? error.message : "Import error",
      },
      { status: 500 }
    );
  }
}
