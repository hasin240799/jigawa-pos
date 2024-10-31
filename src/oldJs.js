import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import ViewProducts from './pages/ViewProducts';
import AddStock from './pages/AddStock';
import ViewStocks from './pages/ViewStocks';
import ViewShops from './pages/ViewShops';
import ProductItem from './pages/ProductItem';
import Customer from './pages/Customers';
import UsersForm from './pages/UsersForm';
import ShopProduct from './pages/ShopProducts';
import SalesForm from './pages/SalesForm';
import UploadNetSal from './pages/UploadNetSal';
import Repayment from './pages/Repayment';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Preloader from './components/Preloader';
import { LoadingProvider } from './context/LoadingContext';
import SalesView from './pages/SalesView';
import Receipt from './pages/Receipt';
import Verify from './pages/Verify';
import VerifyView from './pages/VerifyViews';
import ShopStocks from './pages/ShopStocks';
import StoreStocks from './pages/StoreStocks';
import VerifyCustomer from './pages/verifyCustomer';
import ChangePasswordPage from './pages/auth/ChangePassword';
import StoreSupply from './pages/StoreSupply';
import ShopSupply from './pages/ShopSupply';
import Reprint from './pages/Reprint';
import RepayList from './pages/RepayList';
import RealtimeSales from './pages/RealtimeSales';
import BiziUsersForm from './pages/BiziUsersForm';
import CCTV from './pages/CCTV';
import RealtimeStocks from './pages/RealtimeStocks';
import FundWallet from './pages/FundWallet';


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

  return (


      <Router>
       <Layout>
        {loading && <Preloader />} {/* Show Preloader while loading */}
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

            <Route path="/dashboard" element={<ProtectedRoute ><Dashboard /></ProtectedRoute>} />
            <Route path="/product/add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path="/product/list" element={<ProtectedRoute><ViewProducts /></ProtectedRoute>} />
            <Route path="/stock/add" element={<ProtectedRoute><AddStock /></ProtectedRoute>} />
            <Route path="/stock/view" element={<ProtectedRoute><ViewStocks /></ProtectedRoute>} />
            <Route path="/shops/view" element={<ProtectedRoute><ViewShops /></ProtectedRoute>} />
            <Route path="/product/item" element={<ProtectedRoute><ProductItem /></ProtectedRoute>} />
            <Route path="/customer/add" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
            <Route path="/users/add" element={<ProtectedRoute><UsersForm /></ProtectedRoute>} />
            <Route path="/bizi-users/add" element={<ProtectedRoute><BiziUsersForm/></ProtectedRoute>} />
            <Route path="/shop/purchase" element={<ProtectedRoute><ShopProduct /></ProtectedRoute>} />
            <Route path="/sales/form" element={<ProtectedRoute><SalesForm /></ProtectedRoute>} />
            <Route path="/sales/view" element={<ProtectedRoute><SalesView /></ProtectedRoute>} />
            <Route path="/upload/net-salary" element={<ProtectedRoute><UploadNetSal /></ProtectedRoute>} />
            <Route path="/upload/repayment" element={<ProtectedRoute><Repayment /></ProtectedRoute>} />
            <Route path="/sales/receipt/:id" element={<ProtectedRoute><Receipt /></ProtectedRoute>} />
            <Route path="/sales/verify" element={<ProtectedRoute><Verify /></ProtectedRoute>} />
            <Route path="/verify/view" element={<ProtectedRoute><VerifyView /></ProtectedRoute>} />
            <Route path="/shops/stocks" element={<ProtectedRoute><ShopStocks/></ProtectedRoute>} />
            <Route path="/store/stocks" element={<ProtectedRoute><StoreStocks/></ProtectedRoute>} />
            <Route path="/store/supply" element={<ProtectedRoute><StoreSupply/></ProtectedRoute>} />
            <Route path="/shop/supply" element={<ProtectedRoute><ShopSupply/></ProtectedRoute>} />
            <Route path="/verify/customer" element={<ProtectedRoute><VerifyCustomer/></ProtectedRoute>} />
            <Route path="/sales/reprint" element={<ProtectedRoute><Reprint/></ProtectedRoute>} />
            <Route path="/loan/repay" element={<ProtectedRoute><RepayList/></ProtectedRoute>} />
            <Route path="/sales/realtime" element={<ProtectedRoute><RealtimeSales /></ProtectedRoute>} />
            <Route path="/cctv/map" element={<ProtectedRoute><CCTV /></ProtectedRoute>} />
            <Route path="/stocks/realtime" element={<ProtectedRoute><RealtimeStocks /></ProtectedRoute>} />
            <Route path="/user/fund-wallet" element={<ProtectedRoute><FundWallet /></ProtectedRoute>} />
            <Route path="/user/change-password" element={<ProtectedRoute><ChangePasswordPage/></ProtectedRoute>} />
        </Routes>
        </Layout>
      </Router>

  );
}

export default App;
