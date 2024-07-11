import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  const email = localStorage.getItem("ADMIN_EMAIL");

  return (accessToken || auth?.accessToken) && email ? (
    <Outlet />
  ) : (
    <Navigate to='/admin_signin' state={{ from: location }} replace />
  );
};

export default AdminRequireAuth;
