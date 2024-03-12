import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "./useAuth";

const useAdminLogout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const email = localStorage.getItem("ADMIN_EMAIL");

  const logout = async () => {
    try {
      await axios.post(
        "auth/signout",
        {
          params: {
            email,
          },
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem("ADMIN_REFRESH_TOKEN");
    localStorage.removeItem("ADMIN_ACCESS_TOKEN");
    localStorage.removeItem("ADMIN_EMAIL");
    localStorage.removeItem("ROLE");
    setAuth({});
    navigate("/", { replace: true });
  };

  return logout;
};

export default useAdminLogout;
