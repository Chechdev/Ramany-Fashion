import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 text-neutral-900 p-6 text-center">
      <h1 className="text-6xl font-black text-neutral-900 mb-2">404</h1>
      <h2 className="text-xl font-bold mb-4">Không tìm thấy trang</h2>
      <p className="text-neutral-500 text-sm max-w-md mb-6">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang địa chỉ khác.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
