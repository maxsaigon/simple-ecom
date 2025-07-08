import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/shared/AdminSidebar';

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children || <Outlet />}
      </main>
    </div>
  );
}