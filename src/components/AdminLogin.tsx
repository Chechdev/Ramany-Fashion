"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, Sparkles } from "lucide-react";
import { RamanyFullBadge } from "@/components/RamanyLogo";
import { useLanguage } from "@/lib/i18n";
import { LanguageButton } from "@/components/LanguageSettingsModal";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const trimmedPass = password.trim();

      // Kiểm tra thông tin đăng nhập:
      // Mặc định: admin / admin123 hoặc ramany / ramany2026
      const isValidUser = trimmedUser === "admin" || trimmedUser === "ramany" || trimmedUser === "admin@ramany.com";
      const isValidPass = trimmedPass === "admin123" || trimmedPass === "ramany2026" || trimmedPass === "admin@123";

      if (isValidUser && isValidPass) {
        if (rememberMe) {
          localStorage.setItem("ramany_admin_logged", "true");
          localStorage.setItem("ramany_admin_user", trimmedUser);
        } else {
          sessionStorage.setItem("ramany_admin_logged", "true");
          sessionStorage.setItem("ramany_admin_user", trimmedUser);
        }
        onSuccess();
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không chính xác!");
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Decor Ambient Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-neutral-700/20 rounded-full blur-3xl pointer-events-none" />

      {/* Nút quay lại trang bán hàng */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-xs font-semibold px-3 py-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("store")}</span>
        </Link>
      </div>

      {/* Nút chọn ngôn ngữ góc trên phải */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageButton variant="dark" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card đăng nhập */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
          {/* Logo & Tiêu đề */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner mb-4">
              <RamanyFullBadge size={48} theme="dark" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold tracking-wider text-amber-300 uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{t("adminSubtitle")}</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide uppercase font-serif">
              {t("adminTitle")}
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs">
              RAMANY Management System
            </p>
          </div>

          {/* Thông báo lỗi nếu có */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form đăng nhập */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t("usernameOrEmail")}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t("password")}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-neutral-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-neutral-950 border-neutral-700 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                />
                <span>{t("rememberMe")}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm tracking-wide uppercase transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t("signIn")}</span>
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </>
              )}
            </button>
          </form>

          {/* Gợi ý tài khoản tiện lợi cho Admin */}
          <div className="mt-6 pt-5 border-t border-neutral-800/80 text-center">
            <p className="text-[11px] text-neutral-400 font-medium">
              Thông tin đăng nhập mặc định:
            </p>
            <div className="mt-1.5 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 font-mono">
              <span>User: <strong className="text-amber-400 font-bold">admin</strong></span>
              <span className="text-neutral-600">•</span>
              <span>Pass: <strong className="text-amber-400 font-bold">admin123</strong></span>
            </div>
          </div>
        </div>

        {/* Footer ghi chú */}
        <p className="text-center text-[11px] text-neutral-400 mt-6">
          RAMANY (RMN) Fashion &copy; 2026 — Bảo mật bởi hệ thống xác thực nội bộ
        </p>
      </div>
    </div>
  );
}
