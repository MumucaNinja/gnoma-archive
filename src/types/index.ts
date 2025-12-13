export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  original_price?: number;
  category_id?: string;
  category?: Category;
  images: string[];
  stock: number;
  is_new: boolean;
  is_promo: boolean;
  genetics?: string;
  flowering_time?: string;
  thc_level?: string;
  cbd_level?: string;
  yield_info?: string;
  is_combo?: boolean;
  combo_seed_type?: string;
  combo_quantity?: number;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export interface ComboSelection {
  comboProduct: Product;
  selectedSeeds: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
  created_at: string;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface Order {
  id: string;
  user_id?: string;
  status: OrderStatus;
  total: number;
  shipping_address?: ShippingAddress | null;
  notes?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  product_price: number;
  quantity: number;
  created_at: string;
}

export type AppRole = 'admin' | 'user';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}
