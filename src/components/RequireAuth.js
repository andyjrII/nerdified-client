import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  const email = localStorage.getItem("STUDENT_EMAIL");

  return (accessToken || auth.accessToken) && email ? (
    <Outlet />
  ) : (
    <Navigate to='/signin' state={{ from: location }} replace />
  );
};

export default RequireAuth;
