"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Check,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  X,
  CreditCard,
  Phone,
  MapPin,
  FileText,
  User,
  Settings,
  Layers,
  Ruler,
} from "lucide-react";
import { ProductItem, CartItem, getProductImages } from "@/types/product";
import { RamanyFullBadge } from "@/components/RamanyLogo";
import { ProductImageSlider } from "@/components/ProductImageSlider";
import { useLanguage } from "@/lib/i18n";
import { LanguageButton } from "@/components/LanguageSettingsModal";

interface ProductDetailClientProps {
  product: ProductItem;
  relatedProducts: ProductItem[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { t, lang } = useLanguage();
  // Lựa chọn mua hàng
  const [selectedSize, setSelectedSize] = useState<string>(product.size || "M");
  const [selectedColor, setSelectedColor] = useState<string>(
    product.color && product.color !== "Default" ? product.color : "Đen"
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isCopied, setIsCopied] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "material" | "care">("desc");

  // Giỏ hàng với localStorage
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartToast, setCartToast] = useState<string | null>(null);

  // Checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "cod",
  });

  // Tải giỏ hàng từ localStorage khi mount (lọc bỏ dữ liệu lỗi nếu có)
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

  // Lưu giỏ hàng vào localStorage khi thay đổi
  useEffect(() => {
    try {
      localStorage.setItem("ramany_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Lỗi lưu giỏ hàng:", e);
    }
  }, [cart]);

  // Format tiền VND
  const formatVnd = (amount: string | number | null | undefined) => {
    if (amount === null || amount === undefined || amount === "") return "0 ₫";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  // Sao chép mã SKU
  const handleCopySku = () => {
    if (!product?.sku) return;
    navigator.clipboard.writeText(product.sku);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Chia sẻ sản phẩm
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || "RAMANY Fashion",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCartToast("Đã sao chép liên kết sản phẩm vào bộ nhớ đệm!");
      setTimeout(() => setCartToast(null), 3000);
    }
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = (productToAdd: ProductItem, size?: string, color?: string, qty: number = 1, openDrawer: boolean = true) => {
    const itemSize = size || productToAdd.size || "Free Size";
    const itemColor = color || productToAdd.color || "Default";
    const maxStock = productToAdd.stockQuantity ?? 0;

    if (maxStock <= 0) {
      alert(`Sản phẩm "${productToAdd.name}" hiện đã hết hàng trong kho!`);
      return false;
    }

    let clampedNotice = false;

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === productToAdd.id &&
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
        { product: productToAdd, size: itemSize, color: itemColor, quantity: actualQty, selected: true },
      ];
    });

    if (clampedNotice) {
      alert(`Trong kho chỉ còn tối đa ${maxStock} sản phẩm cho "${productToAdd.name}". Giỏ hàng đã điều chỉnh về mức tối đa.`);
    }

    setCartToast(`Đã thêm "${productToAdd.name}" vào giỏ hàng!`);
    setTimeout(() => setCartToast(null), 3000);

    if (openDrawer) {
      setIsCartOpen(true);
    }

    return true;
  };

  // Mua ngay (Thêm vào giỏ và mở Checkout)
  const handleBuyNow = () => {
    const ok = handleAddToCart(product, selectedSize, selectedColor, quantity, false);
    if (ok) {
      setIsCheckoutOpen(true);
    }
  };

  // Cập nhật số lượng giỏ hàng
  const handleUpdateCartQty = (idx: number, delta: number) => {
    setCart((prev) => {
      const next = [...prev];
      const item = next[idx];
      if (!item) return prev;

      const maxStock = item.product.stockQuantity ?? 0;
      const baseQty = item.quantity > maxStock ? maxStock : item.quantity;
      const newQty = baseQty + delta;

      if (newQty <= 0) {
        return next.filter((_, i) => i !== idx);
      }
      if (newQty > maxStock) {
        alert(`Trong kho chỉ còn tối đa ${maxStock} sản phẩm.`);
        next[idx] = { ...item, quantity: maxStock };
        return next;
      }
      next[idx] = { ...item, quantity: newQty };
      return next;
    });
  };

  // Xóa khỏi giỏ hàng
  const handleRemoveFromCart = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  // Toggle chọn sản phẩm trong giỏ
  const handleToggleSelectItem = (idx: number) => {
    setCart((prev) => {
      const next = [...prev];
      if (next[idx]) {
        next[idx] = { ...next[idx], selected: !next[idx].selected };
      }
      return next;
    });
  };

  // Chọn tất cả giỏ hàng
  const isAllSelected = cart.length > 0 && cart.every((item) => item.selected);
  const handleToggleSelectAll = () => {
    const nextState = !isAllSelected;
    setCart((prev) => prev.map((item) => ({ ...item, selected: nextState })));
  };

  // Tính toán giỏ hàng an toàn
  const validCart = Array.isArray(cart) ? cart.filter((item) => item && item.product) : [];
  const totalCartCount = validCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const selectedCartItems = validCart.filter((item) => item.selected);
  const selectedCount = selectedCartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartSubtotal = selectedCartItems.reduce(
    (sum, item) => sum + (parseFloat(String(item.product?.price || 0)) || 0) * (item.quantity || 0),
    0
  );
  const shippingFee = cartSubtotal >= 500000 || cartSubtotal === 0 ? 0 : 30000;
  const cartTotal = cartSubtotal + shippingFee;

  // Xử lý gửi đơn hàng
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name.trim() || !customerInfo.phone.trim() || !customerInfo.address.trim()) {
      alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!");
      return;
    }
    setOrderSuccess(true);
    setCart((prev) => prev.filter((item) => !item.selected));
  };

  const isOutOfStock = (product.stockQuantity ?? 0) <= 0;
  const productImages = getProductImages(product);

  // Danh sách size đầy đủ để khách bấm lựa chọn
  const availableSizes = (() => {
    if (["28", "29", "30", "31", "32"].includes(product.size)) {
      return ["28", "29", "30", "31", "32"];
    }
    const standardSizes = ["S", "M", "L", "XL", "Free Size"];
    if (product.size && !standardSizes.includes(product.size)) {
      return [product.size, ...standardSizes];
    }
    return standardSizes;
  })();

  // Danh sách màu sắc thực tế để khách bấm lựa chọn
  const availableColors = (() => {
    const baseColor = product.color && product.color !== "Default" ? product.color : "Tiêu chuẩn";
    const defaults = [baseColor, "Đen", "Trắng", "Xanh navy", "Be"];
    return Array.from(new Set(defaults.filter(Boolean)));
  })();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* 1. THANH THÔNG BÁO THƯƠNG HIỆU */}
      <div className="bg-neutral-950 text-white text-[11px] py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wider uppercase text-neutral-300">
              RAMANY OFFICIAL STORE
            </span>
            <span className="hidden sm:inline text-neutral-500">•</span>
            <span className="hidden sm:inline text-neutral-300">
              Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500.000₫
            </span>
          </div>
          <div className="flex items-center gap-4 text-neutral-300">
            <span>Hotline CSKH: 1900 6868</span>
            <span>•</span>
            <span className="hidden sm:inline">Hỗ trợ 24/7</span>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR CHÍNH */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Nút về cửa hàng */}
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 group cursor-pointer"
              title="Về trang chủ RAMANY"
            >
              <RamanyFullBadge size={36} theme="dark" />
            </Link>

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t("backToCategory")}</span>
            </Link>
          </div>

          {/* Tiện ích bên phải */}
          <div className="flex items-center gap-3">
            <LanguageButton variant="light" />

            {/* Nút chia sẻ */}
            <button
              onClick={handleShare}
              className="p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition cursor-pointer"
              title="Chia sẻ sản phẩm"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Nút Giỏ hàng */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">{t("cart")}</span>
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                  {totalCartCount > 99 ? "99+" : totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. BREADCRUMBS ĐIỀU HƯỚNG */}
      <div className="bg-neutral-100/70 border-b border-neutral-200/60 py-2.5 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-neutral-900 font-medium transition">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <Link href={`/?category=${encodeURIComponent(product.category)}`} className="hover:text-neutral-900 font-medium transition">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="text-neutral-900 font-bold truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </div>
      </div>

      {/* 4. MAIN PRODUCT HERO DETAIL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* CỘT TRÁI (6/12): BỘ SƯU TẬP HÌNH ẢNH MINH HỌA */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm">
              <ProductImageSlider
                images={productImages}
                productName={product.name}
                aspectRatio="aspect-square"
                showThumbnails={true}
              />
            </div>

            {/* Dải ảnh minh họa thu nhỏ nếu có nhiều ảnh */}
            {productImages.length > 1 && (
              <div className="bg-white rounded-xl border border-neutral-200 p-3.5 flex items-center justify-between text-xs text-neutral-500 shadow-2xs">
                <span className="flex items-center gap-1.5 font-medium">
                  <Layers className="w-4 h-4 text-neutral-700" />
                  Sản phẩm có <strong>{productImages.length} góc chụp minh họa</strong>
                </span>
                <span className="text-[11px] text-neutral-400">
                  Dùng mũi tên &lt; &gt; hoặc bấm ảnh nhỏ để chuyển góc
                </span>
              </div>
            )}
          </div>

          {/* CỘT PHẢI (6/12): THÔNG TIN CHI TIẾT & ĐẶT MUA */}
          <div className="lg:col-span-6 space-y-6">
            {/* Huy hiệu thương hiệu & Danh mục */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-neutral-900 text-white text-[10px]">
                  {product.category}
                </span>
                <span className="px-2.5 py-1 rounded-full font-semibold bg-neutral-100 text-neutral-700 text-[11px]">
                  {product.gender}
                </span>
                <span
                  onClick={handleCopySku}
                  className="font-mono text-neutral-500 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-md transition cursor-pointer inline-flex items-center gap-1"
                  title="Nhấn để sao chép mã SKU"
                >
                  SKU: {product.sku}
                  {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : null}
                </span>
              </div>

              {/* Tên sản phẩm */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Tình trạng tồn kho */}
              <div className="flex items-center gap-2 pt-1">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                    Tạm hết hàng
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    Còn hàng ({product.stockQuantity} sản phẩm sẵn sàng giao)
                  </span>
                )}
              </div>
            </div>

            {/* Khung Giá bán */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-1">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block">
                Giá niêm yết chính hãng
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-neutral-950">
                  {formatVnd(product.price)}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Đã bao gồm VAT
                </span>
              </div>
            </div>

            {/* Bộ chọn Kích cỡ & Màu sắc */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-5">
              {/* Chọn kích cỡ */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Kích cỡ: <strong className="text-neutral-950 normal-case">{selectedSize}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 inline-flex items-center gap-1 transition cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Bảng hướng dẫn chọn size</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {availableSizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-12 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          isSelected
                            ? "bg-neutral-950 text-white border-neutral-950 shadow-xs"
                            : "bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chọn màu sắc */}
              <div>
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block mb-2">
                  Màu sắc: <strong className="text-neutral-950 normal-case">{selectedColor}</strong>
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {availableColors.map((cl) => {
                    const isSelected = selectedColor === cl;
                    return (
                      <button
                        key={cl}
                        type="button"
                        onClick={() => setSelectedColor(cl)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          isSelected
                            ? "bg-neutral-950 text-white border-neutral-950 shadow-xs"
                            : "bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        {cl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chọn số lượng */}
              <div>
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block mb-2">
                  Số lượng:
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => {
                        if (quantity > 1) {
                          setQuantity((q) => q - 1);
                        }
                      }}
                      className={`p-2.5 text-neutral-600 transition cursor-pointer ${
                        quantity <= 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-neutral-100"
                      }`}
                      title={quantity <= 1 ? "Số lượng tối thiểu là 1" : "Giảm số lượng"}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-neutral-900 select-none">
                      {isOutOfStock ? 0 : quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const max = product.stockQuantity ?? 99;
                        if (quantity < max) {
                          setQuantity((q) => q + 1);
                        } else {
                          alert(`Kho chỉ còn tối đa ${max} sản phẩm!`);
                        }
                      }}
                      className="p-2.5 text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
                      title="Tăng số lượng"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-neutral-500">
                    Kho: <strong className="text-neutral-900">{product.stockQuantity}</strong> sản phẩm
                  </span>
                </div>
              </div>

              {/* Nút Đặt mua & Thêm giỏ hàng */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (isOutOfStock) {
                      alert(`Sản phẩm "${product.name}" hiện đang tạm hết hàng trong kho!`);
                      return;
                    }
                    handleAddToCart(product, selectedSize, selectedColor, quantity, true);
                  }}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                    isOutOfStock
                      ? "bg-neutral-100 text-neutral-400 border border-neutral-300 cursor-not-allowed"
                      : "bg-white text-neutral-950 border-2 border-neutral-950 hover:bg-neutral-50 active:scale-98"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? "Tạm hết hàng" : "Thêm vào giỏ hàng"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (isOutOfStock) {
                      alert(`Sản phẩm "${product.name}" hiện đang tạm hết hàng trong kho!`);
                      return;
                    }
                    handleBuyNow();
                  }}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    isOutOfStock
                      ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                      : "bg-neutral-950 text-white hover:bg-neutral-800 active:scale-98"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isOutOfStock ? "Hết hàng" : "Mua ngay"}</span>
                </button>
              </div>
            </div>

            {/* Cam kết & Chính sách dịch vụ */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-neutral-200 p-3.5 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-neutral-100 text-neutral-900 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Giao hàng hỏa tốc</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">2 - 3 ngày toàn quốc</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-3.5 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-neutral-100 text-neutral-900 shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Đổi trả 7 ngày</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Miễn phí nếu không vừa</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-3.5 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-neutral-100 text-neutral-900 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">100% Chính hãng</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Tiêu chuẩn RAMANY</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-3.5 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-neutral-100 text-neutral-900 shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Hỗ trợ 24/7</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Hotline: 1900 6868</p>
                </div>
              </div>
            </div>

            {/* Tab Thông tin chi tiết */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
              <div className="flex border-b border-neutral-200 bg-neutral-50/70 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("desc")}
                  className={`flex-1 py-3 px-4 text-center border-b-2 transition cursor-pointer ${
                    activeTab === "desc"
                      ? "border-neutral-950 text-neutral-950 bg-white"
                      : "border-transparent text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Mô tả sản phẩm
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("material")}
                  className={`flex-1 py-3 px-4 text-center border-b-2 transition cursor-pointer ${
                    activeTab === "material"
                      ? "border-neutral-950 text-neutral-950 bg-white"
                      : "border-transparent text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Chất liệu & Xuất xứ
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("care")}
                  className={`flex-1 py-3 px-4 text-center border-b-2 transition cursor-pointer ${
                    activeTab === "care"
                      ? "border-neutral-950 text-neutral-950 bg-white"
                      : "border-transparent text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Bảo quản & Giặt ủi
                </button>
              </div>

              <div className="p-5 text-xs text-neutral-700 leading-relaxed">
                {activeTab === "desc" && (
                  <div className="space-y-3">
                    <p className="text-neutral-800 font-medium">
                      {product.description ||
                        "Thiết kế hiện đại, tinh tế từ bộ sưu tập RAMANY. Từng đường may mũi chỉ được trau chuốt tỉ mỉ nhằm đem lại trải nghiệm thoải mái và phong thái đĩnh đạc nhất cho người mặc."}
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                      <li>Phong cách tối giản, dễ dàng phối hợp cùng nhiều phong cách khác nhau.</li>
                      <li>Phù hợp mặc đi làm, dạo phố, gặp gỡ đối tác hay tiệc nhẹ.</li>
                      <li>Form dáng chuẩn số đo người Việt, tôn lên vẻ thanh lịch tự nhiên.</li>
                    </ul>
                  </div>
                )}

                {activeTab === "material" && (
                  <div className="space-y-2">
                    <p>
                      <strong>Chất liệu:</strong> Sợi dệt tự nhiên kết hợp sợi co giãn cao cấp, thoáng khí và thấm hút mồ hôi tối đa.
                    </p>
                    <p>
                      <strong>Xuất xứ:</strong> Sản xuất tại Việt Nam theo tiêu chuẩn xuất khẩu chính hãng thương hiệu RAMANY.
                    </p>
                    <p>
                      <strong>Độ bền:</strong> Xử lý chống nhăn và chống co rút sợi sau nhiều lần giặt.
                    </p>
                  </div>
                )}

                {activeTab === "care" && (
                  <div className="space-y-1.5 text-neutral-600">
                    <p>• Khuyến khích giặt tay hoặc giặt máy ở chu kỳ nhẹ với nước lạnh.</p>
                    <p>• Không sử dụng hóa chất tẩy rửa mạnh hoặc thuốc tẩy clo.</p>
                    <p>• Phơi nơi râm mát, thoáng gió, tránh ánh nắng gắt trực tiếp để giữ màu bền lâu.</p>
                    <p>• Ủi (là) ở nhiệt độ trung bình dưới 150°C, tốt nhất nên lộn trái khi ủi.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 5. KHU VỰC SẢN PHẨM LIÊN QUAN */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Gợi ý cho bạn
                </span>
                <h3 className="text-xl font-extrabold text-neutral-900 mt-0.5">
                  Sản phẩm cùng danh mục &ldquo;{product.category}&rdquo;
                </h3>
              </div>
              <Link
                href={`/?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-bold text-neutral-900 hover:text-neutral-600 inline-flex items-center gap-1 transition"
              >
                <span>Xem tất cả</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {relatedProducts.map((rel) => {
                const relImages = getProductImages(rel);
                return (
                  <Link
                    key={rel.id}
                    href={`/products/${rel.id}`}
                    className="group bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all flex flex-col"
                  >
                    <div className="relative w-full aspect-3/4 bg-neutral-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={relImages[0] || rel.imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500"}
                        alt={rel.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {relImages.length > 1 && (
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-sm text-[9px] font-bold bg-neutral-900/80 text-white">
                          {relImages.length} ảnh
                        </div>
                      )}
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-400 font-mono block mb-0.5">
                          {rel.sku}
                        </span>
                        <h4 className="font-bold text-neutral-900 text-xs line-clamp-2 group-hover:text-neutral-600 transition">
                          {rel.name}
                        </h4>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between">
                        <span className="font-extrabold text-sm text-neutral-950">
                          {formatVnd(rel.price)}
                        </span>
                        <span className="text-[10px] font-semibold text-neutral-500 group-hover:text-neutral-900 transition">
                          Xem &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* 6. TOAST THÔNG BÁO */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-950 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5 duration-200 border border-neutral-800">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{cartToast}</span>
        </div>
      )}

      {/* 7. MODAL BẢNG HƯỚNG DẪN CHỌN SIZE */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-neutral-900" />
                <h3 className="font-bold text-sm text-neutral-900">Bảng Hướng Dẫn Chọn Kích Cỡ RAMANY</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSizeChartOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <p className="text-neutral-600">
                Kích cỡ chuẩn form người Việt Nam. Nếu bạn phân vân giữa 2 kích cỡ, RAMANY khuyến khích chọn kích cỡ lớn hơn để thoải mái hơn.
              </p>
              <table className="w-full text-left border-collapse border border-neutral-200 text-xs">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-900 font-bold">
                    <th className="border border-neutral-200 p-2 text-center">Size</th>
                    <th className="border border-neutral-200 p-2">Chiều cao (cm)</th>
                    <th className="border border-neutral-200 p-2">Cân nặng (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-700">
                  <tr>
                    <td className="border border-neutral-200 p-2 font-bold text-center">S</td>
                    <td className="border border-neutral-200 p-2">150 - 160</td>
                    <td className="border border-neutral-200 p-2">42 - 50</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-200 p-2 font-bold text-center">M</td>
                    <td className="border border-neutral-200 p-2">160 - 170</td>
                    <td className="border border-neutral-200 p-2">50 - 62</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-200 p-2 font-bold text-center">L</td>
                    <td className="border border-neutral-200 p-2">170 - 178</td>
                    <td className="border border-neutral-200 p-2">62 - 74</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-200 p-2 font-bold text-center">XL</td>
                    <td className="border border-neutral-200 p-2">175 - 185</td>
                    <td className="border border-neutral-200 p-2">74 - 88</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-200 p-2 font-bold text-center">Free Size</td>
                    <td className="border border-neutral-200 p-2">150 - 175</td>
                    <td className="border border-neutral-200 p-2">40 - 70 (Form rộng)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSizeChartOpen(false)}
                className="px-4 py-2 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. GIỎ HÀNG SLIDE-OVER DRAWER */}
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
                type="button"
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
                  <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-neutral-700">Giỏ hàng của bạn đang trống</p>
                  <p className="text-xs text-neutral-400 mt-1">Hãy thêm các món đồ yêu thích vào giỏ nhé!</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className={`p-3 rounded-xl border transition flex gap-3 ${
                      item.selected
                        ? "border-neutral-300 bg-white shadow-2xs"
                        : "border-neutral-200/60 bg-neutral-50/60 opacity-80"
                    }`}
                  >
                    <div className="flex items-center pt-2">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleToggleSelectItem(idx)}
                        className="w-4 h-4 rounded text-neutral-900 border-neutral-300 focus:ring-neutral-900 cursor-pointer accent-neutral-900 shrink-0"
                      />
                    </div>

                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getProductImages(item.product)[0] || item.product.imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500"}
                        alt={item.product.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500";
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-neutral-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                          <span>Size: <strong>{item.size}</strong></span>
                          <span>•</span>
                          <span>Màu: <strong>{item.color}</strong></span>
                        </div>
                        <div className="text-xs font-black text-neutral-950 mt-1">
                          {formatVnd(item.product.price)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                        <div className="flex items-center border border-neutral-200 rounded-md bg-neutral-50">
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(idx, -1)}
                            className="p-1 hover:bg-neutral-200 rounded-l-md transition cursor-pointer"
                          >
                            <Minus className="w-3 h-3 text-neutral-600" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(idx, 1)}
                            className="p-1 hover:bg-neutral-200 rounded-r-md transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3 text-neutral-600" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(idx)}
                          className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer transition"
                          title="Xóa món"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
                  type="button"
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
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. MODAL CHECKOUT ĐẶT HÀNG */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            {orderSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Đặt hàng thành công!</h3>
                <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
                  Cảm ơn <strong>{customerInfo.name}</strong>. Đơn hàng của bạn đã được tiếp nhận và nhân viên RAMANY sẽ liên hệ xác nhận trong thời gian sớm nhất.
                </p>
                <div className="p-4 bg-neutral-50 rounded-xl text-left text-xs space-y-1.5 border border-neutral-100">
                  <p className="text-neutral-500">Số điện thoại: <strong className="text-neutral-900">{customerInfo.phone}</strong></p>
                  <p className="text-neutral-500">Địa chỉ: <strong className="text-neutral-900">{customerInfo.address}</strong></p>
                  <p className="text-neutral-500">Tổng thanh toán: <strong className="text-rose-600 font-bold">{formatVnd(cartTotal)}</strong></p>
                  <p className="text-neutral-500">Phương thức: <strong className="text-neutral-900">{customerInfo.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng"}</strong></p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOrderSuccess(false);
                    setIsCheckoutOpen(false);
                  }}
                  className="w-full py-3 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition cursor-pointer"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">Thông tin đặt hàng</h3>
                    <p className="text-xs text-neutral-500">Xác nhận thông tin giao hàng ({selectedCount} món)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Họ và tên người nhận <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        placeholder="VD: Nguyễn Văn A"
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="VD: 0912 345 678"
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Địa chỉ nhận hàng <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Ghi chú giao hàng (nếu có)</label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={customerInfo.note}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
                        placeholder="VD: Giao giờ hành chính, gọi trước khi đến..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Phương thức thanh toán</label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition ${
                        customerInfo.paymentMethod === "cod" ? "border-neutral-950 bg-neutral-50 font-bold" : "border-neutral-200"
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={customerInfo.paymentMethod === "cod"}
                          onChange={() => setCustomerInfo({ ...customerInfo, paymentMethod: "cod" })}
                          className="accent-neutral-900"
                        />
                        <span>Thanh toán COD</span>
                      </label>
                      <label className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition ${
                        customerInfo.paymentMethod === "banking" ? "border-neutral-950 bg-neutral-50 font-bold" : "border-neutral-200"
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="banking"
                          checked={customerInfo.paymentMethod === "banking"}
                          onChange={() => setCustomerInfo({ ...customerInfo, paymentMethod: "banking" })}
                          className="accent-neutral-900"
                        />
                        <span>Chuyển khoản</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-600">Tổng thanh toán:</span>
                  <span className="text-base font-extrabold text-rose-600">{formatVnd(cartTotal)}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer active:scale-98"
                >
                  Xác nhận đặt hàng ngay
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 10. FOOTER CHÍNH */}
      <footer className="bg-white border-t border-neutral-200 text-neutral-600 text-xs py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-100">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <RamanyFullBadge size={40} theme="dark" />
              </div>
              <p className="text-neutral-500 text-xs leading-relaxed">
                Thương hiệu thời trang tối giản thanh lịch, chú trọng chất lượng vải và form dáng chuẩn mực.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 mb-3 uppercase tracking-wider text-[11px]">
                Bộ sưu tập
              </h4>
              <ul className="space-y-2 text-neutral-500">
                <li><Link href="/?category=Áo+thun" className="hover:text-neutral-900 transition">Áo Thun</Link></li>
                <li><Link href="/?category=Áo+sơ+mi" className="hover:text-neutral-900 transition">Áo Sơ Mi</Link></li>
                <li><Link href="/?category=Quần+jeans" className="hover:text-neutral-900 transition">Quần Jeans</Link></li>
                <li><Link href="/?category=Đầm+%26+Váy" className="hover:text-neutral-900 transition">Đầm & Váy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 mb-3 uppercase tracking-wider text-[11px]">
                Chính sách khách hàng
              </h4>
              <ul className="space-y-2 text-neutral-500">
                <li>Miễn phí giao hàng đơn từ 500K</li>
                <li>Đổi trả linh hoạt trong 7 ngày</li>
                <li>Bảo mật thông tin thanh toán</li>
                <li>Chính sách kiểm hàng trước khi nhận</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 mb-3 uppercase tracking-wider text-[11px]">
                Liên hệ RAMANY
              </h4>
              <ul className="space-y-2 text-neutral-500">
                <li>Hotline: 1900 6868</li>
                <li>Email: contact@ramany.fashion</li>
                <li>Địa chỉ: Hệ thống phân phối toàn quốc</li>
                <li>Giờ mở cửa: 08:30 - 22:00 hàng ngày</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-neutral-400 text-[11px] gap-2">
            <span>&copy; {new Date().getFullYear()} RAMANY Fashion. Bản quyền thuộc về thương hiệu RAMANY.</span>
            <span>Hệ thống cơ sở dữ liệu kết nối trực tiếp Supabase.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
