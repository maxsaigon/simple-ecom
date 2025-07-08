import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'admin' | 'user';
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-40">Đang kiểm tra quyền truy cập...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={role === 'admin' ? '/' : '/admin/control'} replace />;
  return <>{children}</>;
}
