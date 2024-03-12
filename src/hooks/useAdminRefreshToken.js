import useAuth from "./useAuth";
import axios from "../api/axios";

const useAdminRefreshToken = () => {
  const { setAuth } = useAuth();
  const refreshToken = localStorage.getItem("ADMIN_REFRESH_TOKEN");

  const refresh = async () => {
    try {
      const response = await axios.post("auth/admin_refresh", null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        withCredentials: true,
      });

      setAuth((prevAuth) => ({
        ...prevAuth,
        accessToken: response?.data?.access_token,
      }));
      localStorage.setItem("ADMIN_ACCESS_TOKEN", response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  };

  return refresh;
};

export default useAdminRefreshToken;
