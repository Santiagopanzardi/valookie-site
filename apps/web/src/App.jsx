
import React from 'react';
import { Route, Routes, Navigate, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import FAQPage from './pages/FAQPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import CartaPage from './pages/CartaPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import { AdminLayout } from './admin/AdminLayout.jsx';
import { DashboardPage } from './admin/pages/DashboardPage.jsx';
import { OrdersPage } from './admin/pages/OrdersPage.jsx';
import { OrderDetailPage } from './admin/pages/OrderDetailPage.jsx';
import { ProductsPage } from './admin/pages/ProductsPage.jsx';
import { ProductFormPage } from './admin/pages/ProductFormPage.jsx';
import { CustomersPage } from './admin/pages/CustomersPage.jsx';
import { CustomerDetailPage } from './admin/pages/CustomerDetailPage.jsx';
import { InventoryPage } from './admin/pages/InventoryPage.jsx';
import { CashRegisterPage } from './admin/pages/CashRegisterPage.jsx';
import { ExpensesPage } from './admin/pages/ExpensesPage.jsx';
import { ReportsPage } from './admin/pages/ReportsPage.jsx';
import { RecipesPage } from './admin/pages/RecipesPage.jsx';
import { RecipeFormPage } from './admin/pages/RecipeFormPage.jsx';
import { PlaceholderPage } from './admin/pages/PlaceholderPage.jsx';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/flipbook/carta-valookie" element={<CartaPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrderDetailPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/new" element={<ProductFormPage />} />
              <Route path="products/:id/edit" element={<ProductFormPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/:id" element={<CustomerDetailPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="cash-register" element={<CashRegisterPage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="recipes" element={<RecipesPage />} />
              <Route path="recipes/new" element={<RecipeFormPage />} />
              <Route path="recipes/:id/edit" element={<RecipeFormPage />} />
            </Route>
          </Routes>
          <Toaster />
          <WhatsAppButton />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
