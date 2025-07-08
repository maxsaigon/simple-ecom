import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { signOut } from '../../api/authApi';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function NavBar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Đã đăng xuất!');
      navigate('/login');
    } catch (err: any) {
      toast.error('Lỗi đăng xuất');
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-blue-600 text-white">
      <div className="font-bold text-lg">
        <Link to="/">Social.D0o.fun</Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/">Home</Link>
        {user && <Link to="/wallet">Wallet</Link>}
        {user && <Link to="/orders">Orders</Link>}
        {user && <Link to="/transactions">Transactions</Link>}
        {user ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}