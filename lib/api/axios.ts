import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  console.error("⚠️ NEXT_PUBLIC_BASE_URL is not set in environment variables!");
  console.error("Please set NEXT_PUBLIC_BASE_URL in your .env.local file");
  console.error("Using fallback: http://localhost:3100/api");
}

const axiosInstance = axios.create({
  baseURL: BASE_URL || "http://localhost:3100/api",
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log("✅ API Response:", response.config.url, response.status);
    }
    return response;
  },
  (error) => {
    // Skip noisy logging for signout (local logout proceeds anyway)
    const url = String(error?.config?.url ?? "");
    if (!url.includes("signout")) {
      console.error("❌ API Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

export const axiosPrivate = axios.create({
  baseURL: BASE_URL || "http://localhost:3100/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
