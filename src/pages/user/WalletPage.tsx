import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Loader } from 'lucide-react';
import { addFund } from '../../api/addFundApi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function WalletPage() {
  const { user, loading, reloadProfile } = useAuth();
  const [amount, setAmount] = useState(0);
  const [adding, setAdding] = useState(false);

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <Loader className="animate-spin mr-2" /> Loading wallet balance...
    </div>
  );
  if (!user) return null;

  const handleAddFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return toast.error('Amount must be greater than 0');
    setAdding(true);
    try {
      await addFund(amount);
      await reloadProfile();
      toast.success('Funds added successfully!');
      setAmount(0);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add funds');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center border border-accent/40 mb-6">
        <div className="text-2xl font-bold mb-2">Wallet Balance</div>
        <div className="text-4xl font-extrabold text-primary mb-4">{user.wallet_balance.toLocaleString()} đ</div>
        <div className="text-muted-foreground">Hello, <span className="font-semibold">{user.full_name || user.id}</span></div>
      </div>
      <form onSubmit={handleAddFund} className="bg-white rounded-xl shadow p-8 flex flex-col gap-4 border border-accent/40">
        <div className="font-semibold text-lg mb-2">Add Funds (test)</div>
        <Input type="number" min={1} value={amount} onChange={e => setAmount(Number(e.target.value))} placeholder="Enter amount to add" required />
        <Button type="submit" disabled={adding}>{adding ? 'Adding...' : 'Add Funds'}</Button>
        <div className="text-xs text-muted-foreground">Test feature, funds will be added instantly. Stripe, PayPal, Crypto coming soon.</div>
      </form>
    </div>
  );
}