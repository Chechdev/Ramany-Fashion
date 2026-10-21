"use client";

import React, { useState } from "react";
import { ProductItem } from "@/types/product";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
  onConfirm: (id: string) => Promise<{ success: boolean; message?: string }>;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  product,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !product) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError("");

    const res = await onConfirm(product.id);
    setIsDeleting(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.message || "Xóa sản phẩm thất bại.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-neutral-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Xác nhận xóa sản phẩm</h3>
              <p className="text-xs text-neutral-500">Hành động này sẽ xóa dữ liệu vĩnh viễn khỏi database</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-sm">
            <p className="font-semibold text-neutral-900">{product.name}</p>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">Mã SKU: {product.sku}</p>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              id="btn-confirm-delete"
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg transition cursor-pointer shadow-xs"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xóa...</span>
                </>
              ) : (
                <span>Xác nhận xóa</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
