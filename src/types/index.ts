export type AccentColor = "sage" | "terracotta" | "mustard" | "dustypink" | "sky";

export type IllustrationKey =
  | "blocks"
  | "nesting-bowls"
  | "rainbow-stacker"
  | "scarves"
  | "sensory-bin"
  | "vehicle"
  | "discs"
  | "gem-blocks";

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  imageUrl?: string | null;
  productCount?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  illustrationKey: IllustrationKey;
  accentColor: AccentColor;
  imageUrl?: string | null;
  images: string[];
  material?: string | null;
  ageRange?: string | null;
  stock: number;
  featured: boolean;
  isNew: boolean;
  active: boolean;
  categoryId: string;
  category: Category;
  averageRating?: number | null;
  reviewCount?: number;
}

// Produit tel que renvoyé par l'API admin (inclut les produits masqués)
export interface AdminProduct extends Product {
  _count: { orderItems: number };
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: string;
  authorName: string;
  verifiedPurchase: boolean;
  approved: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  illustrationKey: IllustrationKey;
  accentColor: AccentColor;
  imageUrl?: string | null;
  quantity: number;
  stock: number;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "CUSTOMER" | "ADMIN";
}

export type OrderStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export interface OrderItem {
  id: string;
  quantity: number;
  unitPriceCents: number;
  product: Product;
}

export interface Order {
  id: string;
  email: string;
  status: OrderStatus;
  totalCents: number;
  promoCode: string | null;
  discountCents: number;
  currency: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  items: OrderItem[];
  createdAt: string;
}
