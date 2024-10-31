import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';

const PublicRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);

export default PublicRoutes;
