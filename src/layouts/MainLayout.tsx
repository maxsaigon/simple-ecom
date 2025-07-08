import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/shared/NavBar';

export default function MainLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        {children || <Outlet />}
      </main>
    </div>
  );
}