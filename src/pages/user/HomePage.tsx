import React, { useEffect, useState } from 'react';
import { getServices } from '../../api/serviceApi';
import type { Service } from '../../types';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getServices()
      .then(setServices)
      .catch((err) => setError(err.message || 'Error loading services'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Service List</h1>
      {loading && (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin mr-2" /> Loading services...
        </div>
      )}
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-accent/40">
            <div className="font-semibold text-lg">{service.name}</div>
            <div className="text-muted-foreground text-sm mb-2">{service.category}</div>
            <div className="text-foreground mb-2">{service.description}</div>
            <div className="font-bold text-primary">{service.price_per_unit.toLocaleString()} đ / unit</div>
            <Button className="mt-2" onClick={() => navigate(`/order/${service.id}`)}>Order Service</Button>
          </div>
        ))}
      </div>
      {(!loading && services.length === 0) && (
        <div className="text-center text-muted-foreground mt-10">No services available.</div>
      )}
    </div>
  );
}