import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCheckAuthQuery } from '../../api/adminApi';

const Protect = ({ children }) => {
  const { data, isLoading, isError } = useCheckAuthQuery();

  if (isLoading) return <div>Loading...</div>;

  if (isError || !data?.success) {
    // If backend says not authorized
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};


export default Protect;