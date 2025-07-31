// src/components/PrivateRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  console.log("PrivateRoute", userInfo);
  return userInfo ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
