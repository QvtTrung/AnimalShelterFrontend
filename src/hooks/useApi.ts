
import { useCustom, useList, useOne, useCreate, useUpdate, useDelete } from "@refinedev/core";
import { uploadFile, createUploadRequest } from "../utils/upload";
import axios from "axios";

// Custom hook for making API requests
export const useApi = () => {
  // Hook for fetching a list of items
  const useApiList = (resource: string, config?: any) => {
    return useList({
      resource,
      ...config,
    });
  };

  // Hook for fetching a single item
  const useApiOne = (resource: string, id: string, config?: any) => {
    return useOne({
      resource,
      id,
      ...config,
    });
  };

  // Hook for creating an item
  const useApiCreate = (resource: string, config?: any) => {
    return useCreate({
      resource,
      ...config,
    });
  };

  // Hook for updating an item
  const useApiUpdate = (resource: string, id: string, config?: any) => {
    return useUpdate({
      resource,
      id,
      ...config,
    });
  };

  // Hook for deleting an item
  const useApiDelete = (resource: string, id: string, config?: any) => {
    return useDelete({
      resource,
      id,
      ...config,
    });
  };

  // Hook for custom API requests
  const useApiCustom = (url: string, method: string, config?: any) => {
    return useCustom({
      url,
      method,
      ...config,
    });
  };

  // Hook for file uploads
  const useFileUpload = (resource: string, folder?: string) => {
    const uploadFileHandler = async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        if (folder) {
          formData.append("folder", folder);
        }

        // Create a direct axios request for file upload
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        const token = localStorage.getItem("token");

        const response = await axios.post(`${API_URL}/${resource}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token && { Authorization: `Bearer ${token}` })
          }
        });

        return response?.data;
      } catch (error: any) {
        console.error("File upload failed:", error);
        throw error;
      }
    };

    return {
      uploadFile: uploadFileHandler,
      isLoading: false, // Simplified for now
    };
  };

  return {
    useApiList,
    useApiOne,
    useApiCreate,
    useApiUpdate,
    useApiDelete,
    useApiCustom,
    useFileUpload,
  };
};
