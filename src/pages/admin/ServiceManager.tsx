import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Service } from '../../types';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      className="w-full min-h-[80px] border rounded p-2"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Enter service description..."
    />
  );
}

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [sortBy, setSortBy] = useState<'created_at'|'price_per_unit'>('created_at');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  // State for new service
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price_per_unit: 0,
    category: '',
    tags: '', // comma separated
    estimated_time: '',
    order_limit: 1,
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    supabase.from('services').select('*').then(({ data }) => setServices(data || []));
  }, []);

  useEffect(() => {
    let data = [...services];
    if (search) {
      data = data.filter(service =>
        service.name?.toLowerCase().includes(search.toLowerCase()) ||
        service.category?.toLowerCase().includes(search.toLowerCase())
      );
    }
    data.sort((a, b) => {
      if (sortBy === 'created_at') {
        return sortDir === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return sortDir === 'asc' ? a.price_per_unit - b.price_per_unit : b.price_per_unit - a.price_per_unit;
      }
    });
    setFiltered(data);
  }, [services, search, sortBy, sortDir]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const tagsArr = newService.tags.split(',').map(t => t.trim()).filter(Boolean);
    const { error, data } = await supabase.from('services').insert([
      {
        name: newService.name,
        description: newService.description,
        price_per_unit: newService.price_per_unit,
        category: newService.category,
        tags: tagsArr,
        estimated_time: newService.estimated_time,
        order_limit: newService.order_limit,
      }
    ]).select();
    if (!error && data) {
      setServices([data[0], ...services]);
      setNewService({ name: '', description: '', price_per_unit: 0, category: '', tags: '', estimated_time: '', order_limit: 1 });
    }
    setCreating(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Service Management</h1>
      <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-6 mb-8 border flex flex-col gap-4">
        <div className="text-xl font-semibold mb-2">Create New Service</div>
        <Input value={newService.name} onChange={e => setNewService(s => ({ ...s, name: e.target.value }))} placeholder="Service name" required />
        <Input value={newService.category} onChange={e => setNewService(s => ({ ...s, category: e.target.value }))} placeholder="Category" required />
        <Input type="number" min={1} value={newService.price_per_unit} onChange={e => setNewService(s => ({ ...s, price_per_unit: Number(e.target.value) }))} placeholder="Price per unit" required />
        <Input value={newService.tags} onChange={e => setNewService(s => ({ ...s, tags: e.target.value }))} placeholder="Tags (comma separated)" />
        <Input value={newService.estimated_time} onChange={e => setNewService(s => ({ ...s, estimated_time: e.target.value }))} placeholder="Estimated time to complete (e.g. 1-2 days)" />
        <Input type="number" min={1} value={newService.order_limit} onChange={e => setNewService(s => ({ ...s, order_limit: Number(e.target.value) }))} placeholder="Order limit per order" required />
        <RichTextEditor value={newService.description} onChange={v => setNewService(s => ({ ...s, description: v }))} />
        <Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create Service'}</Button>
      </form>
      <div className="flex gap-2 mb-4">
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or category..." />
        <Button type="button" onClick={() => setSortBy('created_at')}>Sort by Time</Button>
        <Button type="button" onClick={() => setSortBy('price_per_unit')}>Sort by Price</Button>
        <Button type="button" onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>{sortDir === 'asc' ? 'Asc' : 'Desc'}</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border border-accent/40">
          <thead>
            <tr className="bg-accent-light text-left">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Tags</th>
              <th className="py-2 px-4">Price/Unit</th>
              <th className="py-2 px-4">Estimated Time</th>
              <th className="py-2 px-4">Order Limit</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((service) => (
              <tr key={service.id} className="border-t border-accent/20">
                <td className="py-2 px-4">{service.id}</td>
                <td className="py-2 px-4">{service.name}</td>
                <td className="py-2 px-4">{service.category}</td>
                <td className="py-2 px-4">{
                  Array.isArray(service.tags)
                    ? service.tags.join(', ')
                    : typeof service.tags === 'string'
                      ? service.tags
                      : ''
                }</td>
                <td className="py-2 px-4">{service.price_per_unit.toLocaleString()} đ</td>
                <td className="py-2 px-4">{service.estimated_time}</td>
                <td className="py-2 px-4">{service.order_limit}</td>
                <td className="py-2 px-4 max-w-xs truncate" title={service.description}>{service.description}</td>
                <td className="py-2 px-4">{new Date(service.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground mt-10">No services found.</div>
        )}
      </div>
    </div>
  );
}