import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Profile, Order, Transaction } from '../../types';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Profile[]>([]);
  const [sortBy, setSortBy] = useState<'full_name'|'wallet_balance'>('full_name');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const [selected, setSelected] = useState<Profile|null>(null);
  const [edit, setEdit] = useState<Partial<Profile>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    supabase.from('profiles').select('*').then(({ data }) => setUsers(data || []));
  }, []);

  useEffect(() => {
    let data = [...users];
    if (search) {
      data = data.filter(user =>
        user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.id?.toLowerCase().includes(search.toLowerCase())
      );
    }
    data.sort((a, b) => {
      if (sortBy === 'full_name') {
        return sortDir === 'asc'
          ? (a.full_name || '').localeCompare(b.full_name || '')
          : (b.full_name || '').localeCompare(a.full_name || '');
      } else {
        return sortDir === 'asc' ? a.wallet_balance - b.wallet_balance : b.wallet_balance - a.wallet_balance;
      }
    });
    setFiltered(data);
  }, [users, search, sortBy, sortDir]);

  const openDetail = async (user: Profile) => {
    setSelected(user);
    setEdit(user);
    setLoadingDetail(true);
    const [ordersRes, txRes] = await Promise.all([
      supabase.from('orders').select('*').eq('user_id', user.id),
      supabase.from('transactions').select('*').eq('user_id', user.id)
    ]);
    setOrders(ordersRes.data || []);
    setTransactions(txRes.data || []);
    setLoadingDetail(false);
  };

  const handleEdit = (field: keyof Profile, value: any) => {
    setEdit({ ...edit, [field]: value });
  };

  const saveEdit = async () => {
    if (!selected) return;
    await supabase.from('profiles').update(edit).eq('id', selected.id);
    setUsers(users.map(u => u.id === selected.id ? { ...u, ...edit } : u));
    setSelected({ ...selected, ...edit } as Profile);
  };

  const blockUser = async () => {
    if (!selected) return;
    await supabase.from('profiles').update({ role: 'blocked' }).eq('id', selected.id);
    setUsers(users.map(u => u.id === selected.id ? { ...u, role: 'blocked' } : u));
    setSelected(selected ? { ...selected, role: 'blocked' } : null);
  };

  const deleteUser = async () => {
    if (!selected) return;
    await supabase.from('profiles').delete().eq('id', selected.id);
    setUsers(users.filter(u => u.id !== selected.id));
    setSelected(null);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>
      <div className="flex gap-2 mb-4">
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID..." />
        <Button type="button" onClick={() => setSortBy('full_name')}>Sort by Name</Button>
        <Button type="button" onClick={() => setSortBy('wallet_balance')}>Sort by Balance</Button>
        <Button type="button" onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>{sortDir === 'asc' ? 'Asc' : 'Desc'}</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border border-accent/40">
          <thead>
            <tr className="bg-accent-light text-left">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Balance</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-t border-accent/20">
                <td className="py-2 px-4">{user.id}</td>
                <td className="py-2 px-4">{user.full_name}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">{user.wallet_balance.toLocaleString()} đ</td>
                <td className="py-2 px-4">
                  <Button type="button" onClick={() => openDetail(user)}>Detail</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground mt-10">No users found.</div>
        )}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setSelected(null)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4">User Detail</h2>
            <div className="flex flex-col gap-2 mb-4">
              <label>Name: <Input value={edit.full_name || ''} onChange={e => handleEdit('full_name', e.target.value)} /></label>
              <label>Role: <Input value={edit.role || ''} onChange={e => handleEdit('role', e.target.value)} /></label>
              <label>Balance: <Input type="number" value={edit.wallet_balance ?? 0} onChange={e => handleEdit('wallet_balance', Number(e.target.value))} /></label>
            </div>
            <div className="flex gap-2 mb-4">
              <Button onClick={saveEdit}>Save</Button>
              <Button onClick={blockUser} className="bg-yellow-500 hover:bg-yellow-600">Block</Button>
              <Button onClick={deleteUser} className="bg-red-500 hover:bg-red-600">Delete</Button>
            </div>
            <h3 className="text-lg font-semibold mt-6 mb-2">Orders</h3>
            {loadingDetail ? <div>Loading...</div> : (
              <div className="max-h-40 overflow-y-auto mb-4">
                <table className="min-w-full text-sm">
                  <thead><tr><th>ID</th><th>Status</th><th>Total</th><th>Created</th></tr></thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.status}</td>
                        <td>{order.total_price.toLocaleString()} đ</td>
                        <td>{new Date(order.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <h3 className="text-lg font-semibold mt-6 mb-2">Transactions</h3>
            {loadingDetail ? <div>Loading...</div> : (
              <div className="max-h-40 overflow-y-auto">
                <table className="min-w-full text-sm">
                  <thead><tr><th>ID</th><th>Type</th><th>Amount</th><th>Balance</th><th>Time</th></tr></thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx.id}>
                        <td>{tx.id}</td>
                        <td>{tx.type}</td>
                        <td>{tx.amount.toLocaleString()} đ</td>
                        <td>{tx.balance_after.toLocaleString()} đ</td>
                        <td>{new Date(tx.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}