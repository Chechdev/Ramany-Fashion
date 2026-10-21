"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Eye,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ArrowRight,
  X,
  Plus,
  Minus,
  Trash2,
  Settings,
  Sparkles,
} from "lucide-react";
import { ProductItem, CartItem, getProductImages } from "@/types/product";
import { RamanyFullBadge } from "@/components/RamanyLogo";
import { ProductImageSlider } from "@/components/ProductImageSlider";

export function StorefrontClient({ initialProducts = [] }: { initialProducts?: ProductItem[] }) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(initialProducts.length === 0);

  // Bộ lọc khách hàng
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedGender, setSelectedGender] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState("");

  // Giỏ hàng
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartToast, setCartToast] = useState<string | null>(null);

  // Modal xem nhanh sản phẩm
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedQty, setSelectedQty] = useState<number>(1);

  // Mở modal xem nhanh tại chỗ
  const handleOpenQuickView = (product: ProductItem) => {
    setQuickViewProduct(product);
    setSelectedSize(product.size || "M");
    setSelectedColor(
      product.color && product.color !== "Default" ? product.color : "Đen"
    );
    setSelectedQty(1);
  };

  // Đồng bộ giỏ hàng với localStorage (lọc dữ liệu an toàn)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem("ramany_cart");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const valid = parsed.filter(
              (item) => item && item.product && item.product.id && typeof item.quantity === "number"
            );
            setCart(valid);
          }
        }
      } catch (e) {
        console.error("Lỗi đọc giỏ hàng từ localStorage:", e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ramany_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Lỗi lưu giỏ hàng:", e);
    }
  }, [cart]);

  // Modal Đặt hàng Checkout
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "cod",
  });

  // Tải danh sách sản phẩm từ Supabase (nếu chưa có từ SSR)
  useEffect(() => {
    if (initialProducts.length > 0) return;

    let isMounted = true;
    async function loadProducts() {
      try {
        const res = await fetch("/api/products?pageSize=100");
        const data = await res.json();
        if (isMounted && res.ok && data.items) {
          const activeOnly = data.items.filter((p: ProductItem) => p.status === "ACTIVE");
          setProducts(activeOnly);
        }
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [initialProducts.length]);

  // Format tiền VND
  const formatVnd = (amount: string | number | null | undefined) => {
    if (amount === null || amount === undefined || amount === "") return "0 ₫";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  // Thêm vào giỏ hàng (mặc định được tick chọn mua, kiểm tra tồn kho)
  const handleAddToCart = (product: ProductItem, size?: string, color?: string, qty: number = 1) => {
    const itemSize = size || product.size || "Free Size";
    const itemColor = color || product.color || "Tiêu chuẩn";
    const maxStock = product.stockQuantity ?? 0;

    if (maxStock <= 0) {
      alert(`Sản phẩm "${product.name}" hiện đã hết hàng trong kho!`);
      return;
    }

    let clampedNotice = false;

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.size === itemSize &&
          item.color === itemColor
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const currentQty = Math.min(updated[existingIdx].quantity, maxStock);
        const newTotal = currentQty + qty;

        if (newTotal > maxStock) {
          clampedNotice = true;
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: maxStock,
            selected: true,
          };
        } else {
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: newTotal,
            selected: true,
          };
        }
        return updated;
      }

      const actualQty = Math.min(qty, maxStock);
      return [
        ...prev,
        { product, size: itemSize, color: itemColor, quantity: actualQty, selected: true },
      ];
    });

    if (clampedNotice) {
      alert(`Trong kho chỉ còn tối đa ${maxStock} sản phẩm cho "${product.name}"! Giỏ hàng đã được điều chỉnh về số lượng tối đa.`);
    }

    setCartToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
    setTimeout(() => setCartToast(null), 3000);
  };

  // Cập nhật số lượng giỏ hàng có kiểm tra tồn kho
  const handleUpdateCartQty = (idx: number, delta: number) => {
    setCart((prev) => {
      const next = [...prev];
      const item = next[idx];
      if (!item) return prev;

      const maxStock = item.product.stockQuantity ?? 0;
      // Nếu số lượng hiện tại bị lớn hơn tồn kho (do dữ liệu cũ), lấy maxStock làm mốc
      const baseQty = item.quantity > maxStock ? maxStock : item.quantity;
      const newQty = baseQty + delta;

      if (newQty <= 0) {
        return next.filter((_, i) => i !== idx);
      }

      if (delta > 0 && newQty > maxStock) {
        alert(`Kho chỉ còn tối đa ${maxStock} sản phẩm cho "${item.product.name}"!`);
        next[idx] = { ...item, quantity: maxStock };
        return next;
      }

      next[idx] = { ...item, quantity: Math.min(newQty, maxStock) };
      return next;
    });
  };

  // Xóa khỏi giỏ
  const handleRemoveFromCart = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  // Toggle tick chọn 1 sản phẩm
  const handleToggleSelectItem = (idx: number) => {
    setCart((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], selected: !next[idx].selected };
      return next;
    });
  };

  // Toggle tick chọn tất cả
  const isAllSelected = cart.length > 0 && cart.every((item) => item.selected);
  const handleToggleSelectAll = () => {
    const targetState = !isAllSelected;
    setCart((prev) => prev.map((item) => ({ ...item, selected: targetState })));
  };

  // Tính toán số lượng & Tổng tiền theo các sản phẩm ĐÃ TICK CHỌN (luôn giới hạn bởi tồn kho, an toàn null-check)
  const validCart = useMemo(
    () => (Array.isArray(cart) ? cart.filter((item) => item && item.product && item.product.id) : []),
    [cart]
  );
  const totalCartCount = validCart.reduce(
    (sum, item) => sum + Math.min(item.quantity || 0, item.product.stockQuantity ?? item.quantity ?? 0),
    0
  );
  const selectedCartItems = useMemo(() => validCart.filter((item) => item.selected), [validCart]);
  const selectedCount = selectedCartItems.reduce(
    (sum, item) => sum + Math.min(item.quantity || 0, item.product.stockQuantity ?? item.quantity ?? 0),
    0
  );

  const cartSubtotal = selectedCartItems.reduce(
    (sum, item) =>
      sum +
      (parseFloat(String(item.product.price)) || 0) *
        Math.min(item.quantity || 0, item.product.stockQuantity ?? item.quantity ?? 0),
    0
  );
  const shippingFee = selectedCount > 0 ? (cartSubtotal >= 500000 ? 0 : 30000) : 0;
  const cartTotal = cartSubtotal + shippingFee;

  // Lọc và sắp xếp sản phẩm
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Lọc theo từ khóa
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Lọc theo danh mục
    if (selectedCategory !== "ALL") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Lọc theo đối tượng / giới tính
    if (selectedGender !== "ALL") {
      result = result.filter(
        (p) => p.gender.toLowerCase() === selectedGender.toLowerCase()
      );
    }

    // Sắp xếp
    if (sortBy === "price-asc") {
      result.sort((a, b) => parseFloat(String(a.price)) - parseFloat(String(b.price)));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => parseFloat(String(b.price)) - parseFloat(String(a.price)));
    } else if (sortBy === "popular") {
      result.sort((a, b) => b.stockQuantity - a.stockQuantity);
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedGender, sortBy]);

  // Xử lý hoàn tất đặt hàng
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ giao hàng!");
      return;
    }
    setOrderSuccess(true);
    // Xóa các sản phẩm đã tick chọn mua khỏi giỏ hàng, giữ lại những sản phẩm chưa tick
    setCart((prev) => prev.filter((item) => !item.selected));
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-neutral-950 text-neutral-300 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-between border-b border-neutral-800">
        <div className="hidden sm:block text-neutral-400">
          Hotline hỗ trợ: <strong className="text-white">1800 6868</strong> (8h - 22h)
        </div>
        <div className="flex-1 sm:flex-initial flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>
            Ưu đãi tháng này: <strong>MIỄN PHÍ VẬN CHUYỂN</strong> cho đơn từ 500.000₫
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded-md transition text-xs font-semibold cursor-pointer border border-neutral-700"
          >
            <Settings className="w-3 h-3 text-amber-400" />
            <span>Kênh Quản Trị</span>
          </Link>
        </div>
      </div>

      {/* 2. NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <RamanyFullBadge size={46} theme="dark" />
              <div className="flex flex-col">
                <span className="font-serif font-black text-2xl tracking-[0.18em] text-neutral-950 uppercase">
                  RAMANY
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-neutral-500 -mt-1">
                  Minimal Luxury
                </span>
              </div>
            </Link>

            {/* Thanh tìm kiếm trên Header */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm áo thun, sơ mi, đầm váy, jeans..."
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border border-transparent rounded-full text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Menu & Giỏ hàng */}
            <div className="flex items-center gap-3">
              {/* Nút Xem Quản Trị Kho */}
              <Link
                href="/admin"
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Quản lý sản phẩm</span>
              </Link>

              {/* Nút Giỏ Hàng */}
              <button
                id="btn-cart"
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex items-center justify-center p-2.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition shadow-sm cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-scale">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="border-t border-neutral-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-6 overflow-x-auto py-2.5 text-xs font-semibold scrollbar-none">
              <button
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSelectedGender("ALL");
                }}
                className={`whitespace-nowrap transition cursor-pointer pb-1 ${
                  selectedCategory === "ALL" && selectedGender === "ALL"
                    ? "text-neutral-950 border-b-2 border-neutral-950 font-bold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                TẤT CẢ SẢN PHẨM
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("Áo thun");
                  setSelectedGender("ALL");
                }}
                className={`whitespace-nowrap transition cursor-pointer pb-1 ${
                  selectedCategory === "Áo thun"
                    ? "text-neutral-950 border-b-2 border-neutral-950 font-bold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                ÁO THUN
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("Áo sơ mi");
                  setSelectedGender("ALL");
                }}
                className={`whitespace-nowrap transition cursor-pointer pb-1 ${
                  selectedCategory === "Áo sơ mi"
                    ? "text-neutral-950 border-b-2 border-neutral-950 font-bold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                ÁO SƠ MI
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("Quần jeans");
                  setSelectedGender("ALL");
                }}
                className={`whitespace-nowrap transition cursor-pointer pb-1 ${
                  selectedCategory === "Quần jeans"
                    ? "text-neutral-950 border-b-2 border-neutral-950 font-bold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                QUẦN JEANS
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("Đầm & Váy");
                  setSelectedGender("ALL");
                }}
                className={`whitespace-nowrap transition cursor-pointer pb-1 ${
                  selectedCategory === "Đầm & Váy"
                    ? "text-neutral-950 border-b-2 border-neutral-950 font-bold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                ĐẦM & VÁY
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("Áo khoác");
                  setSelectedGender("ALL");
                }}
                className={`whitespace-nowrap transition cursor-pointer pb-1 ${
                  selectedCategory === "Áo khoác"
                    ? "text-neutral-950 border-b-2 border-neutral-950 font-bold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                ÁO KHOÁC BIKER
              </button>
              <button
                onClick={() => setSelectedGender("Men")}
                className={`whitespace-nowrap transition cursor-pointer pb-1 ${
                  selectedGender === "Men"
                    ? "text-neutral-950 border-b-2 border-neutral-950 font-bold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                THỜI TRANG NAM
              </button>
              <button
                onClick={() => setSelectedGender("Women")}
                className={`whitespace-nowrap transition cursor-pointer pb-1 ${
                  selectedGender === "Women"
                    ? "text-neutral-950 border-b-2 border-neutral-950 font-bold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                THỜI TRANG NỮ
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. HERO BANNER SANG TRỌNG */}
      <section className="relative bg-neutral-900 text-white overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
            alt="Hero Fashion"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bộ Sưu Tập Mới 2026</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase">
              Tối giản chuẩn mực. <br />
              <span className="text-neutral-400 font-light italic">Phong cách tự tại.</span>
            </h1>
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              RAMANY mang đến những thiết kế thời trang hiện đại từ chất liệu cotton dệt thoi tự nhiên, form dáng chuẩn mực cho mọi khoảnh khắc hàng ngày.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#san-pham"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-neutral-950 font-bold text-sm hover:bg-neutral-100 transition shadow-lg cursor-pointer"
              >
                <span>Khám phá ngay</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-neutral-800/80 hover:bg-neutral-800 text-white font-medium text-sm backdrop-blur-md border border-neutral-700 transition cursor-pointer"
              >
                <Settings className="w-4 h-4 text-amber-400" />
                <span>Xem kho Supabase</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUST BADGES */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-neutral-100 text-neutral-900 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">Giao hàng hỏa tốc</p>
                <p className="text-[11px] text-neutral-500">Miễn phí ship đơn từ 500k</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-neutral-100 text-neutral-900 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">100% Chất lượng cao</p>
                <p className="text-[11px] text-neutral-500">Cotton tự nhiên thoáng mát</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-neutral-100 text-neutral-900 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">Đổi trả 30 ngày</p>
                <p className="text-[11px] text-neutral-500">Thủ tục nhanh gọn, miễn phí</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-neutral-100 text-neutral-900 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">Hỗ trợ 24/7</p>
                <p className="text-[11px] text-neutral-500">Tư vấn size tận tình</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DANH SÁCH SẢN PHẨM (MAIN STORE CONTENT) */}
      <main id="san-pham" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Bộ lọc và Tiêu đề khu vực */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Cửa Hàng Trực Tuyến
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {filteredProducts.length} sản phẩm
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mt-1">
              {selectedCategory === "ALL" ? "Sản Phẩm Thời Trang Nổi Bật" : selectedCategory}
            </h2>
          </div>

          {/* Sắp xếp & Lọc đối tượng */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 bg-white border border-neutral-200 rounded-lg px-3 py-2 shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              <span>Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-neutral-900 focus:outline-hidden cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="popular">Phổ biến</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lưới sản phẩm */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="w-full aspect-3/4 bg-neutral-200 rounded-xl" />
                <div className="h-4 bg-neutral-200 rounded-md w-3/4" />
                <div className="h-4 bg-neutral-200 rounded-md w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200">
            <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-800">Không tìm thấy sản phẩm nào</h3>
            <p className="text-sm text-neutral-400 mt-1 max-w-sm mx-auto">
              Thử xóa từ khóa tìm kiếm hoặc chọn danh mục khác.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setSelectedGender("ALL");
              }}
              className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition cursor-pointer"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stockQuantity <= 0;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all flex flex-col"
                >
                  {/* Khung ảnh sản phẩm - Bấm vào ảnh chuyển đến màn hình chi tiết mới */}
                  <Link
                    href={`/products/${product.id}`}
                    className="relative w-full aspect-3/4 bg-neutral-100 overflow-hidden cursor-pointer group/img block"
                    title={`Xem chi tiết sản phẩm: ${product.name}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        getProductImages(product)[0] ||
                        product.imageUrl ||
                        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Badges góc trên */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-rose-600 text-white tracking-wider">
                          Hết hàng
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-neutral-900/80 backdrop-blur-xs text-white tracking-wider">
                          {product.category}
                        </span>
                      )}
                    </div>

                    {/* Huy hiệu số lượng ảnh minh họa góc trên phải */}
                    {getProductImages(product).length > 1 && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-sm text-[10px] font-bold bg-neutral-900/80 backdrop-blur-xs text-white tracking-wider flex items-center gap-1 shadow-xs pointer-events-none">
                        <span>{getProductImages(product).length} ảnh</span>
                      </div>
                    )}

                    {/* Nút Xem nhanh khi hover - Giữ nguyên modal xem nhanh tại chỗ */}
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOpenQuickView(product);
                        }}
                        className="flex-1 py-2 rounded-lg bg-white/95 hover:bg-white text-neutral-900 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem nhanh</span>
                      </button>
                    </div>
                  </Link>

                  {/* Thông tin sản phẩm */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                        <span>{product.gender}</span>
                        <span className="font-mono">{product.sku}</span>
                      </div>
                      <Link
                        href={`/products/${product.id}`}
                        className="font-bold text-neutral-900 text-sm line-clamp-2 hover:text-neutral-600 cursor-pointer transition leading-snug block"
                        title={product.name}
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                        <span>Size: <strong>{product.size}</strong></span>
                        <span>•</span>
                        <span>Màu: <strong>{product.color}</strong></span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-neutral-400 block -mb-1">Giá bán</span>
                        <span className="font-extrabold text-base text-neutral-950">
                          {formatVnd(product.price)}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className={`p-2 rounded-lg font-medium text-xs transition flex items-center gap-1 cursor-pointer ${
                          isOutOfStock
                            ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                            : "bg-neutral-950 text-white hover:bg-neutral-800"
                        }`}
                        title={isOutOfStock ? "Sản phẩm tạm hết hàng" : "Thêm vào giỏ hàng"}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 6. BANNER LOOKBOOK KHUYẾN MÃI */}
      <section className="bg-neutral-900 text-white py-16 my-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              Đẳng Cấp Chất Liệu Tự Nhiên
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Thời trang tối giản, mặc đẹp mỗi ngày cùng RAMANY.
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Mỗi sản phẩm đều được kiểm định chặt chẽ từ đường may, độ co giãn sợi vải và độ bền màu sau nhiều lần giặt.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#san-pham"
              className="px-6 py-3 rounded-full bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-100 transition shadow-lg cursor-pointer"
            >
              Xem ngay bộ sưu tập
            </a>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-white border-t border-neutral-200 text-neutral-600 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-100">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <RamanyFullBadge size={40} theme="dark" />
                <div className="flex flex-col">
                  <span className="font-serif font-black text-lg tracking-[0.18em] text-neutral-950 uppercase">
                    RAMANY
                  </span>
                  <span className="text-[9px] uppercase font-semibold tracking-[0.25em] text-neutral-400 -mt-0.5">
                    Minimal Luxury
                  </span>
                </div>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Thương hiệu thời trang tối giản hướng đến sự thoải mái, lịch sự và chất lượng bền bỉ theo thời gian.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">
                Danh mục nổi bật
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => setSelectedCategory("Áo thun")} className="hover:text-neutral-950 cursor-pointer">Áo thun Cotton</button></li>
                <li><button onClick={() => setSelectedCategory("Áo sơ mi")} className="hover:text-neutral-950 cursor-pointer">Áo sơ mi Oxford & Linen</button></li>
                <li><button onClick={() => setSelectedCategory("Quần jeans")} className="hover:text-neutral-950 cursor-pointer">Quần Jeans Slim-fit</button></li>
                <li><button onClick={() => setSelectedCategory("Đầm & Váy")} className="hover:text-neutral-950 cursor-pointer">Đầm & Váy thiết kế</button></li>
                <li><button onClick={() => setSelectedCategory("Áo khoác")} className="hover:text-neutral-950 cursor-pointer">Áo khoác da Biker</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">
                Hỗ trợ khách hàng
              </h4>
              <ul className="space-y-2">
                <li><span className="hover:text-neutral-950 cursor-pointer">Chính sách đổi trả 30 ngày</span></li>
                <li><span className="hover:text-neutral-950 cursor-pointer">Hướng dẫn chọn size</span></li>
                <li><span className="hover:text-neutral-950 cursor-pointer">Chính sách giao nhận</span></li>
                <li><span className="hover:text-neutral-950 cursor-pointer">Phương thức thanh toán COD</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">
                Hệ thống & Cơ sở dữ liệu
              </h4>
              <p className="text-neutral-500 mb-2">
                Dữ liệu đồng bộ trực tiếp từ <strong>Supabase PostgreSQL</strong> qua <strong>Prisma ORM</strong>.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                <span>Truy cập trang Quản Trị</span>
              </Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-neutral-400 gap-2">
            <p>RAMANY &copy; 2026. Tất cả các quyền được bảo lưu.</p>
            <p>Xây dựng với Next.js 16 + React 19 + Supabase + Tailwind CSS.</p>
          </div>
        </div>
      </footer>

      {/* 8. MODAL XEM NHANH CHI TIẾT SẢN PHẨM */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="relative">
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* Ảnh có slider lướt trái / phải */}
                <div className="p-4 sm:p-6 bg-neutral-50/70 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-neutral-100">
                  <ProductImageSlider
                    images={getProductImages(quickViewProduct)}
                    productName={quickViewProduct.name}
                    aspectRatio="aspect-square"
                    showThumbnails={true}
                  />
                </div>

                {/* Chi tiết chọn size, màu, mua hàng */}
                <div className="p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-neutral-100 text-neutral-700 uppercase">
                        {quickViewProduct.category}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">
                        {quickViewProduct.sku}
                      </span>
                    </div>

                    <h2 className="text-lg font-extrabold text-neutral-900 leading-snug">
                      {quickViewProduct.name}
                    </h2>

                    <div className="mt-2 text-xl font-black text-neutral-950">
                      {formatVnd(quickViewProduct.price)}
                    </div>

                    <p className="mt-3 text-xs text-neutral-600 leading-relaxed">
                      {quickViewProduct.description ||
                        "Chất liệu cao cấp, đường may tỉ mỉ, form dáng hiện đại phù hợp mọi hoàn cảnh."}
                    </p>

                    {/* Size & Màu */}
                    <div className="mt-4 space-y-3 pt-3 border-t border-neutral-100 text-xs">
                      <div>
                        <span className="font-semibold text-neutral-700 block mb-1">
                          Kích cỡ: <strong className="text-neutral-900">{selectedSize}</strong>
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            const qvSizes = ["28", "29", "30", "31", "32"].includes(quickViewProduct.size)
                              ? ["28", "29", "30", "31", "32"]
                              : ["S", "M", "L", "XL", "Free Size"];
                            return qvSizes.map((sz) => (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => setSelectedSize(sz)}
                                className={`px-3 py-1.5 rounded-md border text-xs font-semibold transition cursor-pointer ${
                                  selectedSize === sz
                                    ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                                    : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                                }`}
                              >
                                {sz}
                              </button>
                            ));
                          })()}
                        </div>
                      </div>

                      <div>
                        <span className="font-semibold text-neutral-700 block mb-1">
                          Màu sắc: <strong className="text-neutral-900">{selectedColor}</strong>
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            const baseColor =
                              quickViewProduct.color && quickViewProduct.color !== "Default"
                                ? quickViewProduct.color
                                : "Tiêu chuẩn";
                            const qvColors = Array.from(
                              new Set([baseColor, "Đen", "Trắng", "Xanh navy", "Be"].filter(Boolean))
                            );
                            return qvColors.map((cl) => (
                              <button
                                key={cl}
                                type="button"
                                onClick={() => setSelectedColor(cl)}
                                className={`px-3 py-1 rounded-md border text-xs font-semibold transition cursor-pointer ${
                                  selectedColor === cl
                                    ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                                    : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                                }`}
                              >
                                {cl}
                              </button>
                            ));
                          })()}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-neutral-700 block">
                            Số lượng:
                          </span>
                          <span className={`text-[11px] font-medium ${
                            quickViewProduct.stockQuantity <= 5 ? "text-amber-600 font-semibold" : "text-neutral-500"
                          }`}>
                            Kho còn: <strong>{quickViewProduct.stockQuantity}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                              className="p-1.5 hover:bg-neutral-100 transition cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 font-bold text-xs">{selectedQty}</span>
                            <button
                              disabled={selectedQty >= quickViewProduct.stockQuantity}
                              onClick={() => setSelectedQty((q) => Math.min(quickViewProduct.stockQuantity, q + 1))}
                              className="p-1.5 hover:bg-neutral-100 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              title={selectedQty >= quickViewProduct.stockQuantity ? "Đã đạt số lượng tồn kho tối đa" : "Tăng số lượng"}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {selectedQty >= quickViewProduct.stockQuantity && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                              Đã chọn tối đa số lượng có trong kho
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nút thêm vào giỏ */}
                  <div className="pt-3 border-t border-neutral-100 flex gap-2">
                    <button
                      disabled={quickViewProduct.stockQuantity <= 0}
                      onClick={() => {
                        handleAddToCart(
                          quickViewProduct,
                          selectedSize,
                          selectedColor,
                          selectedQty
                        );
                        setQuickViewProduct(null);
                        setIsCartOpen(true);
                      }}
                      className="flex-1 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Thêm vào giỏ hàng</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. GIỎ HÀNG SLIDE-OVER DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header Drawer */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-neutral-900" />
                <h3 className="font-extrabold text-neutral-900 text-base">
                  Giỏ hàng của bạn ({totalCartCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thanh Chọn Tất Cả */}
            {cart.length > 0 && (
              <div className="px-4 py-2.5 bg-neutral-100/80 border-b border-neutral-200 flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800 select-none">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded text-neutral-900 border-neutral-300 focus:ring-neutral-900 cursor-pointer accent-neutral-900 shrink-0"
                  />
                  <span>Chọn tất cả ({cart.length})</span>
                </label>
                <span className="text-[11px] text-neutral-500">
                  Đã chọn: <strong className="text-neutral-950 font-bold">{selectedCartItems.length}</strong> món
                </span>
              </div>
            )}

            {/* Nội dung danh sách món */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="py-20 text-center">
                  <ShoppingBag className="w-12 h-12 text-neutral-200 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-neutral-600">Giỏ hàng đang trống</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Hãy lựa chọn những bộ quần áo ưng ý bạn nhé!
                  </p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all flex gap-3 items-center ${
                      item.selected
                        ? "bg-white border-neutral-300 shadow-2xs"
                        : "bg-neutral-50/70 border-neutral-200 opacity-60"
                    }`}
                  >
                    {/* Checkbox chọn mua từng món */}
                    <div className="shrink-0 flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleToggleSelectItem(idx)}
                        className="w-4 h-4 rounded text-neutral-900 border-neutral-300 focus:ring-neutral-900 cursor-pointer accent-neutral-900"
                        title={item.selected ? "Bỏ chọn món này" : "Tick chọn mua món này"}
                      />
                    </div>

                    <div className="w-16 h-20 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          getProductImages(item.product)[0] ||
                          item.product.imageUrl ||
                          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500"
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-neutral-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        Size: {item.size} | Màu: {item.color}
                      </p>
                      <p className="font-extrabold text-sm text-neutral-950 mt-1">
                        {formatVnd(item.product.price)}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1">
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center border border-neutral-200 rounded-md overflow-hidden bg-neutral-50 text-xs">
                            <button
                              onClick={() => handleUpdateCartQty(idx, -1)}
                              className="px-2 py-0.5 hover:bg-neutral-200 cursor-pointer"
                              title="Giảm số lượng"
                            >
                              -
                            </button>
                            <span className="px-2 font-bold min-w-5 text-center">
                              {Math.min(item.quantity, item.product.stockQuantity ?? item.quantity)}
                            </span>
                            <button
                              disabled={item.quantity >= item.product.stockQuantity}
                              onClick={() => handleUpdateCartQty(idx, 1)}
                              className={`px-2 py-0.5 transition ${
                                item.quantity >= item.product.stockQuantity
                                  ? "text-neutral-300 bg-neutral-100 cursor-not-allowed"
                                  : "hover:bg-neutral-200 cursor-pointer"
                              }`}
                              title={
                                item.quantity >= item.product.stockQuantity
                                  ? `Kho chỉ còn tối đa ${item.product.stockQuantity} sản phẩm`
                                  : "Tăng số lượng"
                              }
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveFromCart(idx)}
                            className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer transition"
                            title="Xóa món"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Thông tin cảnh báo tồn kho */}
                        <span
                          className={`text-[10px] font-medium ${
                            item.quantity >= item.product.stockQuantity
                              ? "text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-semibold"
                              : "text-neutral-400"
                          }`}
                        >
                          {item.quantity >= item.product.stockQuantity
                            ? `Tối đa (${item.product.stockQuantity})`
                            : `Kho: ${item.product.stockQuantity}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer giỏ hàng */}
            {cart.length > 0 && (
              <div className="p-4 bg-neutral-50 border-t border-neutral-200 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Tạm tính ({selectedCount} món đã chọn)</span>
                    <span className="font-semibold text-neutral-900">{formatVnd(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Phí vận chuyển</span>
                    <span>
                      {selectedCount === 0
                        ? "—"
                        : shippingFee === 0
                        ? "Miễn phí"
                        : formatVnd(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-neutral-950 pt-2 border-t border-neutral-200">
                    <span>Tổng thanh toán</span>
                    <span className="text-rose-600">{formatVnd(cartTotal)}</span>
                  </div>
                </div>

                <button
                  disabled={selectedCount === 0}
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md text-center block ${
                    selectedCount > 0
                      ? "bg-neutral-950 hover:bg-neutral-800 text-white cursor-pointer active:scale-98"
                      : "bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  {selectedCount > 0
                    ? `Tiến hành đặt hàng (${selectedCount})`
                    : "Vui lòng chọn sản phẩm"}
                </button>

                {selectedCount === 0 && (
                  <p className="text-[11px] text-center text-amber-700 font-medium bg-amber-50 py-1.5 px-2 rounded-lg border border-amber-200">
                    💡 Hãy tick vào ô vuông của sản phẩm bạn muốn mua
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 10. MODAL CHECKOUT ĐẶT HÀNG NHANH */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <h3 className="font-extrabold text-neutral-900 text-base">
                {orderSuccess ? "Đặt Hàng Thành Công!" : "Thông Tin Giao Hàng & Đặt Hàng"}
              </h3>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setOrderSuccess(false);
                }}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-neutral-900">Cảm ơn bạn đã mua sắm!</h4>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  Đơn hàng của bạn đã được ghi nhận. Nhân viên CSKH của <strong>RAMANY</strong> sẽ gọi điện xác nhận trong ít phút để gửi hàng nhanh nhất cho bạn.
                </p>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setOrderSuccess(false);
                  }}
                  className="px-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
                {/* Tóm tắt các sản phẩm đã tick chọn */}
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-neutral-800 pb-1.5 border-b border-neutral-200">
                    <span>Sản phẩm chọn mua ({selectedCount}):</span>
                    <span className="text-rose-600 font-extrabold">{formatVnd(cartTotal)}</span>
                  </div>
                  <div className="max-h-24 overflow-y-auto space-y-1 text-neutral-600">
                    {selectedCartItems.map((item, i) => {
                      const actualItemQty = Math.min(item.quantity, item.product.stockQuantity ?? item.quantity);
                      return (
                        <div key={i} className="flex justify-between text-[11px]">
                          <span className="truncate max-w-[240px]">
                            {item.product.name} ({item.size}) x{actualItemQty}
                          </span>
                          <span className="font-semibold text-neutral-900 shrink-0">
                            {formatVnd((parseFloat(String(item.product.price)) || 0) * actualItemQty)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Họ và tên người nhận <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Số điện thoại nhận hàng <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Địa chỉ nhận hàng (Số nhà, đường, phường/xã, quận/huyện) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    placeholder="Số 123 Đường ABC, Phường X, Quận Y, TP. HCM"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Ghi chú đơn hàng (nếu có)
                  </label>
                  <input
                    type="text"
                    value={customerInfo.note}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
                    placeholder="Giao giờ hành chính, gọi trước khi đến..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div className="pt-2">
                  <span className="block text-xs font-semibold text-neutral-700 mb-1">
                    Hình thức thanh toán:
                  </span>
                  <div className="p-3 rounded-lg border border-neutral-300 bg-neutral-50 text-xs flex items-center justify-between">
                    <span className="font-semibold text-neutral-900">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Được kiểm tra hàng
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer shadow-md transition"
                  >
                    Xác nhận đặt hàng ngay
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 11. TOAST THÔNG BÁO THÊM GIỎ */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl bg-neutral-900 text-white border border-neutral-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-150">
          <div className="p-1 rounded-full bg-emerald-500 text-white">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold">{cartToast}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 text-xs font-bold text-amber-300 hover:underline cursor-pointer"
          >
            Xem giỏ
          </button>
        </div>
      )}
    </div>
  );
}
