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
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("directusUser");
      localStorage.removeItem("appUser");
      window.location.href = "/login";
    }
    return Promise.reject(handleApiError(error));
  }
);

// Create and export the data provider
export const dataProvider: DataProvider = {
  // Method to get a list of resources
  getList: async ({ resource, pagination, sorters, filters }) => {
    const url = `/${resource}`;

    // Build query parameters
    const params: any = {};

    // Handle pagination
    if (pagination) {
      const { currentPage, pageSize } = pagination as any;
      params.page = currentPage;
      params.limit = pageSize;
    }

    console.log("Pagination params:", params);

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
      params.filter = {};
      
      // Check if we have multiple filters for email, first_name, or last_name
      const nameFilters = filters.filter((f: any) => 
        f.field === "email" || f.field === "first_name" || f.field === "last_name"
      );
      
      const otherFilters = filters.filter((f: any) => 
        f.field !== "email" && f.field !== "first_name" && f.field !== "last_name"
      );
      
      // Handle name filters with OR condition
      if (nameFilters.length > 0) {
        const orConditions = nameFilters.map((filter: any) => {
          const { field, operator, value } = filter;
          const directusOperator =
            operator === "contains"
              ? "_contains"
              : operator === "eq"
              ? "_eq"
              : operator === "ne"
              ? "_neq"
              : operator === "gt"
              ? "_gt"
              : operator === "lt"
              ? "_lt"
              : "_eq";
          return { [field]: { [directusOperator]: value } };
        });
        
        params.filter = {
          _or: orConditions,
        };
      }
      
      // Handle other filters with AND condition
      otherFilters.forEach((filter) => {
        const { field, operator, value } = filter as any;
        if (field && value !== undefined && value !== null) {
          const directusOperator =
            operator === "contains"
              ? "_contains"
              : operator === "eq"
              ? "_eq"
              : operator === "ne"
              ? "_neq"
              : operator === "gt"
              ? "_gt"
              : operator === "lt"
              ? "_lt"
              : "_eq";
          
          // If we already have a filter with _or, merge with it
          if (params.filter._or) {
            params.filter = {
              _and: [params.filter, { [field]: { [directusOperator]: value } }]
            };
          } else {
            params.filter[field] = { [directusOperator]: value };
          }
        }
      });
    }

    try {
      console.log("🔍 Query params sent:", params);
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
