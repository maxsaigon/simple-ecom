import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById } from '../../api/serviceApi';
import { createOrderAndDeductBalance } from '../../api/orderApi';
import type { Service } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

export default function OrderServicePage() {
  const { serviceId } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [link, setLink] = useState('');
  const [ordering, setOrdering] = useState(false);
  const navigate = useNavigate();
  const { reloadProfile } = useAuth();

  useEffect(() => {
    if (!serviceId) return;
    setLoading(true);
    getServiceById(Number(serviceId))
      .then(setService)
      .catch((err) => setError(err.message || 'Service not found'))
      .finally(() => setLoading(false));
  }, [serviceId]);

  const total = service ? service.price_per_unit * quantity : 0;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    setOrdering(true);
    try {
      await createOrderAndDeductBalance(service.id, quantity, link);
      await reloadProfile();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err: any) {
      toast.error(err.message || 'Order failed');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-40"><Loader className="animate-spin mr-2" /> Loading service...</div>;
  if (error || !service) return <div className="text-center text-red-500 py-10">{error || 'Service not found'}</div>;

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow p-8 border border-accent/40 mb-6">
        <div className="text-2xl font-bold mb-2">{service.name}</div>
        <div className="text-muted-foreground mb-2">{service.category}</div>
        <div className="mb-4">{service.description}</div>
        <div className="font-bold text-primary mb-2">{service.price_per_unit.toLocaleString()} đ / unit</div>
      </div>
      <form onSubmit={handleOrder} className="bg-white rounded-xl shadow p-8 flex flex-col gap-4 border border-accent/40">
        <div>
          <label className="font-medium">Link or Target <span className="text-red-500">*</span></label>
          <Input value={link} onChange={e => setLink(e.target.value)} required placeholder="Enter link or target" />
        </div>
        <div>
          <label className="font-medium">Quantity <span className="text-red-500">*</span></label>
          <Input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} required />
        </div>
        <div className="font-semibold">Total: <span className="text-primary">{total.toLocaleString()} đ</span></div>
        <Button type="submit" className="w-full" disabled={ordering}>{ordering ? 'Ordering...' : 'Order Service'}</Button>
      </form>
    </div>
  );
}