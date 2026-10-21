"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#0a0a0a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "20px" }}>
        <div style={{ maxWidth: "420px", textAlign: "center" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>Đã có lỗi hệ thống xảy ra</h2>
          <p style={{ color: "#a3a3a3", fontSize: "14px", marginBottom: "20px" }}>
            {error?.message || "Vui lòng thử lại sau giây lát."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ padding: "10px 20px", background: "#fff", color: "#000", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
