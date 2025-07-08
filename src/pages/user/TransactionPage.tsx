import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../api/transactionApi';
import type { Transaction } from '../../types';
import { Loader } from 'lucide-react';

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getTransactions()
      .then(setTransactions)
      .catch((err) => setError(err.message || 'Failed to load transactions'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Transaction History</h1>
      {loading && (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin mr-2" /> Loading transactions...
        </div>
      )}
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border border-accent/40">
          <thead>
            <tr className="bg-accent-light text-left">
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Balance After</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-accent/20">
                <td className="py-2 px-4 capitalize">{tx.type}</td>
                <td className={`py-2 px-4 font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} đ</td>
                <td className="py-2 px-4">{tx.balance_after.toLocaleString()} đ</td>
                <td className="py-2 px-4">{tx.description || ''}</td>
                <td className="py-2 px-4">{new Date(tx.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!loading && transactions.length === 0) && (
          <div className="text-center text-muted-foreground mt-10">You have no transactions yet.</div>
        )}
      </div>
    </div>
  );
}