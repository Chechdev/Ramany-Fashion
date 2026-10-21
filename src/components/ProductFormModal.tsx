"use client";

import React, { useState } from "react";
import { ProductItem, ProductFormValues, getProductImages } from "@/types/product";
import { X, Loader2, AlertCircle, Upload, Trash2, Star, ImagePlus } from "lucide-react";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: ProductFormValues, id?: string) => Promise<{ success: boolean; message?: string }>;
  productToEdit?: ProductItem | null;
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  productToEdit,
}: ProductFormModalProps) {
  const isEditing = Boolean(productToEdit);

  const [formData, setFormData] = useState<ProductFormValues>(() => {
    if (productToEdit) {
      return {
        sku: productToEdit.sku,
        name: productToEdit.name,
        description: productToEdit.description || "",
        category: productToEdit.category,
        gender: productToEdit.gender,
        price: Number(productToEdit.price) || 0,
        costPrice: productToEdit.costPrice ? Number(productToEdit.costPrice) : 0,
        stockQuantity: productToEdit.stockQuantity,
        size: productToEdit.size,
        color: productToEdit.color,
        imageUrl: productToEdit.imageUrl || "",
        status: productToEdit.status,
      };
    }
    return {
      sku: "",
      name: "",
      description: "",
      category: "Áo thun",
      gender: "Unisex",
      price: 150000,
      costPrice: 80000,
      stockQuantity: 10,
      size: "M",
      color: "Đen",
      imageUrl: "",
      status: "ACTIVE",
    };
  });

  const [imagesList, setImagesList] = useState<string[]>(() => {
    return getProductImages(productToEdit);
  });
  const [isUploading, setIsUploading] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.sku.trim()) {
      errs.sku = "Vui lòng nhập mã SKU";
    } else if (!/^[A-Za-z0-9-_]+$/.test(formData.sku.trim())) {
      errs.sku = "Mã SKU chỉ được chứa ký tự chữ cái, số, dấu - hoặc _";
    }

    if (!formData.name.trim()) {
      errs.name = "Vui lòng nhập tên sản phẩm";
    }

    if (!formData.category.trim()) {
      errs.category = "Vui lòng nhập danh mục";
    }

    if (formData.price < 0) {
      errs.price = "Giá bán không được nhỏ hơn 0";
    }

    if (formData.costPrice !== undefined && formData.costPrice < 0) {
      errs.costPrice = "Giá vốn không được nhỏ hơn 0";
    }

    if (formData.stockQuantity < 0) {
      errs.stockQuantity = "Số lượng tồn kho không được âm";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setServerError("");

    const finalData: ProductFormValues = {
      ...formData,
      images: imagesList,
      imageUrl: imagesList[0] || formData.imageUrl || "",
    };

    const res = await onSave(finalData, productToEdit?.id);

    setIsSubmitting(false);
    if (res.success) {
      onClose();
    } else {
      setServerError(res.message || "Có lỗi xảy ra khi lưu sản phẩm");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-neutral-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
            <p className="text-xs text-neutral-500">
              {isEditing
                ? `Cập nhật thông tin cho SKU: ${productToEdit?.sku}`
                : "Điền thông tin bên dưới để tạo sản phẩm vào Supabase"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {serverError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SKU */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Mã SKU <span className="text-rose-500">*</span>
              </label>
              <input
                id="form-sku"
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="VD: TS001-M-BLK"
                className={`w-full px-3 py-2 text-sm rounded-lg border font-mono font-medium text-neutral-900 placeholder:text-neutral-400 ${
                  errors.sku ? "border-rose-400 bg-rose-50" : "border-neutral-300 bg-white"
                } focus:outline-hidden focus:ring-2 focus:ring-neutral-900`}
              />
              {errors.sku && <p className="text-xs text-rose-500 mt-1">{errors.sku}</p>}
            </div>

            {/* Tên sản phẩm */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Tên sản phẩm <span className="text-rose-500">*</span>
              </label>
              <input
                id="form-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Áo Thun Cổ Tròn Cotton"
                className={`w-full px-3 py-2 text-sm rounded-lg border font-medium text-neutral-900 placeholder:text-neutral-400 ${
                  errors.name ? "border-rose-400 bg-rose-50" : "border-neutral-300 bg-white"
                } focus:outline-hidden focus:ring-2 focus:ring-neutral-900`}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>

            {/* Danh mục */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Danh mục <span className="text-rose-500">*</span>
              </label>
              <input
                id="form-category"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="VD: Áo thun, Sơ mi, Quần jeans..."
                className={`w-full px-3 py-2 text-sm rounded-lg border font-medium text-neutral-900 placeholder:text-neutral-400 ${
                  errors.category ? "border-rose-400 bg-rose-50" : "border-neutral-300 bg-white"
                } focus:outline-hidden focus:ring-2 focus:ring-neutral-900`}
              />
              {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
            </div>

            {/* Đối tượng */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Đối tượng
              </label>
              <select
                id="form-gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white font-medium text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
              >
                <option value="Unisex">Unisex (Nam & Nữ)</option>
                <option value="Men">Nam (Men)</option>
                <option value="Women">Nữ (Women)</option>
                <option value="Kids">Trẻ em (Kids)</option>
              </select>
            </div>

            {/* Giá bán */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Giá bán (VND) <span className="text-rose-500">*</span>
              </label>
              <input
                id="form-price"
                type="number"
                min="0"
                step="1000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className={`w-full px-3 py-2 text-sm rounded-lg border font-medium text-neutral-900 placeholder:text-neutral-400 ${
                  errors.price ? "border-rose-400 bg-rose-50" : "border-neutral-300 bg-white"
                } focus:outline-hidden focus:ring-2 focus:ring-neutral-900`}
              />
              {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
            </div>

            {/* Giá vốn */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Giá vốn (VND)
              </label>
              <input
                id="form-cost-price"
                type="number"
                min="0"
                step="1000"
                value={formData.costPrice || 0}
                onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white font-medium text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            {/* Tồn kho */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Số lượng tồn kho <span className="text-rose-500">*</span>
              </label>
              <input
                id="form-stock"
                type="number"
                min="0"
                step="1"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                className={`w-full px-3 py-2 text-sm rounded-lg border font-medium text-neutral-900 placeholder:text-neutral-400 ${
                  errors.stockQuantity ? "border-rose-400 bg-rose-50" : "border-neutral-300 bg-white"
                } focus:outline-hidden focus:ring-2 focus:ring-neutral-900`}
              />
              {errors.stockQuantity && (
                <p className="text-xs text-rose-500 mt-1">{errors.stockQuantity}</p>
              )}
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Trạng thái hoạt động
              </label>
              <select
                id="form-status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as "ACTIVE" | "INACTIVE" })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white font-medium text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
              >
                <option value="ACTIVE">ACTIVE (Mở bán)</option>
                <option value="INACTIVE">INACTIVE (Tạm ngưng)</option>
              </select>
            </div>

            {/* Size */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Kích cỡ</label>
              <input
                id="form-size"
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="VD: S, M, L, XL, 30, Free Size..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            {/* Màu sắc */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Màu sắc</label>
              <input
                id="form-color"
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="VD: Đen, Trắng, Xanh Navy..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* QUẢN LÝ HÌNH ẢNH MINH HỌA (KHÔNG GIỚI HẠN) */}
          <div className="space-y-3 pt-3 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-neutral-800">
                  Hình ảnh minh họa sản phẩm (Không giới hạn)
                </label>
                <p className="text-[11px] text-neutral-500">
                  Tải lên ảnh từ máy tính/điện thoại hoặc dán link URL. Ảnh đầu tiên sẽ tự động làm ảnh bìa chính.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-900 text-white">
                {imagesList.length} ảnh
              </span>
            </div>

            {/* Khung nút Tải lên & Nhập URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Nút Upload nhiều file từ thiết bị */}
              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-900 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-bold text-xs transition cursor-pointer">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
                    <span>Đang tải ảnh lên hệ thống...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-neutral-700" />
                    <span>Tải ảnh từ máy / điện thoại</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={isUploading}
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;

                    setIsUploading(true);
                    setServerError("");

                    try {
                      const uploadData = new FormData();
                      for (let i = 0; i < files.length; i++) {
                        uploadData.append("files", files[i]);
                      }

                      const res = await fetch("/api/upload", {
                        method: "POST",
                        body: uploadData,
                      });

                      const data = await res.json();
                      if (res.ok && data.urls) {
                        setImagesList((prev) => [...prev, ...data.urls]);
                      } else {
                        setServerError(data.message || "Tải ảnh thất bại");
                      }
                    } catch {
                      setServerError("Lỗi kết nối khi tải ảnh lên");
                    } finally {
                      setIsUploading(false);
                      e.target.value = "";
                    }
                  }}
                  className="hidden"
                />
              </label>

              {/* Nhập URL ngoài */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={manualUrlInput}
                  onChange={(e) => setManualUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (manualUrlInput.trim()) {
                        setImagesList((prev) => [...prev, manualUrlInput.trim()]);
                        setManualUrlInput("");
                      }
                    }
                  }}
                  placeholder="Hoặc dán URL ảnh (https://...)"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (manualUrlInput.trim()) {
                      setImagesList((prev) => [...prev, manualUrlInput.trim()]);
                      setManualUrlInput("");
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition cursor-pointer shrink-0 inline-flex items-center gap-1"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  <span>Thêm</span>
                </button>
              </div>
            </div>

            {/* Danh sách ảnh đã thêm (Thumbnail grid) */}
            {imagesList.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-2 max-h-52 overflow-y-auto p-2 border rounded-xl border-neutral-200 bg-neutral-50">
                {imagesList.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-lg border-2 overflow-hidden bg-white shadow-2xs transition-all hover:shadow-md"
                    style={{ borderColor: index === 0 ? "#171717" : "#e5e5e5" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200";
                      }}
                    />

                    {/* Badge ảnh bìa */}
                    {index === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-neutral-950 text-white uppercase shadow-xs">
                        Ảnh chính
                      </span>
                    )}

                    {/* Lớp phủ thao tác khi hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 backdrop-blur-2xs">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setImagesList((prev) => prev.filter((_, i) => i !== index))}
                          className="p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer shadow-xs"
                          title="Xóa ảnh này"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setImagesList((prev) => {
                              const item = prev[index];
                              const rest = prev.filter((_, i) => i !== index);
                              return [item, ...rest];
                            });
                          }}
                          className="w-full py-1 rounded bg-white text-neutral-900 font-bold text-[9px] transition cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                          title="Đặt làm ảnh bìa chính"
                        >
                          <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                          <span>Đặt làm bìa</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-5 text-center border-2 border-dashed border-neutral-200 rounded-xl text-neutral-400 text-xs bg-white">
                Chưa có ảnh nào. Bấm nút <strong>&quot;Tải ảnh từ máy / điện thoại&quot;</strong> hoặc dán URL ở trên để thêm hình ảnh minh họa.
              </div>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Mô tả chi tiết
            </label>
            <textarea
              id="form-description"
              rows={3}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Thông tin chất liệu, form dáng, cách bảo quản..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          {/* Footer nút bấm */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              id="btn-submit-product"
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-lg transition cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu vào Supabase...</span>
                </>
              ) : (
                <span>{isEditing ? "Cập nhật sản phẩm" : "Thêm vào Database"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
