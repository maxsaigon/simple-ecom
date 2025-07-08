import { supabase } from '../lib/supabaseClient';
import type { Order } from '../types';

// Các trường cần thiết cho Order
const ORDER_FIELDS = 'id, user_id, status, total_price, created_at, service_id, quantity, link_or_target';

// Lấy danh sách order của user, có phân trang
export async function getMyOrders(page = 1, pageSize = 10): Promise<{ data: Order[]; error?: string }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_FIELDS)
    .order('created_at', { ascending: false })
    .range(from, to);
  if (error) return { data: [], error: error.message };
  return { data: data || [] };
}

// Lấy tất cả order (admin), có phân trang
export async function getAllOrders(page = 1, pageSize = 20): Promise<{ data: Order[]; error?: string }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_FIELDS)
    .order('created_at', { ascending: false })
    .range(from, to);
  if (error) return { data: [], error: error.message };
  return { data: data || [] };
}

// Tạo order và trừ tiền, validate đầu vào
export async function createOrderAndDeductBalance(service_id: number, quantity: number, link_or_target: string) {
  if (!service_id || quantity <= 0 || !link_or_target) {
    return { data: null, error: 'Invalid input' };
  }
  const { data, error } = await supabase.rpc('create_order_and_deduct_balance', {
    service_id_param: service_id,
    quantity_param: quantity,
    link_param: link_or_target,
  });
  if (error) return { data: null, error: error.message };
  return { data };
}

// Cập nhật trạng thái order
export async function updateOrderStatus(id: number, status: Order['status']): Promise<{ data: Order | null; error?: string }> {
  if (!id || !status) return { data: null, error: 'Invalid input' };
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
  if (error) return { data: null, error: error.message };
  return { data };
}

// Hàm phụ: cập nhật số dư user
async function updateUserBalance(userId: number, newBalance: number): Promise<string | null> {
  const { error } = await supabase.from('profiles').update({ balance: newBalance }).eq('id', userId);
  return error ? error.message : null;
}

// Hàm phụ: tạo transaction hoàn tiền
async function createRefundTransaction(userId: number, amount: number, orderId: number): Promise<string | null> {
  const { error } = await supabase.from('transactions').insert({
    user_id: userId,
    type: 'refund',
    amount,
    order_id: orderId,
    description: `Refund for cancelled order #${orderId}`,
  });
  return error ? error.message : null;
}

// Refund order: cộng lại tiền vào ví user và tạo transaction hoàn tiền
export async function refundOrder(orderId: number): Promise<{ success: boolean; error?: string }> {
  if (!orderId) return { success: false, error: 'Invalid orderId' };
  // Lấy order
  const { data: order, error: orderError } = await supabase.from('orders').select('id, user_id, total_price').eq('id', orderId).single();
  if (orderError || !order) return { success: false, error: orderError?.message || 'Order not found' };
  // Lấy user profile
  const { data: profile, error: profileError } = await supabase.from('profiles').select('id, balance').eq('id', order.user_id).single();
  if (profileError || !profile) return { success: false, error: profileError?.message || 'User not found' };
  // Cộng lại số dư
  const newBalance = (profile.balance || 0) + (order.total_price || 0);
  const updateError = await updateUserBalance(order.user_id, newBalance);
  if (updateError) return { success: false, error: updateError };
  // Tạo transaction hoàn tiền
  const txError = await createRefundTransaction(order.user_id, order.total_price, order.id);
  if (txError) return { success: false, error: txError };
  return { success: true };
}
