import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    return <Navigate to="/dashboard/inicio" replace />;
  }
  return children;
}
