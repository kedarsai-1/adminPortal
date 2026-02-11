import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import React from 'react';
import './index.css'


// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Businesses from './pages/Businesses';
import Products from './pages/Products';
import Lots from './pages/Lots';
import Invoices from './pages/Invoices';
import Ledgers from './pages/Ledgers';
import Inventory from './pages/Inventory';
import Prices from './pages/Prices';
import Services from './pages/Services';
import Settings from './pages/Settings';

// Layout
import MainLayout from './components/layout/MainLayout';
import LoadingScreen from './components/common/LoadingScreen';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};


// Public Route Component (redirects if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="businesses" element={<Businesses />} />
          <Route path="products" element={<Products />} />
          <Route path="lots" element={<Lots />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="ledgers" element={<Ledgers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="prices" element={<Prices />} />
          <Route path="services" element={<Services />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;