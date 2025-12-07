import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  // Nếu chưa đăng nhập -> redirect về SignIn
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Nếu yêu cầu role cụ thể (vd: admin) nhưng user không có role đó
  if (requiredRole && user.role !== requiredRole) {
    // Admin cố vào trang user -> về dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin/overview" replace />;
    }
    // User thường cố vào trang admin -> về trang chủ
    return <Navigate to="/" replace />;
  }

  return children;
}
