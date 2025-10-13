import { type AuthProvider } from "@refinedev/core";
import axios from "axios";

// Define the API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance for making API calls
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to include auth token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      // Store the token and user data
      const { directusUser, user, token } = response.data.data;

      if (token) {
        localStorage.setItem("token", token);
      }

      // Store directus user data for authentication
      if (directusUser) {
        localStorage.setItem("directusUser", JSON.stringify(directusUser));
      }

      // Store application user data for app-specific information
      if (user) {
        localStorage.setItem("appUser", JSON.stringify(user));
      }

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "Login failed",
          message: error.response?.data?.message || "Invalid email or password",
        },
      };
    }
  },

  register: async ({ email, password, first_name, last_name }) => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        email,
        password,
        first_name,
        last_name,
      });

      // Store the token and user data
      const { directusUser, user, token } = response.data.data;

      if (token) {
        localStorage.setItem("token", token);
      }

      // Store directus user data for authentication
      if (directusUser) {
        localStorage.setItem("directusUser", JSON.stringify(directusUser));
      }

      // Store application user data for app-specific information
      if (user) {
        localStorage.setItem("appUser", JSON.stringify(user));
      }

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "Registration failed",
          message: error.response?.data?.message || "Something went wrong",
        },
      };
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error: any) {
      // Continue with logout even if API call fails
      console.error("Logout API call failed:", error);
    }

    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("directusUser");
    localStorage.removeItem("appUser");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem("token");

    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      error: {
        name: "Not authenticated",
        message: "You are not authenticated",
      },
      logout: true,
      redirectTo: "/login",
    };
  },

  onError: async (error: any) => {
    if (error?.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },

  // getIdentity: async () => {
  //   const directusUserStr = localStorage.getItem("directusUser");
  //   const appUserStr = localStorage.getItem("appUser");

  //   if (directusUserStr) {
  //     const directusUser = JSON.parse(directusUserStr);
  //     const appUser = appUserStr ? JSON.parse(appUserStr) : null;

  //     // Return user identity in the format expected by Refine
  //     return {
  //       id: directusUser.id,
  //       name: `${directusUser.first_name} ${directusUser.last_name}`,
  //       email: directusUser.email,
  //       avatar: appUser?.avatar, // Use avatar from app user if available
  //     };
  //   }

  //   return null;
  // },

  // updatePassword: async ({ currentPassword, newPassword }) => {
  //   try {
  //     await axiosInstance.post("/auth/update-password", {
  //       currentPassword,
  //       newPassword,
  //     });

  //     return {
  //       success: true,
  //     };
  //   } catch (error: any) {
  //     return {
  //       success: false,
  //       error: {
  //         name: "Update password failed",
  //         message: error.response?.data?.message || "Failed to update password",
  //       },
  //     };
  //   }
  // },

  // forgotPassword: async ({ email }) => {
  //   try {
  //     await axiosInstance.post("/auth/forgot-password", { email });

  //     return {
  //       success: true,
  //     };
  //   } catch (error: any) {
  //     return {
  //       success: false,
  //       error: {
  //         name: "Forgot password failed",
  //         message:
  //           error.response?.data?.message || "Failed to send reset email",
  //       },
  //     };
  //   }
  // },

  // getPermissions: async () => {
  //   // If your backend returns permissions, you can fetch and return them here
  //   // For now, return an empty array or a default permission
  //   return [];
  // },
};
