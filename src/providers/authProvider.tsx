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

  getIdentity: async () => {
    const directusUserStr = localStorage.getItem("directusUser");
    const appUserStr = localStorage.getItem("appUser");

    if (directusUserStr) {
      const directusUser = JSON.parse(directusUserStr);
      const appUser = appUserStr ? JSON.parse(appUserStr) : null;
      // Return user identity in the format expected by Refine
      const identity = {
        id: directusUser.id,
        first_name: directusUser.first_name || "",
        last_name: directusUser.last_name || "",
        name: `${directusUser.first_name || ""} ${
          directusUser.last_name || ""
        }`.trim(),
        email: directusUser.email || "",
        avatar: appUser?.avatar || null,
        role: appUser?.role || "User",
        status: directusUser.status || "active",
        date_created: directusUser.date_created || new Date().toISOString(),
        date_updated: directusUser.date_updated || new Date().toISOString(),
        language: directusUser.language || "English",
        timezone: directusUser.timezone || "UTC",
      };

      console.log("getIdentity - returning identity:", identity);
      return identity;
    }

    return null;
  },

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

  getPermissions: async () => {
    // Try to get permissions from localStorage or fetch from API
    const directusUserStr = localStorage.getItem("directusUser");

    console.log("getPermissions - directusUserStr:", directusUserStr);

    if (directusUserStr) {
      const directusUser = JSON.parse(directusUserStr);
      console.log("getPermissions - directusUser:", directusUser);

      // Get role name from appUser
      const appUserStr = localStorage.getItem("appUser");
      const appUser = appUserStr ? JSON.parse(appUserStr) : null;
      const permissions = [appUser?.role || "User"];
      console.log("getPermissions - returning permissions:", permissions);
      return permissions;
    }

    console.log(
      "getPermissions - no directus user found, returning empty array"
    );
    return [];
  },
};
