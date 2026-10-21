"use client";

import React, { useState, useRef } from "react";
import { ImportResult } from "@/types/product";
import {
  X,
  Upload,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportDialog({ isOpen, onClose, onSuccess }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.endsWith(".csv")) {
        setErrorMsg("Vui lòng chọn định dạng file .csv");
        setFile(null);
        return;
      }
      setFile(selected);
      setErrorMsg("");
      setImportResult(null);
    }
  };

  const handleDownloadTemplate = () => {
    window.open("/api/products/export?type=template", "_blank");
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setErrorMsg("");
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/products/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Xảy ra lỗi khi nhập file");
        setIsUploading(false);
        return;
      }

      setImportResult(data.result);
      if (data.result.successCount > 0) {
        onSuccess();
      }
    } catch (err) {
      console.error("Import error:", err);
      setErrorMsg("Không thể kết nối đến máy chủ để tải lên file");
    } finally {
      setIsUploading(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setImportResult(null);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-neutral-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Nhập sản phẩm từ file CSV</h2>
            <p className="text-xs text-neutral-500">
              Nhập hàng loạt sản phẩm vào Supabase PostgreSQL
            </p>
          </div>
          <button
            onClick={() => {
              resetAll();
              onClose();
            }}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Tải template mẫu */}
          <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-5 h-5 text-neutral-600" />
              <div>
                <p className="text-xs font-semibold text-neutral-800">Chưa có file mẫu chuẩn?</p>
                <p className="text-xs text-neutral-500">
                  Tải file CSV mẫu có sẵn cột và dữ liệu minh họa tiếng Việt
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-100 transition cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file mẫu</span>
            </button>
          </div>

          {/* Vùng chọn file */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-300 hover:border-neutral-500 rounded-xl p-8 text-center cursor-pointer bg-neutral-50/50 hover:bg-neutral-50 transition"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-neutral-200/60 flex items-center justify-center text-neutral-600 mb-2">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-neutral-800">
                {file ? file.name : "Nhấp để chọn file CSV từ máy tính"}
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB`
                  : "Hỗ trợ định dạng .csv chuẩn UTF-8 hoặc UTF-8 BOM"}
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Báo cáo kết quả Import */}
          {importResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-neutral-100 rounded-lg">
                  <p className="text-xs text-neutral-500">Tổng số dòng</p>
                  <p className="text-base font-bold text-neutral-900">{importResult.totalRows}</p>
                </div>
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600">Dòng hợp lệ</p>
                  <p className="text-base font-bold text-blue-700">{importResult.validRows}</p>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-lg">
                  <p className="text-xs text-emerald-600">Thành công</p>
                  <p className="text-base font-bold text-emerald-700">
                    {importResult.successCount}
                  </p>
                </div>
                <div className="p-2.5 bg-rose-50 rounded-lg">
                  <p className="text-xs text-rose-600">Thất bại</p>
                  <p className="text-base font-bold text-rose-700">{importResult.errorCount}</p>
                </div>
              </div>

              {/* Bảng chi tiết lỗi */}
              {importResult.errors.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Danh sách lỗi cần khắc phục ({importResult.errors.length}):
                  </h4>
                  <div className="max-h-48 overflow-y-auto border border-neutral-200 rounded-lg divide-y divide-neutral-100 text-xs">
                    {importResult.errors.map((err, idx) => (
                      <div key={idx} className="p-2.5 hover:bg-neutral-50 flex items-start gap-2">
                        <span className="font-semibold text-neutral-700 shrink-0 bg-neutral-100 px-1.5 py-0.5 rounded-sm">
                          Dòng {err.row}
                        </span>
                        {err.sku && err.sku !== "N/A" && (
                          <span className="font-mono text-neutral-500 shrink-0">
                            [{err.sku}]
                          </span>
                        )}
                        <span className="text-rose-600 flex-1">{err.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              resetAll();
              onClose();
            }}
            disabled={isUploading}
            className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-200 rounded-lg transition cursor-pointer"
          >
            {importResult ? "Đóng" : "Hủy bỏ"}
          </button>
          {!importResult && (
            <button
              id="btn-process-import"
              type="button"
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 rounded-lg transition cursor-pointer shadow-xs"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý & lưu Supabase...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Bắt đầu nhập dữ liệu</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
