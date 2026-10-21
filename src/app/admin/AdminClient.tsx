"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ProductItem, ProductFormValues, ProductsResponse } from "@/types/product";
import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductTable } from "@/components/ProductTable";
import { ProductFormModal } from "@/components/ProductFormModal";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ImportDialog } from "@/components/ImportDialog";
import { AdminLogin } from "@/components/AdminLogin";
import { AlertCircle, CheckCircle2, X, Store, ArrowLeft } from "lucide-react";

interface AdminClientProps {
  initialProducts?: ProductItem[];
  initialStats?: {
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;
    totalStockQuantity: number;
  };
  initialCategories?: string[];
  initialPagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  initialDbStatus?: "checking" | "connected" | "disconnected";
}

export function AdminClient({
  initialProducts = [],
  initialStats = { totalProducts: 0, activeProducts: 0, outOfStockProducts: 0, totalStockQuantity: 0 },
  initialCategories = [],
  initialPagination = { page: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
  initialDbStatus = "connected",
}: AdminClientProps) {
  // Xác thực đăng nhập Admin
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const isLoggedLocal = typeof window !== "undefined" && localStorage.getItem("ramany_admin_logged") === "true";
    const isLoggedSession = typeof window !== "undefined" && sessionStorage.getItem("ramany_admin_logged") === "true";
    setIsAuthenticated(isLoggedLocal || isLoggedSession);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ramany_admin_logged");
      localStorage.removeItem("ramany_admin_user");
      sessionStorage.removeItem("ramany_admin_logged");
      sessionStorage.removeItem("ramany_admin_user");
    }
    setIsAuthenticated(false);
  };

  // Trạng thái kết nối Database
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "disconnected">(initialDbStatus);

  // Dữ liệu sản phẩm & Phân trang
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [stats, setStats] = useState(initialStats || {
    totalProducts: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
    totalStockQuantity: 0,
  });
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [pagination, setPagination] = useState(initialPagination || {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });

  // Bộ lọc
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Loading & Toast notification
  const [isLoading, setIsLoading] = useState(initialProducts.length === 0);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductItem | null>(null);
  const [productToView, setProductToView] = useState<ProductItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Hiển thị thông báo Toast
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  // Kiểm tra kết nối Supabase qua Health check
  const checkDb = useCallback(async () => {
    setDbStatus("checking");
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      if (res.ok && data.status === "ok") {
        setDbStatus("connected");
      } else {
        setDbStatus("disconnected");
      }
    } catch {
      setDbStatus("disconnected");
    }
  }, []);

  // Tải danh sách sản phẩm từ backend khi trigger thủ công
  const reloadProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
      });

      if (debouncedSearch) params.set("search", debouncedSearch);
      if (category !== "ALL") params.set("category", category);
      if (status !== "ALL") params.set("status", status);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data: ProductsResponse = await res.json();

      if (res.ok) {
        setProducts(data.items);
        setPagination(data.pagination);
        setStats(data.stats);
        setCategories(data.categories);
        setDbStatus("connected");
      } else {
        setDbStatus("disconnected");
      }
    } catch {
      setDbStatus("disconnected");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, category, status]);

  // Kiểm tra kết nối ban đầu
  useEffect(() => {
    let ignore = false;
    const run = async () => {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        if (!ignore) {
          setDbStatus(res.ok && data.status === "ok" ? "connected" : "disconnected");
        }
      } catch {
        if (!ignore) setDbStatus("disconnected");
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, []);

  // Đồng bộ tải dữ liệu theo pagination & filter
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          pageSize: pagination.pageSize.toString(),
        });

        if (debouncedSearch) params.set("search", debouncedSearch);
        if (category !== "ALL") params.set("category", category);
        if (status !== "ALL") params.set("status", status);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data: ProductsResponse = await res.json();

        if (!ignore) {
          if (res.ok) {
            setProducts(data.items);
            setPagination(data.pagination);
            setStats(data.stats);
            setCategories(data.categories);
            setDbStatus("connected");
          } else {
            setDbStatus("disconnected");
          }
          setIsLoading(false);
        }
      } catch {
        if (!ignore) {
          setDbStatus("disconnected");
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [pagination.page, pagination.pageSize, debouncedSearch, category, status]);

  // Xử lý Thêm / Sửa sản phẩm
  const handleSaveProduct = async (
    values: ProductFormValues,
    id?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const isEdit = Boolean(id);
      const url = isEdit ? `/api/products/${id}` : "/api/products";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Lỗi khi lưu dữ liệu" };
      }

      showToast("success", data.message || "Lưu sản phẩm thành công");
      reloadProducts();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Lỗi máy chủ",
      };
    }
  };

  // Xử lý Cập nhật nhanh trực tiếp (Tồn kho, Giá, Size...)
  const handleQuickUpdate = async (
    id: string,
    patchData: Partial<ProductFormValues>
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchData),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.message || "Cập nhật thất bại");
        return { success: false, message: data.message || "Cập nhật thất bại" };
      }

      showToast("success", "Cập nhật thành công!");
      reloadProducts();
      return { success: true };
    } catch (err) {
      showToast("error", "Lỗi kết nối máy chủ");
      return {
        success: false,
        message: err instanceof Error ? err.message : "Lỗi máy chủ",
      };
    }
  };

  // Xử lý Xóa sản phẩm
  const handleDeleteProduct = async (
    id: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Xóa thất bại" };
      }

      showToast("success", data.message || "Đã xóa sản phẩm thành công");
      reloadProducts();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Lỗi máy chủ",
      };
    }
  };

  // Xuất CSV tất cả
  const handleExportAll = () => {
    window.open("/api/products/export", "_blank");
  };

  // Xuất CSV theo bộ lọc
  const handleExportFiltered = () => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category !== "ALL") params.set("category", category);
    if (status !== "ALL") params.set("status", status);

    window.open(`/api/products/export?${params.toString()}`, "_blank");
  };

  // Reset bộ lọc
  const handleResetFilters = () => {
    setSearch("");
    setCategory("ALL");
    setStatus("ALL");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = Boolean(search || category !== "ALL" || status !== "ALL");

  // Đang kiểm tra phiên đăng nhập (tránh nhấp nháy giao diện)
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-neutral-400 tracking-wider uppercase font-semibold">Đang xác thực quản trị...</p>
      </div>
    );
  }

  // Chưa đăng nhập -> Hiển thị màn hình Đăng Nhập Admin
  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div suppressHydrationWarning className="min-h-screen flex flex-col bg-neutral-50">
      {/* Top Bar chuyển đổi giữa Web Bán Hàng & Admin */}
      <div className="bg-neutral-900 text-white text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-sm font-semibold">
              KÊNH QUẢN TRỊ
            </span>
            <span className="text-neutral-400 hidden sm:inline">
              Hệ thống quản lý sản phẩm & cơ sở dữ liệu Supabase
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1 rounded-md transition font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Xem website bán hàng</span>
            <Store className="w-3.5 h-3.5 ml-0.5 text-neutral-400" />
          </Link>
        </div>
      </div>

      {/* Header */}
      <Header
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
        onExportAll={handleExportAll}
        onExportFiltered={handleExportFiltered}
        dbStatus={dbStatus}
        onCheckDb={checkDb}
        totalFiltered={pagination.totalItems}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 ${
              toast.type === "success"
                ? "bg-emerald-900 text-white border-emerald-800"
                : "bg-rose-900 text-white border-rose-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-300" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4 Cards Thống kê */}
        <StatsCards stats={stats} isLoading={isLoading && products.length === 0} />

        {/* Tìm kiếm & Bộ lọc */}
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={(val) => {
            setCategory(val);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          status={status}
          onStatusChange={(val) => {
            setStatus(val);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          categories={categories}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Bảng sản phẩm */}
        <ProductTable
          products={products}
          isLoading={isLoading}
          onView={(p) => setProductToView(p)}
          onEdit={(p) => setProductToEdit(p)}
          onDelete={(p) => setProductToDelete(p)}
          onQuickUpdate={handleQuickUpdate}
          pagination={pagination}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          onPageSizeChange={(pageSize) =>
            setPagination((prev) => ({ ...prev, pageSize, page: 1 }))
          }
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-4 text-center text-xs text-neutral-400">
        <p>RAMANY (RMN) &copy; 2026 — Next.js + TypeScript + Supabase PostgreSQL + Prisma</p>
      </footer>

      {/* Modals */}
      {isCreateOpen && (
        <ProductFormModal
          key="create-modal"
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSave={handleSaveProduct}
          productToEdit={null}
        />
      )}

      {productToEdit && (
        <ProductFormModal
          key={`edit-modal-${productToEdit.id}`}
          isOpen={Boolean(productToEdit)}
          onClose={() => setProductToEdit(null)}
          onSave={handleSaveProduct}
          productToEdit={productToEdit}
        />
      )}

      <ProductDetailModal
        isOpen={Boolean(productToView)}
        onClose={() => setProductToView(null)}
        product={productToView}
        onEdit={(p) => {
          setProductToView(null);
          setProductToEdit(p);
        }}
      />

      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        product={productToDelete}
        onConfirm={handleDeleteProduct}
      />

      <ImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccess={() => {
          reloadProducts();
          showToast("success", "Đã cập nhật dữ liệu sau khi nhập CSV!");
        }}
      />
    </div>
  );
}
