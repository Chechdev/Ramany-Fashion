"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lỗi ứng dụng:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white p-6 text-center font-sans">
      <div className="max-w-md w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-xl font-bold">Đã có lỗi xảy ra</h2>
        <p className="text-neutral-400 text-xs">
          {error?.message || "Hệ thống đang gặp sự cố tạm thời. Vui lòng thử lại sau."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="w-full py-2.5 px-4 bg-white text-neutral-950 font-bold rounded-xl text-xs hover:bg-neutral-100 transition cursor-pointer"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
