"use client";

import React from "react";
import { Package, CheckCircle2, AlertTriangle, Layers } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;
    totalStockQuantity: number;
  };
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading = false }: StatsCardsProps) {
  const cards = [
    {
      title: "Tổng số sản phẩm",
      value: stats.totalProducts.toLocaleString("vi-VN"),
      icon: Package,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      description: "Tất cả SKU trong hệ thống",
    },
    {
      title: "Sản phẩm hoạt động",
      value: stats.activeProducts.toLocaleString("vi-VN"),
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      description: "Đang mở bán công khai",
    },
    {
      title: "Sản phẩm hết hàng",
      value: stats.outOfStockProducts.toLocaleString("vi-VN"),
      icon: AlertTriangle,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      description: "Tồn kho bằng 0",
    },
    {
      title: "Tổng số lượng tồn kho",
      value: stats.totalStockQuantity.toLocaleString("vi-VN"),
      icon: Layers,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      description: "Tổng đơn vị sản phẩm trong kho",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs hover:border-neutral-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-500">{card.title}</span>
              <div className={`p-2 rounded-lg border ${card.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              {isLoading ? (
                <div className="h-8 w-24 bg-neutral-200 animate-pulse rounded-md" />
              ) : (
                <div className="text-2xl font-bold text-neutral-900 tracking-tight">
                  {card.value}
                </div>
              )}
              <p className="mt-1 text-xs text-neutral-400">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
