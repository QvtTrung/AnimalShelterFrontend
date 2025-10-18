
import { message } from "antd";

// Error types
export interface ApiError {
  name: string;
  message: string;
  statusCode?: number;
  details?: any;
}

// Default error messages
const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: "Bad request. Please check your input.",
  401: "You are not authorized to perform this action.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "There was a conflict with the current state of the resource.",
  422: "The provided data is invalid.",
  429: "Too many requests. Please try again later.",
  500: "An unexpected error occurred. Please try again.",
  502: "The server encountered an error. Please try again later.",
  503: "The service is currently unavailable. Please try again later.",
  504: "The request timed out. Please try again.",
};

// Function to handle API errors consistently
export const handleApiError = (error: any): ApiError => {
  // If the error is already in our expected format, return it
  if (error.name && error.message) {
    return error as ApiError;
  }

  // Extract error information from axios error
  if (error.response) {
    const { status, data } = error.response;

    // Try to get the error message from the response
    let errorMessage = data?.message || data?.error || DEFAULT_ERROR_MESSAGES[status] || "An unknown error occurred.";

    // If there are validation errors, include them
    if (data?.errors && Array.isArray(data.errors)) {
      errorMessage = data.errors.map((e: any) => e.message || e).join(", ");
    }

    return {
      name: data?.name || "ApiError",
      message: errorMessage,
      statusCode: status,
      details: data,
    };
  }

  // Network error
  if (error.request) {
    return {
      name: "NetworkError",
      message: "Network error. Please check your connection and try again.",
      statusCode: 0,
    };
  }

  // Unknown error
  return {
    name: "UnknownError",
    message: error.message || "An unknown error occurred.",
    statusCode: 0,
  };
};

// Function to show error message to the user
export const showErrorMessage = (error: any) => {
  const apiError = handleApiError(error);
  message.error(apiError.message);

  // Log the full error for debugging
  console.error("API Error:", apiError);

  return apiError;
};

// Function to show success message
export const showSuccessMessage = (messageText: string) => {
  message.success(messageText);
};

// Function to show warning message
export const showWarningMessage = (messageText: string) => {
  message.warning(messageText);
};

// Function to show info message
export const showInfoMessage = (messageText: string) => {
  message.info(messageText);
};
