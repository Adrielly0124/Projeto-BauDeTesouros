import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../config/firebase";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = auth.currentUser;

  // 🔥 Se NÃO estiver logado → manda para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
