import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link to="/admin/control" className="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/users" className="block py-2 px-4 rounded hover:bg-gray-700">User Management</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/services" className="block py-2 px-4 rounded hover:bg-gray-700">Service Management</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/orders" className="block py-2 px-4 rounded hover:bg-gray-700">Order Management</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/transaction-manager" className="block py-2 px-4 rounded hover:bg-gray-700">Transaction Management</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}