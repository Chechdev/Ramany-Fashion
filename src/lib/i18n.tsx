"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "km" | "vi";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "km", name: "Khmer", nativeName: "ភាសាខ្មែរ", flag: "🇰🇭" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
];

export const translations = {
  // Top bar & Header
  hotline: {
    en: "Customer Support: 1800 6868 (8:00 - 22:00)",
    km: "សេវាបម្រើអតិថិជន: 1800 6868 (8:00 - 22:00)",
    vi: "Hotline hỗ trợ: 1800 6868 (8h - 22h)",
  },
  shippingPromo: {
    en: "Monthly Offer: FREE SHIPPING on orders over 500,000₫",
    km: "ការផ្តល់ជូនប្រចាំខែ: ដឹកជញ្ជូនឥតគិតថ្លៃលើការបញ្ជាទិញចាប់ពី 500,000₫",
    vi: "Ưu đãi tháng này: MIỄN PHÍ VẬN CHUYỂN cho đơn từ 500.000₫",
  },
  freeReturn30: {
    en: "30-Day Free Returns",
    km: "ប្តូរទំនិញឥតគិតថ្លៃ 30 ថ្ងៃ",
    vi: "Đổi trả 30 ngày miễn phí",
  },
  qualityCommitment: {
    en: "Guaranteed Quality",
    km: "ការធានាគុណភាពខ្ពស់",
    vi: "Chất lượng cam kết",
  },
  settings: {
    en: "Settings",
    km: "ការកំណត់",
    vi: "Cài đặt",
  },
  language: {
    en: "Language",
    km: "ភាសា",
    vi: "Ngôn ngữ",
  },
  searchPlaceholder: {
    en: "Search t-shirts, shirts, dresses, jeans...",
    km: "ស្វែងរកអាវយឺត, អាវសឺមី, រ៉ូប, ខោខូវប៊យ...",
    vi: "Tìm áo thun, sơ mi, đầm váy, jeans...",
  },
  cart: {
    en: "Cart",
    km: "កន្ត្រក",
    vi: "Giỏ hàng",
  },

  // Hero section
  collection2026: {
    en: "New Collection 2026",
    km: "ការប្រមូលម៉ូដថ្មី 2026",
    vi: "Bộ Sưu Tập Mới 2026",
  },
  heroTitle1: {
    en: "Standard Minimalism.",
    km: "ភាពសាមញ្ញស្តង់ដារ។",
    vi: "Tối giản chuẩn mực.",
  },
  heroTitle2: {
    en: "Effortless Elegance.",
    km: "រចនាប័ទ្មធម្មជាតិថ្លៃថ្នូរ។",
    vi: "Phong cách tự tại.",
  },
  heroDesc: {
    en: "RAMANY delivers contemporary fashion crafted from natural woven cotton with refined tailoring for every daily moment.",
    km: "RAMANY ផ្តល់នូវការរចនាម៉ូដទាន់សម័យពីសាច់ក្រណាត់កប្បាសធម្មជាតិ កាត់ដេរយ៉ាងផ្ចិតផ្ចង់សម្រាប់រាល់ពេលប្រចាំថ្ងៃ។",
    vi: "RAMANY mang đến những thiết kế thời trang hiện đại từ chất liệu cotton dệt thoi tự nhiên, form dáng chuẩn mực cho mọi khoảnh khắc hàng ngày.",
  },
  exploreNow: {
    en: "Explore Now",
    km: "ស្វែងរកឥឡូវនេះ",
    vi: "Khám phá ngay",
  },

  // Trust badges
  fastDelivery: {
    en: "Express Delivery",
    km: "ការដឹកជញ្ជូនរហ័ស",
    vi: "Giao hàng hỏa tốc",
  },
  fastDeliverySub: {
    en: "Free on orders over 500k",
    km: "ឥតគិតថ្លៃសម្រាប់បញ្ជាទិញលើ 500k",
    vi: "Miễn phí ship đơn từ 500k",
  },
  cottonBadge: {
    en: "100% Organic Cotton",
    km: "កប្បាសសរីរាង្គ 100%",
    vi: "100% Cotton Organic",
  },
  cottonBadgeSub: {
    en: "Naturally breathable fabric",
    km: "ក្រណាត់ខ្យល់ចេញចូលធម្មជាតិ",
    vi: "Cotton tự nhiên thoáng mát",
  },
  returnBadge: {
    en: "30-Day Returns",
    km: "ប្តូរទំនិញ 30 ថ្ងៃ",
    vi: "Đổi trả 30 ngày",
  },
  returnBadgeSub: {
    en: "Swift & hassle-free procedure",
    km: "នីតិវិធីរហ័សនិងឥតគិតថ្លៃ",
    vi: "Thủ tục nhanh gọn, miễn phí",
  },
  supportBadge: {
    en: "Dedicated Support",
    km: "ការគាំទ្រយ៉ាងយកចិត្តទុកដាក់",
    vi: "Tư vấn tận tâm",
  },
  supportBadgeSub: {
    en: "Expert sizing & styling advice",
    km: "ប្រឹក្សាទំហំត្រឹមត្រូវ 24/7",
    vi: "Tư vấn size tận tình 24/7",
  },

  // Storefront & Filters
  onlineStore: {
    en: "ONLINE STORE",
    km: "ហាងអនឡាញ",
    vi: "CỬA HÀNG TRỰC TUYẾN",
  },
  featuredProducts: {
    en: "Featured Fashion Collection",
    km: "ផលិតផលម៉ូដលេចធ្លោ",
    vi: "Sản Phẩm Thời Trang Nổi Bật",
  },
  productsCount: {
    en: "products",
    km: "ផលិតផល",
    vi: "sản phẩm",
  },
  sortBy: {
    en: "Sort by",
    km: "តម្រៀបតាម",
    vi: "Sắp xếp",
  },
  sortNewest: {
    en: "Newest",
    km: "ថ្មីបំផុត",
    vi: "Mới nhất",
  },
  sortPriceAsc: {
    en: "Price: Low to High",
    km: "តម្លៃ: ទាបទៅខ្ពស់",
    vi: "Giá: Thấp đến cao",
  },
  sortPriceDesc: {
    en: "Price: High to Low",
    km: "តម្លៃ: ខ្ពស់ទៅទាប",
    vi: "Giá: Cao đến thấp",
  },
  sortBestSeller: {
    en: "Best Sellers",
    km: "លក់ដាច់បំផុត",
    vi: "Bán chạy nhất",
  },

  // Category Names
  catAll: {
    en: "All Products",
    km: "ផលិតផលទាំងអស់",
    vi: "Tất cả sản phẩm",
  },
  catAoThun: {
    en: "T-Shirts",
    km: "អាវយឺត",
    vi: "Áo thun",
  },
  catAoSoMi: {
    en: "Shirts",
    km: "អាវសឺមី",
    vi: "Áo sơ mi",
  },
  catQuanJeans: {
    en: "Jeans",
    km: "ខោខូវប៊យ",
    vi: "Quần jeans",
  },
  catDamVay: {
    en: "Dresses & Skirts",
    km: "រ៉ូប & សំពត់",
    vi: "Đầm & váy",
  },
  catAoKhoac: {
    en: "Biker Jackets",
    km: "អាវស្បែក Biker",
    vi: "Áo khoác Biker",
  },
  catNam: {
    en: "Men's Fashion",
    km: "ម៉ូដបុរស",
    vi: "Thời trang nam",
  },
  catNu: {
    en: "Women's Fashion",
    km: "ម៉ូដនារី",
    vi: "Thời trang nữ",
  },

  // Product cards
  quickView: {
    en: "Quick View",
    km: "មើលរហ័ស",
    vi: "Xem nhanh",
  },
  outOfStock: {
    en: "Out of Stock",
    km: "អស់ពីស្តុក",
    vi: "Hết hàng",
  },
  inStock: {
    en: "In Stock",
    km: "មានក្នុងស្តុក",
    vi: "Còn hàng",
  },
  photos: {
    en: "photos",
    km: "រូបថត",
    vi: "ảnh",
  },
  price: {
    en: "Price",
    km: "តម្លៃ",
    vi: "Giá bán",
  },

  // Cart Drawer
  cartTitle: {
    en: "Your Shopping Cart",
    km: "កន្ត្រកទំនិញរបស់អ្នក",
    vi: "Giỏ Hàng Của Bạn",
  },
  emptyCart: {
    en: "Your cart is empty",
    km: "កន្ត្រករបស់អ្នកទទេ",
    vi: "Giỏ hàng đang trống",
  },
  emptyCartSub: {
    en: "Explore the latest designs from RAMANY today!",
    km: "ស្វែងរកការរចនាចុងក្រោយបំផុតពី RAMANY ថ្ងៃនេះ!",
    vi: "Hãy khám phá những thiết kế mới nhất từ RAMANY hôm nay!",
  },
  selectItemsToBuy: {
    en: "Select items to checkout",
    km: "ជ្រើសរើសទំនិញដើម្បីទូទាត់",
    vi: "Chọn món để mua",
  },
  selectAll: {
    en: "Select All",
    km: "ជ្រើសរើសទាំងអស់",
    vi: "Chọn tất cả",
  },
  clearCart: {
    en: "Clear Cart",
    km: "សម្អាតកន្ត្រក",
    vi: "Xóa tất cả",
  },
  selected: {
    en: "Selected",
    km: "បានជ្រើស",
    vi: "Đã chọn",
  },
  items: {
    en: "items",
    km: "មុខទំនិញ",
    vi: "món",
  },
  subtotal: {
    en: "Subtotal",
    km: "សរុបរង",
    vi: "Tạm tính",
  },
  shipping: {
    en: "Shipping",
    km: "ថ្លៃដឹកជញ្ជូន",
    vi: "Phí vận chuyển",
  },
  freeShipping: {
    en: "Free",
    km: "ឥតគិតថ្លៃ",
    vi: "Miễn phí",
  },
  total: {
    en: "Total",
    km: "សរុបទាំងអស់",
    vi: "Tổng cộng",
  },
  proceedCheckout: {
    en: "Proceed to Checkout",
    km: "បន្តទៅការទូទាត់",
    vi: "Tiến hành Đặt Hàng",
  },
  continueShopping: {
    en: "Continue Shopping",
    km: "បន្តការទិញទំនិញ",
    vi: "Tiếp tục mua sắm",
  },

  // Product Detail / Modal
  addToCart: {
    en: "Add to Cart",
    km: "បញ្ចូលកន្ត្រក",
    vi: "Thêm vào giỏ hàng",
  },
  buyNow: {
    en: "Buy Now",
    km: "ទិញឥឡូវនេះ",
    vi: "Mua ngay",
  },
  selectSize: {
    en: "Select Size",
    km: "ជ្រើសរើសទំហំ",
    vi: "Chọn kích cỡ",
  },
  selectColor: {
    en: "Select Color",
    km: "ជ្រើសរើសពណ៌",
    vi: "Chọn màu sắc",
  },
  quantity: {
    en: "Quantity",
    km: "ចំនួន",
    vi: "Số lượng",
  },
  skuCode: {
    en: "SKU",
    km: "កូដ SKU",
    vi: "Mã SKU",
  },
  category: {
    en: "Category",
    km: "ប្រភេទ",
    vi: "Danh mục",
  },
  targetAudience: {
    en: "Target",
    km: "គោលដៅ",
    vi: "Đối tượng",
  },
  productDesc: {
    en: "Product Description",
    km: "ការពិពណ៌នាអំពីផលិតផល",
    vi: "Mô tả sản phẩm",
  },
  specifications: {
    en: "Specifications & Material",
    km: "លក្ខណៈបច្ចេកទេស & សាច់ក្រណាត់",
    vi: "Thông số & Chất liệu",
  },
  relatedProducts: {
    en: "You May Also Like",
    km: "ផលិតផលដែលអ្នកប្រហែលជាចូលចិត្ត",
    vi: "Sản phẩm tương tự",
  },
  backToCategory: {
    en: "Back to Catalog",
    km: "ត្រឡប់ទៅកាតាឡុក",
    vi: "Quay lại danh mục",
  },

  // Admin & Login
  adminTitle: {
    en: "Admin Login",
    km: "ចូលប្រព័ន្ធគ្រប់គ្រង",
    vi: "Đăng Nhập Quản Trị",
  },
  adminSubtitle: {
    en: "Internal Inventory & Catalog Management",
    km: "ប្រព័ន្ធគ្រប់គ្រងស្តុក និងកាតាឡុកខាងក្នុង",
    vi: "Hệ thống Quản Trị Nội Bộ",
  },
  usernameOrEmail: {
    en: "Username / Email",
    km: "ឈ្មោះគណនី / អ៊ីមែល",
    vi: "Tài khoản / Email",
  },
  password: {
    en: "Password",
    km: "ពាក្យសម្ងាត់",
    vi: "Mật khẩu",
  },
  rememberMe: {
    en: "Remember me",
    km: "ចងចាំការចូល",
    vi: "Ghi nhớ đăng nhập",
  },
  signIn: {
    en: "Sign In",
    km: "ចូលប្រព័ន្ធ",
    vi: "Đăng Nhập Quản Trị",
  },
  logout: {
    en: "Log Out",
    km: "ចាកចេញ",
    vi: "Đăng xuất",
  },
  store: {
    en: "Store",
    km: "ហាង",
    vi: "Cửa hàng",
  },
  addProduct: {
    en: "Add Product",
    km: "បន្ថែមផលិតផល",
    vi: "Thêm sản phẩm",
  },
  importCsv: {
    en: "Import CSV",
    km: "នាំចូល CSV",
    vi: "Nhập CSV",
  },
  exportCsv: {
    en: "Export CSV",
    km: "នាំចេញ CSV",
    vi: "Xuất CSV",
  },

  // Settings Modal
  settingsTitle: {
    en: "Preferences & Settings",
    km: "ការកំណត់ប្រព័ន្ធ",
    vi: "Cài đặt & Tùy chọn",
  },
  chooseLanguage: {
    en: "Select Display Language",
    km: "ជ្រើសរើសភាសាបង្ហាញ",
    vi: "Chọn ngôn ngữ hiển thị",
  },
  languageDesc: {
    en: "Choose your preferred language for navigation and product catalog.",
    km: "ជ្រើសរើសភាសាដែលអ្នកពេញចិត្តសម្រាប់ការរុករក និងកាតាឡុកផលិតផល។",
    vi: "Chọn ngôn ngữ bạn muốn sử dụng trên website.",
  },
  currentLang: {
    en: "Active Language",
    km: "ភាសាកំពុងប្រើ",
    vi: "Ngôn ngữ đang chọn",
  },
  close: {
    en: "Close",
    km: "បិទ",
    vi: "Đóng",
  },
  savedSuccess: {
    en: "Language updated successfully",
    km: "បានផ្លាស់ប្តូរភាសាដោយជោគជ័យ",
    vi: "Đã cập nhật ngôn ngữ thành công",
  },

  // Footer
  policySupport: {
    en: "Policies & Support",
    km: "គោលការណ៍ & ការគាំទ្រ",
    vi: "Chính sách & Hỗ trợ",
  },
  policySupportDesc: {
    en: "Free 30-day returns on unworn items with original tags. 24/7 dedicated sizing advice.",
    km: "ប្តូរទំនិញឥតគិតថ្លៃក្នុងរយៈពេល 30 ថ្ងៃសម្រាប់ទំនិញមិនទាន់ពាក់ដែលមានស្លាកដើម។ ប្រឹក្សាទំហំ 24/7។",
    vi: "Miễn phí đổi trả trong 30 ngày đối với sản phẩm còn nguyên tem mác. Tư vấn form dáng chuẩn xác 24/7.",
  },
  copyright: {
    en: "RAMANY &copy; 2026. All rights reserved.",
    km: "RAMANY &copy; 2026. រក្សាសិទ្ធិគ្រប់យ៉ាង។",
    vi: "RAMANY &copy; 2026. Tất cả các quyền được bảo lưu.",
  },
  techStack: {
    en: "Built with Next.js 16 + React 19 + Supabase + Cloudinary + Tailwind CSS.",
    km: "បង្កើតឡើងជាមួយ Next.js 16 + React 19 + Supabase + Cloudinary + Tailwind CSS.",
    vi: "Xây dựng với Next.js 16 + React 19 + Supabase + Cloudinary + Tailwind CSS.",
  },
} as const;

export type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key: TranslationKey) => translations[key]?.en || "",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Ngôn ngữ mặc định là tiếng Anh (en)
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("ramany_lang") as Language | null;
      if (savedLang && (savedLang === "en" || savedLang === "km" || savedLang === "vi")) {
        setLangState(savedLang);
      } else {
        // Mặc định luôn là 'en'
        setLangState("en");
        localStorage.setItem("ramany_lang", "en");
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("ramany_lang", newLang);
      document.documentElement.lang = newLang;
    } catch {
      // Ignore
    }
  };

  const t = (key: TranslationKey): string => {
    const item = translations[key];
    if (!item) return key;
    return item[lang] || item.en || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
