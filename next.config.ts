import type { NextConfig } from "next";

// Tự động chuẩn hóa và làm sạch NODE_ENV tránh lỗi non-standard NODE_ENV
const env = process.env as Record<string, string | undefined>;
if (env.NODE_ENV) {
  env.NODE_ENV = env.NODE_ENV.replace(/['"]/g, "").trim();
}
if (!["production", "development", "test"].includes(env.NODE_ENV || "")) {
  env.NODE_ENV = "production";
}

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "10.23.3.154",
    "10.*.*.*",
    "192.168.*.*",
    "172.*.*.*",
    "*.trycloudflare.com",
    "*.loca.lt",
    "*.ngrok.io",
    "*.ngrok-free.app",
    "*.untun.io",
    "*.ngrok.app",
  ],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
