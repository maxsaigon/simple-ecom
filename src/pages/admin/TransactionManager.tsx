import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../api/transactionApi';
import type { Transaction } from '../../types';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function TransactionManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [sortBy, setSortBy] = useState<'created_at'|'amount'>('created_at');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  useEffect(() => {
    let data = [...transactions];
    if (search) {
      data = data.filter(tx =>
        tx.user_id?.toLowerCase().includes(search.toLowerCase()) ||
        tx.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    data.sort((a, b) => {
      if (sortBy === 'created_at') {
        return sortDir === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return sortDir === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });
    setFiltered(data);
  }, [transactions, search, sortBy, sortDir]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Transaction Management</h1>
      <div className="flex gap-2 mb-4">
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user or description..." />
        <Button type="button" onClick={() => setSortBy('created_at')}>Sort by Time</Button>
        <Button type="button" onClick={() => setSortBy('amount')}>Sort by Amount</Button>
        <Button type="button" onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>{sortDir === 'asc' ? 'Asc' : 'Desc'}</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border border-accent/40">
          <thead>
            <tr className="bg-accent-light text-left">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">User</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Balance After</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id} className="border-t border-accent/20">
                <td className="py-2 px-4">{tx.id}</td>
                <td className="py-2 px-4">{tx.user_id}</td>
                <td className="py-2 px-4 capitalize">{tx.type}</td>
                <td className={`py-2 px-4 font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} đ</td>
                <td className="py-2 px-4">{tx.balance_after.toLocaleString()} đ</td>
                <td className="py-2 px-4">{tx.description || ''}</td>
                <td className="py-2 px-4">{new Date(tx.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground mt-10">No transactions found.</div>
        )}
      </div>
    </div>
  );
}