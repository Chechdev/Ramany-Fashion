"use client";

import React from "react";
import { ProductItem, getProductImages } from "@/types/product";
import { X } from "lucide-react";
import { ProductImageSlider } from "@/components/ProductImageSlider";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
  onEdit: (product: ProductItem) => void;
}

export function ProductDetailModal({
  isOpen,
  onClose,
  product,
  onEdit,
}: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

  const formatCurrency = (amount: string | number | null | undefined) => {
    if (amount === null || amount === undefined || amount === "") return "—";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(num)) return "—";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const priceNum = parseFloat(String(product.price)) || 0;
  const costNum = product.costPrice ? parseFloat(String(product.costPrice)) : 0;
  const margin = costNum > 0 ? ((priceNum - costNum) / priceNum) * 100 : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-neutral-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <span className="text-xs font-mono font-semibold text-neutral-500 uppercase">
              SKU: {product.sku}
            </span>
            <h2 className="text-lg font-bold text-neutral-900">{product.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Ảnh có slider & Thông tin chính */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-full sm:w-48 shrink-0">
              <ProductImageSlider
                images={getProductImages(product)}
                productName={product.name}
                aspectRatio="aspect-square"
                showThumbnails={true}
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
                  {product.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  {product.gender}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    product.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-neutral-100 text-neutral-600 border-neutral-200"
                  }`}
                >
                  {product.status === "ACTIVE" ? "Đang mở bán" : "Tạm dừng"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-neutral-500">Kích cỡ:</span>{" "}
                  <strong className="text-neutral-900">{product.size}</strong>
                </div>
                <div>
                  <span className="text-neutral-500">Màu sắc:</span>{" "}
                  <strong className="text-neutral-900">{product.color}</strong>
                </div>
                <div>
                  <span className="text-neutral-500">Tồn kho:</span>{" "}
                  <strong
                    className={
                      product.stockQuantity <= 0 ? "text-rose-600" : "text-neutral-900"
                    }
                  >
                    {product.stockQuantity} chiếc
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Khối giá & Lợi nhuận */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-center">
            <div>
              <p className="text-xs text-neutral-500">Giá bán</p>
              <p className="text-base font-bold text-neutral-900">
                {formatCurrency(product.price)}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Giá vốn</p>
              <p className="text-base font-semibold text-neutral-600">
                {formatCurrency(product.costPrice)}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Biên lợi nhuận</p>
              <p className="text-base font-semibold text-emerald-600">
                {margin !== null ? `${margin.toFixed(1)}%` : "—"}
              </p>
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
              Mô tả sản phẩm
            </h4>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-sm text-neutral-700 whitespace-pre-wrap">
              {product.description || "Chưa có mô tả chi tiết."}
            </div>
          </div>

          {/* Thời gian */}
          <div className="text-xs text-neutral-400 flex items-center justify-between border-t border-neutral-100 pt-3">
            <span>Ngày tạo: {formatDate(product.createdAt)}</span>
            <span>Cập nhật: {formatDate(product.updatedAt)}</span>
          </div>
        </div>

        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-200 rounded-lg transition cursor-pointer"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(product);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition cursor-pointer"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}
