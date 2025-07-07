import React from "react";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

function RiderRoute({ children }) {
  const { user, loading } = useAuth();
  const { role, isLoading } = useUserRole();
  if (loading || isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!user || role !== "rider") {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden" replace />
    );
  }
  return children;
}

export default RiderRoute;
