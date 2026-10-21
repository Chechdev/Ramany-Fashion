"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

interface ProductImageSliderProps {
  images: string[];
  productName: string;
  className?: string;
  aspectRatio?: "aspect-square" | "aspect-3/4" | "aspect-auto";
  showThumbnails?: boolean;
}

export function ProductImageSlider({
  images,
  productName,
  className = "",
  aspectRatio = "aspect-square",
  showThumbnails = true,
}: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Lọc danh sách ảnh hợp lệ, nếu không có ảnh nào thì dùng mảng rỗng
  const validImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const total = validImages.length;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  if (total === 0) {
    return (
      <div
        className={`w-full ${aspectRatio} bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-400 ${className}`}
      >
        <div className="flex flex-col items-center gap-2">
          <ImageOff className="w-10 h-10 text-neutral-300" />
          <span className="text-xs">Chưa có hình ảnh minh họa</span>
        </div>
      </div>
    );
  }

  const currentImg = validImages[currentIndex] || validImages[0];

  return (
    <div className={`flex flex-col gap-2.5 w-full select-none ${className}`}>
      {/* Khung ảnh chính */}
      <div
        className={`relative w-full ${aspectRatio} bg-neutral-100 rounded-xl overflow-hidden group shadow-2xs border border-neutral-200/80 flex items-center justify-center`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImg}
          alt={`${productName} - ảnh ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-102"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500";
          }}
        />

        {/* Nút mũi tên Lướt Trái / Phải (hiển thị khi có nhiều hơn 1 ảnh) */}
        {total > 1 && (
          <>
            {/* Mũi tên Trái */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-neutral-900 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 opacity-90 hover:opacity-100 z-10 backdrop-blur-xs"
              title="Ảnh trước"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>

            {/* Mũi tên Phải */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-neutral-900 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 opacity-90 hover:opacity-100 z-10 backdrop-blur-xs"
              title="Ảnh tiếp theo"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight className="w-5 h-5 -mr-0.5" />
            </button>

            {/* Huy hiệu số thứ tự ảnh (VD: 1/4) */}
            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-neutral-950/70 backdrop-blur-md text-white text-[11px] font-bold tracking-wider z-10">
              {currentIndex + 1} / {total}
            </div>

            {/* Thanh chấm tròn tiến trình */}
            <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10">
              {validImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? "w-5 bg-white shadow-xs"
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Chuyển tới ảnh ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Dãy thumbnail nhỏ bên dưới nếu có từ 2 ảnh trở lên */}
      {showThumbnails && total > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-thin">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                currentIndex === idx
                  ? "border-neutral-950 shadow-xs scale-102 ring-1 ring-neutral-950"
                  : "border-neutral-200 opacity-60 hover:opacity-100 hover:border-neutral-400"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
