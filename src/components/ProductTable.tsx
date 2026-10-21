"use client";

import React, { useState } from "react";
import { ProductItem, ProductFormValues } from "@/types/product";
import {
  Eye,
  Edit2,
  Trash2,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Check,
  X,
  Loader2,
  Plus,
  Minus,
  Package,
  DollarSign,
  Maximize2,
} from "lucide-react";

interface ProductTableProps {
  products: ProductItem[];
  isLoading: boolean;
  onView: (product: ProductItem) => void;
  onEdit: (product: ProductItem) => void;
  onDelete: (product: ProductItem) => void;
  onQuickUpdate?: (id: string, patchData: Partial<ProductFormValues>) => Promise<{ success: boolean; message?: string }>;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

type QuickEditType = "stock" | "price" | "size" | null;

interface QuickEditTarget {
  product: ProductItem;
  type: QuickEditType;
}

export function ProductTable({
  products,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onQuickUpdate,
  pagination,
  onPageChange,
  onPageSizeChange,
}: ProductTableProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // State cho Quick Edit Popover / Modal
  const [quickEditTarget, setQuickEditTarget] = useState<QuickEditTarget | null>(null);
  const [quickStockVal, setQuickStockVal] = useState<number>(0);
  const [quickPriceVal, setQuickPriceVal] = useState<number>(0);
  const [quickCostPriceVal, setQuickCostPriceVal] = useState<number>(0);
  const [quickSizeVal, setQuickSizeVal] = useState<string>("");
  const [isQuickSaving, setIsQuickSaving] = useState(false);

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

  // Mở trình chỉnh sửa nhanh Tồn kho
  const openStockEdit = (product: ProductItem) => {
    setQuickEditTarget({ product, type: "stock" });
    setQuickStockVal(product.stockQuantity);
  };

  // Mở trình chỉnh sửa nhanh Giá
  const openPriceEdit = (product: ProductItem) => {
    setQuickEditTarget({ product, type: "price" });
    setQuickPriceVal(Number(product.price) || 0);
    setQuickCostPriceVal(product.costPrice ? Number(product.costPrice) : 0);
  };

  // Mở trình chỉnh sửa nhanh Size
  const openSizeEdit = (product: ProductItem) => {
    setQuickEditTarget({ product, type: "size" });
    setQuickSizeVal(product.size || "M");
  };

  // Thực hiện lưu nhanh
  const handleSaveQuickEdit = async () => {
    if (!quickEditTarget || !onQuickUpdate || isQuickSaving) return;

    setIsQuickSaving(true);
    let patchData: Partial<ProductFormValues> = {};

    if (quickEditTarget.type === "stock") {
      patchData = { stockQuantity: Math.max(0, quickStockVal) };
    } else if (quickEditTarget.type === "price") {
      patchData = {
        price: Math.max(0, quickPriceVal),
        costPrice: Math.max(0, quickCostPriceVal),
      };
    } else if (quickEditTarget.type === "size") {
      patchData = { size: quickSizeVal.trim() || "Free Size" };
    }

    const res = await onQuickUpdate(quickEditTarget.product.id, patchData);
    setIsQuickSaving(false);

    if (res.success) {
      setQuickEditTarget(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-left text-sm text-neutral-600">
          <thead className="bg-neutral-50 text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
            <tr>
              <th className="py-3.5 px-4 w-14">Ảnh</th>
              <th className="py-3.5 px-4">SKU</th>
              <th className="py-3.5 px-4">Tên sản phẩm</th>
              <th className="py-3.5 px-4">Danh mục</th>
              <th className="py-3.5 px-4">Đối tượng</th>
              <th className="py-3.5 px-4">Size</th>
              <th className="py-3.5 px-4">Màu sắc</th>
              <th className="py-3.5 px-4 text-right">Giá bán</th>
              <th className="py-3.5 px-4 text-right">Giá vốn</th>
              <th className="py-3.5 px-4 text-center bg-amber-50/50 border-x border-amber-200/50">
                <span className="inline-flex items-center gap-1 text-amber-900 font-bold">
                  <Package className="w-3.5 h-3.5" />
                  Tồn kho
                </span>
              </th>
              <th className="py-3.5 px-4 text-center">Trạng thái</th>
              <th className="py-3.5 px-4">Ngày cập nhật</th>
              {/* Cột Thao tác cố định bên phải (Sticky Right) */}
              <th className="py-3.5 px-4 text-center w-48 sticky right-0 bg-neutral-50 z-20 shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] border-l border-neutral-200">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-3 px-4">
                    <div className="w-10 h-10 bg-neutral-200 rounded-md" />
                  </td>
                  <td className="py-3 px-4"><div className="h-4 bg-neutral-200 rounded-sm w-20" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-neutral-200 rounded-sm w-36" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-neutral-200 rounded-sm w-20" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-neutral-200 rounded-sm w-16" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-neutral-200 rounded-sm w-10" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-neutral-200 rounded-sm w-12" /></td>
                  <td className="py-3 px-4 text-right"><div className="h-4 bg-neutral-200 rounded-sm w-20 ml-auto" /></td>
                  <td className="py-3 px-4 text-right"><div className="h-4 bg-neutral-200 rounded-sm w-20 ml-auto" /></td>
                  <td className="py-3 px-4 text-center"><div className="h-4 bg-neutral-200 rounded-sm w-10 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><div className="h-5 bg-neutral-200 rounded-full w-20 mx-auto" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-neutral-200 rounded-sm w-24" /></td>
                  <td className="py-3 px-4 text-center sticky right-0 bg-white">
                    <div className="h-7 bg-neutral-200 rounded-md w-28 mx-auto" />
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={13} className="py-12 text-center text-neutral-500">
                  <div className="max-w-xs mx-auto">
                    <p className="text-base font-medium text-neutral-700">Chưa có sản phẩm nào</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Thử tìm kiếm với từ khóa khác hoặc nhấn &quot;Thêm sản phẩm&quot; để tạo mới.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const hasImage = product.imageUrl && !imageErrors[product.id];
                const isOutOfStock = product.stockQuantity <= 0;

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-neutral-50/80 transition-colors group text-neutral-800"
                  >
                    {/* Ảnh */}
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                        {hasImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={product.imageUrl || ""}
                            alt={product.name}
                            onError={() =>
                              setImageErrors((prev) => ({ ...prev, [product.id]: true }))
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageOff className="w-4 h-4 text-neutral-400" />
                        )}
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-4 font-mono font-medium text-xs text-neutral-900">
                      {product.sku}
                    </td>

                    {/* Tên */}
                    <td
                      className="py-3 px-4 font-medium text-neutral-900 max-w-xs truncate cursor-pointer hover:text-blue-600 transition"
                      title={`${product.name} (Nhấn để xem chi tiết)`}
                      onClick={() => onView(product)}
                    >
                      {product.name}
                    </td>

                    {/* Danh mục */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-sm bg-neutral-100 text-neutral-700 text-xs">
                        {product.category}
                      </span>
                    </td>

                    {/* Đối tượng */}
                    <td className="py-3 px-4 text-xs">{product.gender}</td>

                    {/* Size (Có nút chỉnh sửa nhanh) */}
                    <td className="py-3 px-4 text-xs">
                      <button
                        onClick={() => openSizeEdit(product)}
                        title="Bấm để sửa nhanh Size"
                        className="group/size inline-flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200 transition font-medium cursor-pointer"
                      >
                        <span>{product.size}</span>
                        <Pencil className="w-3 h-3 text-neutral-400 group-hover/size:text-blue-600 opacity-0 group-hover/size:opacity-100 transition" />
                      </button>
                    </td>

                    {/* Màu sắc */}
                    <td className="py-3 px-4 text-xs">{product.color}</td>

                    {/* Giá bán (Có nút chỉnh sửa nhanh) */}
                    <td className="py-3 px-4 text-right font-medium text-neutral-900">
                      <button
                        onClick={() => openPriceEdit(product)}
                        title="Bấm để sửa nhanh Giá bán"
                        className="group/price inline-flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200 transition cursor-pointer ml-auto"
                      >
                        <span>{formatCurrency(product.price)}</span>
                        <Pencil className="w-3 h-3 text-neutral-400 group-hover/price:text-blue-600 opacity-0 group-hover/price:opacity-100 transition" />
                      </button>
                    </td>

                    {/* Giá vốn */}
                    <td className="py-3 px-4 text-right text-neutral-500 text-xs">
                      {formatCurrency(product.costPrice)}
                    </td>

                    {/* TỒN KHO — NÚT BẤM VÀO CHỈNH SỬA CHI TIẾT SỐ LƯỢNG (KHOANH ĐỎ) */}
                    <td className="py-3 px-4 text-center bg-amber-50/30 border-x border-amber-200/40">
                      <button
                        id={`btn-edit-stock-${product.id}`}
                        onClick={() => openStockEdit(product)}
                        title="Nhấn vào đây để sửa nhanh số lượng tồn kho"
                        className={`group/stock inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition shadow-2xs hover:scale-105 cursor-pointer ${
                          isOutOfStock
                            ? "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100"
                            : product.stockQuantity < 10
                            ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                        }`}
                      >
                        <Package className="w-3.5 h-3.5 opacity-70" />
                        <span>{product.stockQuantity}</span>
                        <Pencil className="w-3 h-3 opacity-60 group-hover/stock:opacity-100 text-blue-600 transition ml-0.5" />
                      </button>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                        }`}
                      >
                        {product.status === "ACTIVE" ? "Đang bán" : "Tạm dừng"}
                      </span>
                    </td>

                    {/* Ngày cập nhật */}
                    <td className="py-3 px-4 text-xs text-neutral-500 whitespace-nowrap">
                      {formatDate(product.updatedAt)}
                    </td>

                    {/* THAO TÁC CỐ ĐỊNH BÊN PHẢI (STICKY RIGHT) — NÚT SỬA CHI TIẾT NỔI BẬT */}
                    <td className="py-3 px-4 text-center sticky right-0 bg-white group-hover:bg-neutral-50/90 z-10 border-l border-neutral-200 shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.06)]">
                      <div className="inline-flex items-center gap-1.5 justify-center">
                        {/* NÚT CHÍNH: SỬA CHI TIẾT */}
                        <button
                          id={`btn-edit-detail-${product.id}`}
                          onClick={() => onEdit(product)}
                          title="Mở form chỉnh sửa toàn diện tất cả thông tin"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs cursor-pointer active:scale-95"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Sửa chi tiết</span>
                        </button>

                        {/* Nút Xem chi tiết */}
                        <button
                          onClick={() => onView(product)}
                          title="Xem chi tiết sản phẩm"
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/70 rounded-lg transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Nút Xóa */}
                        <button
                          onClick={() => onDelete(product)}
                          title="Xóa sản phẩm"
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="py-3 px-4 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600">
        <div className="flex items-center gap-4">
          <span>
            Hiển thị{" "}
            <strong>
              {pagination.totalItems === 0
                ? 0
                : (pagination.page - 1) * pagination.pageSize + 1}
            </strong>{" "}
            -{" "}
            <strong>
              {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)}
            </strong>{" "}
            trong tổng số <strong>{pagination.totalItems}</strong> sản phẩm
          </span>

          <div className="flex items-center gap-1.5">
            <span>Dòng/trang:</span>
            <select
              value={pagination.pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-neutral-300 rounded-md text-xs cursor-pointer focus:outline-hidden"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || isLoading}
              className="p-1 rounded-md border border-neutral-300 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || isLoading}
              className="p-1 rounded-md border border-neutral-300 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL / POPOVER CHỈNH SỬA NHANH (QUICK EDIT MODAL) */}
      {quickEditTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header Modal */}
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                {quickEditTarget.type === "stock" && (
                  <Package className="w-5 h-5 text-amber-600" />
                )}
                {quickEditTarget.type === "price" && (
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                )}
                {quickEditTarget.type === "size" && (
                  <Maximize2 className="w-5 h-5 text-blue-600" />
                )}
                <h3 className="font-bold text-sm text-neutral-900">
                  {quickEditTarget.type === "stock" && "Chỉnh sửa số lượng tồn kho"}
                  {quickEditTarget.type === "price" && "Chỉnh sửa giá bán & giá vốn"}
                  {quickEditTarget.type === "size" && "Chỉnh sửa kích cỡ (Size)"}
                </h3>
              </div>
              <button
                onClick={() => setQuickEditTarget(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Form */}
            <div className="p-5 space-y-4">
              <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
                <p className="font-bold text-neutral-900 truncate">
                  {quickEditTarget.product.name}
                </p>
                <p className="text-neutral-500 font-mono mt-0.5">
                  SKU: {quickEditTarget.product.sku}
                </p>
              </div>

              {/* 1. SỬA TỒN KHO */}
              {quickEditTarget.type === "stock" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Số lượng tồn kho hiện tại:
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuickStockVal((v) => Math.max(0, v - 1))}
                        className="w-10 h-10 rounded-lg border border-neutral-300 hover:bg-neutral-100 flex items-center justify-center font-bold text-neutral-700 cursor-pointer active:scale-95"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={quickStockVal}
                        onChange={(e) => setQuickStockVal(Number(e.target.value))}
                        className="flex-1 text-center font-extrabold text-lg py-2 border border-neutral-300 rounded-lg bg-white text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setQuickStockVal((v) => v + 1)}
                        className="w-10 h-10 rounded-lg border border-neutral-300 hover:bg-neutral-100 flex items-center justify-center font-bold text-neutral-700 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Nút cộng nhanh */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-neutral-400">Tăng nhanh:</span>
                    <button
                      type="button"
                      onClick={() => setQuickStockVal((v) => v + 5)}
                      className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-700 transition cursor-pointer"
                    >
                      +5
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickStockVal((v) => v + 10)}
                      className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-700 transition cursor-pointer"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickStockVal((v) => v + 20)}
                      className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-700 transition cursor-pointer"
                    >
                      +20
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickStockVal(0)}
                      className="px-2 py-1 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md transition cursor-pointer ml-auto"
                    >
                      Hết hàng (0)
                    </button>
                  </div>
                </div>
              )}

              {/* 2. SỬA GIÁ BÁN & GIÁ VỐN */}
              {quickEditTarget.type === "price" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Giá bán (VND) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="1000"
                      min="0"
                      value={quickPriceVal}
                      onChange={(e) => setQuickPriceVal(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-bold border border-neutral-300 rounded-lg bg-white text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-xs text-neutral-400 mt-1">
                      Hiển thị: <strong>{formatCurrency(quickPriceVal)}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Giá vốn (VND)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      min="0"
                      value={quickCostPriceVal}
                      onChange={(e) => setQuickCostPriceVal(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* 3. SỬA SIZE */}
              {quickEditTarget.type === "size" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Chọn size nhanh:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["S", "M", "L", "XL", "2XL", "Free Size"].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setQuickSizeVal(sz)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                            quickSizeVal === sz
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Hoặc nhập size tùy chỉnh (VD: 29, 30, 31, 32, Oversize):
                    </label>
                    <input
                      type="text"
                      value={quickSizeVal}
                      onChange={(e) => setQuickSizeVal(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-semibold border border-neutral-300 rounded-lg bg-white text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Footer Modal */}
              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const prod = quickEditTarget.product;
                    setQuickEditTarget(null);
                    onEdit(prod);
                  }}
                  className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  Mở form sửa toàn bộ →
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickEditTarget(null)}
                    disabled={isQuickSaving}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveQuickEdit}
                    disabled={isQuickSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-lg transition shadow-xs cursor-pointer"
                  >
                    {isQuickSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Lưu thay đổi</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
