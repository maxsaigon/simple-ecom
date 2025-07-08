export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  role: 'user' | 'admin' | 'blocked';
  wallet_balance: number;
}
export interface Service {
  id: number;
  name: string;
  description: string;
  price_per_unit: number;
  category: string;
  tags?: string[];
  estimated_time?: string;
  order_limit?: number;
  created_at: string;
}
export interface Order {
  id: number;
  user_id: string;
  service_id: number;
  quantity: number;
  total_price: number;
  link_or_target: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
}
export interface Transaction {
  id: number;
  user_id: string;
  type: 'deposit' | 'order' | 'refund' | string;
  amount: number;
  balance_after: number;
  order_id?: number | null;
  description?: string | null;
  created_at: string;
}
