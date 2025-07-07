import React from "react";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import { Navigate } from "react-router";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const { role, isLoading } = useUserRole();
  if (loading || isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!user || role !== "admin") {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden" replace />
    );
  }
  return children;
}

export default AdminRoute;
