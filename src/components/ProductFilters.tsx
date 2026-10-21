"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  categories: string[];
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  categories,
  onReset,
  hasActiveFilters,
}: ProductFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs mb-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Tìm kiếm */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id="filter-search-input"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên sản phẩm hoặc SKU..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-medium placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 focus:bg-white transition"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Lọc theo danh mục */}
        <div className="w-full md:w-52">
          <select
            id="filter-category-select"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-neutral-900 focus:bg-white transition cursor-pointer"
          >
            <option value="ALL">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc theo trạng thái */}
        <div className="w-full md:w-44">
          <select
            id="filter-status-select"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-neutral-900 focus:bg-white transition cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="INACTIVE">Tạm dừng bán</option>
          </select>
        </div>

        {/* Nút đặt lại */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Xóa lọc</span>
          </button>
        )}
      </div>
    </div>
  );
}
