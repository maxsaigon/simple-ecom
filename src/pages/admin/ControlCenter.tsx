import React from 'react';
import { Link } from 'react-router-dom';

export default function ControlCenter() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
      <div className="flex flex-col gap-4">
        <Link className="p-4 rounded bg-blue-100 hover:bg-blue-200" to="/admin/users">User Management</Link>
        <Link className="p-4 rounded bg-blue-100 hover:bg-blue-200" to="/admin/services">Service Management</Link>
        <Link className="p-4 rounded bg-blue-100 hover:bg-blue-200" to="/admin/orders">Order Management</Link>
        <Link className="p-4 rounded bg-blue-100 hover:bg-blue-200" to="/admin/transaction-manager">Transaction Management</Link>
      </div>
    </div>
  );
}
