import { type DataProvider } from "@refinedev/core";
import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

// Define the API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance for making API calls
const axiosInstance = axios.create({
  baseURL: API_URL,
  // Don't set default Content-Type to allow FormData to set it automatically
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

// Add response interceptor to handle common errors
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosInstance.post("/auth/refresh");
        const { token } = response.data.data;

        if (token) {
          localStorage.setItem("token", token);
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          processQueue(null, token);
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // If refresh token fails, clear everything and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("directusUser");
        localStorage.removeItem("appUser");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(handleApiError(error));
  }
);

// Create and export the data provider
export const dataProvider: DataProvider = {
  // Method to get a list of resources
  getList: async ({ resource, pagination, sorters, filters }) => {
    const url = `/${resource}`;
    const params: any = {};

    // Handle pagination
    if (pagination) {
      const { currentPage, pageSize } = pagination as any;
      params.page = currentPage;
      params.limit = pageSize;
    }

    // console.log("Pagination params:", params);

    // ✅ Handle sorting for Directus
    if (sorters && sorters.length > 0) {
      const sort = sorters[0] as {
        field?: string;
        order?: "asc" | "desc" | string;
      };
      if (sort.field) {
        params.sort =
          sort.order === "desc" || sort.order === "descend"
            ? `-${sort.field}` // Directus: prefix '-' means descending
            : sort.field;
      }
    }

    // Handle filters
    if (filters && filters.length > 0) {
      const andFilters: any[] = [];

      // Mapping Refine → Directus operators
      const opMap: Record<string, string> = {
        contains: "_contains",
        eq: "_eq",
        ne: "_neq",
        gt: "_gt",
        lt: "_lt",
        gte: "_gte", // ← NEW: now supports date range & min/max
        lte: "_lte", // ← NEW: now supports date range & min/max
      };

      // 1. Name-search OR (email, first_name, last_name) – keep existing behavior
      const nameFilters = filters.filter(
        (f: any) =>
          f.field === "email" ||
          f.field === "first_name" ||
          f.field === "last_name"
      );

      if (nameFilters.length > 0) {
        const orConditions = nameFilters.map((f: any) => {
          const directusOp = opMap[f.operator] ?? "_eq";
          return { [f.field]: { [directusOp]: f.value } };
        });
        andFilters.push({ _or: orConditions });
      }

      // 2. All other filters (status, title, date_created, required_participants, etc.)
      const otherFilters = filters.filter(
        (f: any) => !["email", "first_name", "last_name"].includes(f.field)
      );

      otherFilters.forEach((f: any) => {
        if (f.value === undefined || f.value === null) return;
        const directusOp = opMap[f.operator] ?? "_eq";
        andFilters.push({ [f.field]: { [directusOp]: f.value } });
      });

      // 3. Build final filter object
      if (andFilters.length === 1) {
        params.filter = andFilters[0];
      } else if (andFilters.length > 1) {
        params.filter = { _and: andFilters };
      }
      // (if empty → no filter param)
    }

    try {
      // console.log("🔍 Query params sent:", params);
      const response = await axiosInstance.get(url, { params });

      return {
        data: response.data.data,
        total:
          response.data.meta?.total ||
          response.data.total ||
          response.data.data.length,
      };
    } catch (error: any) {
      throw error; // Error is already processed by handleApiError
    }
  },

  // Method to get a single resource by ID
  getOne: async ({ resource, id, meta }) => {
    try {
      const response = await axiosInstance.get(`/${resource}/${id}`);

      return {
        data: response.data.data,
      };
    } catch (error: any) {
      throw error; // Error is already processed by handleApiError
    }
  },

  // Method to create a new resource
  create: async ({ resource, variables, meta }) => {
    try {
      const response = await axiosInstance.post(`/${resource}`, variables);

      return {
        data: response.data.data,
      };
    } catch (error: any) {
      throw error; // Error is already processed by handleApiError
    }
  },

  // Method to update a resource
  update: async ({ resource, id, variables, meta }) => {
    try {
      const response = await axiosInstance.patch(
        `/${resource}/${id}`,
        variables
      );

      return {
        data: response.data.data,
      };
    } catch (error: any) {
      throw error; // Error is already processed by handleApiError
    }
  },

  // Method to delete a resource
  deleteOne: async ({ resource, id, variables, meta }) => {
    try {
      await axiosInstance.delete(`/${resource}/${id}`);

      return {
        data: { id } as any,
      };
    } catch (error: any) {
      throw error; // Error is already processed by handleApiError
    }
  },

  // Method to get API URL
  getApiUrl: () => API_URL,

  // Custom method to handle data export
  custom: async ({ url, method, payload, query, headers, meta }) => {
    try {
      // Check if url is defined before using startsWith
      let requestUrl =
        url && url.startsWith("/") ? `${API_URL}${url}` : url || "";

      const config: any = {
        method,
        url: requestUrl,
        headers: {},
      };

      // Add query parameters if provided
      if (query) {
        config.params = query;
      }

      // Handle different payload types
      if (payload) {
        // Debug payload type
        console.log("Payload type:", typeof payload);
        console.log("Is FormData:", payload instanceof FormData);

        // If payload is FormData, don't set Content-Type header
        if (payload instanceof FormData) {
          console.log("FormData entries before sending:");
          for (let pair of payload.entries()) {
            console.log(pair[0] + ": ", pair[1]);
          }
          config.data = payload;
          delete config.headers["Content-Type"];
        } else {
          config.data = payload;
          // Set Content-Type for JSON payloads
          config.headers["Content-Type"] = "application/json";
        }
      }

      // Add custom headers if provided
      if (headers) {
        config.headers = { ...config.headers, ...headers };
      }

      const response = await axiosInstance(config);

      return {
        data: response.data,
      };
    } catch (error: any) {
      throw error; // Error is already processed by handleApiError
    }
  },

  // Optional methods that can be implemented if needed
  getMany: async ({ resource, ids, meta }) => {
    try {
      const response = await axiosInstance.get(`/${resource}`, {
        params: { ids: ids.join(",") },
      });

      return {
        data: response.data.data,
      };
    } catch (error: any) {
      throw error; // Error is already processed by handleApiError
    }
  },

  createMany: async ({ resource, variables, meta }) => {
    try {
      const response = await axiosInstance.post(`/${resource}/batch`, {
        data: variables,
      });

      return {
        data: response.data.data,
      };
    } catch (error: any) {
      throw error; // Error is already processed by handleApiError
    }
  },

  updateMany: async ({ resource, ids, variables, meta }) => {
    try {
      const response = await axiosInstance.patch(`/${resource}/batch`, {
        ids,
        data: variables,
      });

      return {
        data: response.data.data,
      };
    } catch (error: any) {
      throw error; // Error is already processed by handleApiError
    }
  },

  deleteMany: async ({ resource, ids, variables, meta }) => {
    try {
      await axiosInstance.delete(`/${resource}/batch`, {
        data: { ids },
      });

      return {
        data: ids.map((id) => ({ id })) as any,
      };
    } catch (error: any) {
      throw error; // Error is already processed by handleApiError
    }
  },
};
