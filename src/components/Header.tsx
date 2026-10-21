"use client";

import React, { useState } from "react";
import { Plus, Upload, Download, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { RamanyFullBadge } from "@/components/RamanyLogo";

interface HeaderProps {
  onOpenCreate: () => void;
  onOpenImport: () => void;
  onExportAll: () => void;
  onExportFiltered: () => void;
  dbStatus: "checking" | "connected" | "disconnected";
  onCheckDb: () => void;
  totalFiltered: number;
}

export function Header({
  onOpenCreate,
  onOpenImport,
  onExportAll,
  onExportFiltered,
  dbStatus,
  onCheckDb,
  totalFiltered,
}: HeaderProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Logo & Tiêu đề */}
          <div className="flex items-center gap-3">
            <RamanyFullBadge size={44} theme="dark" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-[0.2em] text-neutral-900 uppercase font-serif">
                  RAMANY
                </span>
                {/* Trạng thái kết nối DB */}
                <button
                  onClick={onCheckDb}
                  title="Bấm để kiểm tra lại kết nối Supabase"
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium transition cursor-pointer hover:opacity-80"
                >
                  {dbStatus === "checking" && (
                    <span className="inline-flex items-center gap-1 text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Đang kết nối...
                    </span>
                  )}
                  {dbStatus === "connected" && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Supabase Online
                    </span>
                  )}
                  {dbStatus === "disconnected" && (
                    <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3 text-rose-600" />
                      Mất kết nối DB
                    </span>
                  )}
                </button>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                Quản lý sản phẩm
              </h1>
            </div>
          </div>

          {/* Nhóm nút thao tác */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Nút Nhập CSV */}
            <button
              id="btn-import-csv"
              onClick={onOpenImport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition shadow-xs cursor-pointer"
            >
              <Upload className="w-4 h-4 text-neutral-500" />
              <span>Nhập CSV</span>
            </button>

            {/* Nút Xuất CSV Dropdown */}
            <div className="relative">
              <button
                id="btn-export-csv"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-neutral-500" />
                <span>Xuất CSV</span>
              </button>

              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => {
                        setShowExportMenu(false);
                        onExportAll();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center justify-between cursor-pointer"
                    >
                      <span>Xuất tất cả sản phẩm</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowExportMenu(false);
                        onExportFiltered();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center justify-between cursor-pointer border-t border-neutral-100"
                    >
                      <span>Xuất theo bộ lọc ({totalFiltered})</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Nút Thêm sản phẩm */}
            <button
              id="btn-add-product"
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
