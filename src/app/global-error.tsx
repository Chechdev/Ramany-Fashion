"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex items-center justify-center bg-neutral-900 text-white font-sans p-6">
        <div className="max-w-md w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold">Đã có lỗi hệ thống xảy ra</h2>
          <p className="text-neutral-400 text-xs leading-relaxed">
            {error?.message || "Hệ thống đang gặp sự cố tạm thời. Vui lòng tải lại trang hoặc thử lại sau."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-2.5 px-4 bg-white text-neutral-950 font-bold rounded-xl text-xs hover:bg-neutral-100 transition cursor-pointer"
          >
            Tải lại trang
          </button>
        </div>
      </body>
    </html>
  );
}
