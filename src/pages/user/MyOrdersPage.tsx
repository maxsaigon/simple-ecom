import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../../api/orderApi';
import { getServices } from '../../api/serviceApi';
import type { Order } from '../../types';
import { Loader } from 'lucide-react';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<{ [id: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getMyOrders(),
      getServices()
    ])
      .then(([{ data: ordersData }, servicesList]) => {
        setOrders(ordersData);
        const map: { [id: number]: string } = {};
        servicesList.forEach(s => { map[s.id] = s.name; });
        setServices(map);
      })
      .catch((err) => setError(err.message || 'Error loading orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Order History</h1>
      {loading && (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin mr-2" /> Loading orders...
        </div>
      )}
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border border-accent/40">
          <thead>
            <tr className="bg-accent-light text-left">
              <th className="py-2 px-4">Service</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Total Price</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-accent/20">
                <td className="py-2 px-4">{services[order.service_id] || order.service_id}</td>
                <td className="py-2 px-4">{order.quantity}</td>
                <td className="py-2 px-4">{order.total_price.toLocaleString()} đ</td>
                <td className="py-2 px-4 capitalize">{order.status}</td>
                <td className="py-2 px-4">{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!loading && orders.length === 0) && (
          <div className="text-center text-muted-foreground mt-10">You have no orders yet.</div>
        )}
      </div>
    </div>
  );
}