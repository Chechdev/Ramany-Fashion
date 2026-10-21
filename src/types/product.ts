export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category: string;
  gender: string;
  price: string | number;
  costPrice: string | number | null;
  stockQuantity: number;
  size: string;
  color: string;
  imageUrl: string | null;
  images?: string[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  items: ProductItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  stats: {
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;
    totalStockQuantity: number;
  };
  categories: string[];
}

export interface ProductFormValues {
  sku: string;
  name: string;
  description?: string;
  category: string;
  gender: string;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  size: string;
  color: string;
  imageUrl?: string;
  images?: string[];
  status: "ACTIVE" | "INACTIVE";
}

/**
 * Trích xuất danh sách toàn bộ ảnh của sản phẩm (hỗ trợ cả mảng images hoặc chuỗi imageUrl đơn/JSON)
 */
export function getProductImages(product?: { imageUrl?: string | null; images?: string[] | null } | null): string[] {
  if (!product) return [];
  
  // 1. Nếu có mảng images
  if (Array.isArray(product.images) && product.images.length > 0) {
    const valid = product.images.filter(Boolean);
    if (valid.length > 0) return valid;
  }

  // 2. Nếu có chuỗi imageUrl
  if (product.imageUrl) {
    const raw = product.imageUrl.trim();
    if (raw.startsWith("[") && raw.endsWith("]")) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(Boolean);
        }
      } catch {
        // bỏ qua nếu parse lỗi
      }
    }
    // Hỗ trợ phân cách bằng dấu xuống dòng hoặc phẩy
    if (raw.includes("\n")) {
      return raw.split("\n").map((s) => s.trim()).filter(Boolean);
    }
    if (raw.includes(",") && raw.includes("http")) {
      return raw.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [raw];
  }

  return [];
}

export interface ImportErrorDetail {
  row: number;
  sku?: string;
  field?: string;
  message: string;
}

export interface ImportResult {
  totalRows: number;
  validRows: number;
  successCount: number;
  errorCount: number;
  errors: ImportErrorDetail[];
}

export interface CartItem {
  product: ProductItem;
  size: string;
  color: string;
  quantity: number;
  selected: boolean;
}
