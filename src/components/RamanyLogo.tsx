"use client";

import React from "react";

interface RamanyLogoProps {
  className?: string;
  size?: number; // kích thước icon (mặc định 36px)
  showText?: boolean;
  textColor?: string;
  variant?: "dark" | "light" | "auto";
}

/**
 * Logo chính thức của thương hiệu RAMANY (biểu tượng 3 cánh hoa trefoil đối xứng + chữ RMN/RAMANY)
 */
export function RamanyLogo({
  className = "",
  size = 36,
  showText = true,
  variant = "auto",
}: RamanyLogoProps) {
  // Màu sắc theo variant
  const fillColor =
    variant === "light"
      ? "#ffffff"
      : variant === "dark"
      ? "#0a0a0a"
      : "currentColor";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Biểu tượng 3 cánh đối xứng xoay 120 độ */}
      <svg
        width={size}
        height={size}
        viewBox="-75 -75 150 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <g fill={fillColor}>
          {/* Cánh trên (0 độ) */}
          <path d="M 0 0 C -22 -18, -22 -48, 0 -70 C 22 -48, 22 -18, 0 0 Z" />
          {/* Cánh phải dưới (120 độ) */}
          <g transform="rotate(120)">
            <path d="M 0 0 C -22 -18, -22 -48, 0 -70 C 22 -48, 22 -18, 0 0 Z" />
          </g>
          {/* Cánh trái dưới (240 độ) */}
          <g transform="rotate(240)">
            <path d="M 0 0 C -22 -18, -22 -48, 0 -70 C 22 -48, 22 -18, 0 0 Z" />
          </g>
        </g>
      </svg>

      {/* Tên thương hiệu RAMANY */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-serif font-black tracking-[0.2em] leading-none text-base sm:text-lg uppercase ${
              variant === "light"
                ? "text-white"
                : variant === "dark"
                ? "text-neutral-950"
                : "text-inherit"
            }`}
          >
            RAMANY
          </span>
          <span
            className={`text-[9px] uppercase tracking-[0.35em] font-medium leading-tight mt-0.5 ${
              variant === "light" ? "text-neutral-300" : "text-neutral-500"
            }`}
          >
            PARIS &bull; MINIMAL
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Biểu tượng logo vuông đầy đủ có chữ RMN bên dưới giống hình gốc
 */
export function RamanyFullBadge({
  size = 56,
  className = "",
  theme = "dark",
}: {
  size?: number;
  className?: string;
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-neutral-950 text-white" : "bg-white text-neutral-950 border border-neutral-200";
  const fill = isDark ? "#ffffff" : "#0a0a0a";

  return (
    <div
      className={`rounded-xl flex flex-col items-center justify-center p-1.5 shadow-xs transition-transform duration-300 hover:scale-105 shrink-0 ${bgClass} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="-75 -75 150 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill={fill}>
          <path d="M 0 0 C -22 -18, -22 -48, 0 -70 C 22 -48, 22 -18, 0 0 Z" />
          <g transform="rotate(120)">
            <path d="M 0 0 C -22 -18, -22 -48, 0 -70 C 22 -48, 22 -18, 0 0 Z" />
          </g>
          <g transform="rotate(240)">
            <path d="M 0 0 C -22 -18, -22 -48, 0 -70 C 22 -48, 22 -18, 0 0 Z" />
          </g>
        </g>
      </svg>
      <span
        className="font-serif font-black tracking-[0.25em] leading-none uppercase mt-0.5"
        style={{ fontSize: Math.max(9, Math.round(size * 0.18)) }}
      >
        RMN
      </span>
    </div>
  );
}
