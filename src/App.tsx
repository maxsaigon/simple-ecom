import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './contexts/AuthProvider';
import AdminLayout from './layouts/AdminLayout';
import MainLayout from './layouts/MainLayout';
import ControlCenter from './pages/admin/ControlCenter';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ServiceManager from './pages/admin/ServiceManager';
import UserManagement from './pages/admin/UserManagement';
import WalletPage from './pages/user/WalletPage';
import MyOrdersPage from './pages/user/MyOrdersPage';
import HomePage from './pages/user/HomePage';
import OrderManager from './pages/admin/OrderManager';
import OrderServicePage from './pages/user/OrderServicePage';
import TransactionPage from './pages/user/TransactionPage';
import TransactionManager from './pages/admin/TransactionManager';



function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/order/:serviceId" element={<OrderServicePage />} />
            <Route path="/transactions" element={<TransactionPage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="control" element={<ControlCenter />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="services" element={<ServiceManager />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="transaction-manager" element={<TransactionManager />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;