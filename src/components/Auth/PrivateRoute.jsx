import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  if (!token || !role) {
    return <Navigate to="student/login" replace />;
  }

  return children;
};

export default PrivateRoute;
