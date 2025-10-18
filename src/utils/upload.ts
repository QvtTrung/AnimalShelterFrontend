
import axios from "axios";

// Define the API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance for file uploads
const uploadAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor to include auth token if available
uploadAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to upload files
export const uploadFile = async (file: File, resource: string, folder: string = "general") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  try {
    const response = await uploadAxios.post(`/${resource}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to upload file");
  }
};

// Function to delete uploaded files
export const deleteFile = async (id: string, resource: string) => {
  try {
    await uploadAxios.delete(`/${resource}/upload/${id}`);
    return true;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete file");
  }
};

// Function to get file upload URL
export const getFileUrl = (fileId: string): string => {
  return `${API_URL}/files/${fileId}`;
};

// Function to create a custom upload request for the data provider
export const createUploadRequest = (resource: string, file: File, folder?: string) => {
  const formData = new FormData();
  formData.append("file", file);

  if (folder) {
    formData.append("folder", folder);
  }

  return {
    url: `/${resource}/upload`,
    method: "post",
    payload: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
};
