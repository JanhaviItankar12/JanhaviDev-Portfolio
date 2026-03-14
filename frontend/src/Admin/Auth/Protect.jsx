import React from 'react';
import { Navigate } from 'react-router-dom';

const Protect = ({ children }) => {
  const token = localStorage.getItem('adminToken'); 

  if (!token) {
    // If not logged in, redirect to login
    return <Navigate to="/admin/login" replace />;
  }

  return children; 
};

export default Protect;