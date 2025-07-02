import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!user) {
    return <Navigate state={{ from: location.pathname }} to="/login" replace />;
  }
  return children;
}

export default PrivateRoute;
