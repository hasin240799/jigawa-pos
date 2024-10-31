import React from 'react';
import { Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import AddProduct from '../pages/AddProduct';
import ViewProducts from '../pages/ViewProducts';
import AddStock from '../pages/AddStock';
import ViewStocks from '../pages/ViewStocks';
import ViewShops from '../pages/ViewShops';
import ProductItem from '../pages/ProductItem';
import Customer from '../pages/Customers';
import UsersForm from '../pages/UsersForm';
import ShopProduct from '../pages/ShopProducts';
import SalesForm from '../pages/SalesForm';
import UploadNetSal from '../pages/UploadNetSal';
import Repayment from '../pages/Repayment';
import ProtectedRoute from '../components/ProtectedRoute';

const AuthenticatedRoutes = () => (
  <>
    <Route element={<Layout />}>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/product/add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
      <Route path="/product/list" element={<ProtectedRoute><ViewProducts /></ProtectedRoute>} />
      <Route path="/stock/add" element={<ProtectedRoute><AddStock /></ProtectedRoute>} />
      <Route path="/stock/view" element={<ProtectedRoute><ViewStocks /></ProtectedRoute>} />
      <Route path="/shops/view" element={<ProtectedRoute><ViewShops /></ProtectedRoute>} />
      <Route path="/product/item" element={<ProtectedRoute><ProductItem /></ProtectedRoute>} />
      <Route path="/customer/add" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
      <Route path="/users/add" element={<ProtectedRoute><UsersForm /></ProtectedRoute>} />
      <Route path="/shop/purchase" element={<ProtectedRoute><ShopProduct /></ProtectedRoute>} />
      <Route path="/sales/form" element={<ProtectedRoute><SalesForm /></ProtectedRoute>} />
      <Route path="/upload/net-salary" element={<ProtectedRoute><UploadNetSal /></ProtectedRoute>} />
      <Route path="/upload/repayment" element={<ProtectedRoute><Repayment /></ProtectedRoute>} />
    </Route>
  </>
);

export default AuthenticatedRoutes;
