import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

const ProtectedRoute = ({ requiredStatus = "authenticated", requiredRole }) => {
  const { user, status } = useAuth();

  // Show a loading state if authentication is still being determined
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Handle unauthenticated user trying to access restricted routes
  if (requiredStatus === "authenticated" && status === "unauthenticated") {
    return <Navigate to="/auth/signIn" replace />;
  }

  // Handle authenticated user trying to access unauthenticated-only routes
  if (requiredStatus === "unauthenticated" && status === "authenticated") {
    const redirectPath = user?.role === "admin" ? "/admin" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  // Handle role-based access control
  if (requiredRole && user?.role !== requiredRole) {
    const redirectPath = user?.role === "admin" ? "/admin" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  // If all conditions are satisfied, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
