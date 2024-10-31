// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   const userRoles = localStorage.getItem('role'); // Assume roles are stored in localStorage

  //   if (!token) {
  //     navigate('/login'); // Redirect to login if not authenticated
  //   } else if (userRoles && allowedRoles?.some(role => userRoles?.includes(role))) {
  //     setHasAccess(true); // Grant access if user has an allowed role
  //   } else {
  //     navigate('/unauthorized'); // Redirect if user lacks the required role
  //   }
  // }, [navigate, allowedRoles]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRoles = localStorage.getItem('role'); // Assume roles are stored in localStorage

    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
    } 
  }, [navigate]);


  // return hasAccess ? children : null; // Render children if access is granted
  return children; // Render children if access is granted
};

export default ProtectedRoute;
