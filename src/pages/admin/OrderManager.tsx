import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Order } from '../../types';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { updateOrderStatus, refundOrder } from '../../api/orderApi';

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [sortBy, setSortBy] = useState<'created_at'|'total_price'>('created_at');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const [modalOrder, setModalOrder] = useState<Order|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    supabase.from('orders').select('*').then(({ data }) => setOrders(data || []));
  }, []);

  useEffect(() => {
    let data = [...orders];
    if (search) {
      data = data.filter(order =>
        order.user_id?.toLowerCase().includes(search.toLowerCase()) ||
        order.status?.toLowerCase().includes(search.toLowerCase())
      );
    }
    data.sort((a, b) => {
      if (sortBy === 'created_at') {
        return sortDir === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return sortDir === 'asc' ? a.total_price - b.total_price : b.total_price - a.total_price;
      }
    });
    setFiltered(data);
  }, [orders, search, sortBy, sortDir]);

  // Handler cho các action
  const handleApprove = async (order: Order) => {
    setLoading(true); setError(null);
    try {
      await updateOrderStatus(order.id, 'processing');
      setOrders(orders => orders.map(o => o.id === order.id ? { ...o, status: 'processing' } : o));
      setModalOrder(null);
    } catch (e) { setError('Failed to approve order'); }
    setLoading(false);
  };
  const handleCancel = async (order: Order) => {
    setLoading(true); setError(null);
    try {
      await updateOrderStatus(order.id, 'cancelled');
      await refundOrder(order.id); // refund tiền vào ví user
      setOrders(orders => orders.map(o => o.id === order.id ? { ...o, status: 'cancelled' } : o));
      setModalOrder(null);
    } catch (e) { setError('Failed to cancel/refund order'); }
    setLoading(false);
  };
  const handleComplete = async (order: Order) => {
    setLoading(true); setError(null);
    try {
      await updateOrderStatus(order.id, 'completed');
      setOrders(orders => orders.map(o => o.id === order.id ? { ...o, status: 'completed' } : o));
      setModalOrder(null);
    } catch (e) { setError('Failed to complete order'); }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Management</h1>
      <div className="flex gap-2 mb-4">
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user or status..." />
        <Button type="button" onClick={() => setSortBy('created_at')}>Sort by Time</Button>
        <Button type="button" onClick={() => setSortBy('total_price')}>Sort by Price</Button>
        <Button type="button" onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>{sortDir === 'asc' ? 'Asc' : 'Desc'}</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border border-accent/40">
          <thead>
            <tr className="bg-accent-light text-left">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">User</th>
              <th className="py-2 px-4">Service</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Total</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Time</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-t border-accent/20">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{order.user_id}</td>
                <td className="py-2 px-4">{order.service_id}</td>
                <td className="py-2 px-4">{order.quantity}</td>
                <td className="py-2 px-4">{order.total_price.toLocaleString()} đ</td>
                <td className="py-2 px-4">{order.status}</td>
                <td className="py-2 px-4">{new Date(order.created_at).toLocaleString()}</td>
                <td className="py-2 px-4">
                  <Button onClick={() => setModalOrder(order)}>View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground mt-10">No orders found.</div>
        )}
      </div>
      {/* Modal hiển thị chi tiết order */}
      {modalOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 min-w-[350px] max-w-[90vw] shadow-xl relative">
            <button className="absolute top-2 right-2" onClick={() => setModalOrder(null)}>✕</button>
            <h2 className="text-xl font-bold mb-2">Order Detail</h2>
            <div className="mb-2 text-sm text-red-500">{error}</div>
            <div className="mb-2">Order ID: <b>{modalOrder.id}</b></div>
            <div className="mb-2">User: {modalOrder.user_id}</div>
            <div className="mb-2">Service: {modalOrder.service_id}</div>
            <div className="mb-2">Quantity: {modalOrder.quantity}</div>
            <div className="mb-2">Total: {modalOrder.total_price.toLocaleString()} đ</div>
            <div className="mb-2">Status: <b>{modalOrder.status}</b></div>
            <div className="mb-2">Created: {new Date(modalOrder.created_at).toLocaleString()}</div>
            <div className="flex gap-2 mt-4">
              {modalOrder.status === 'pending' && (
                <Button onClick={() => handleApprove(modalOrder)}>Approve</Button>
              )}
              {modalOrder.status === 'pending' && (
                <Button onClick={() => handleCancel(modalOrder)}>Cancel & Refund</Button>
              )}
              {modalOrder.status === 'processing' && (
                <Button onClick={() => handleComplete(modalOrder)}>Complete</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}