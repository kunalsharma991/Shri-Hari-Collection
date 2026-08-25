import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

// Redirects to admin login if user is not an admin
function AdminRoute({ children }) {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
