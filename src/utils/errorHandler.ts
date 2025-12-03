
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
  400: "Yêu cầu không hợp lệ. Vui lòng kiểm tra thông tin nhập.",
  401: "Bạn không có quyền thực hiện hành động này.",
  403: "Bạn không có quyền thực hiện hành động này.",
  404: "Không tìm thấy tài nguyên yêu cầu.",
  409: "Có xung đột với trạng thái hiện tại của tài nguyên.",
  422: "Dữ liệu cung cấp không hợp lệ.",
  429: "Quá nhiều yêu cầu. Vui lòng thử lại sau.",
  500: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.",
  502: "Máy chủ gặp lỗi. Vui lòng thử lại sau.",
  503: "Dịch vụ hiện không khả dụng. Vui lòng thử lại sau.",
  504: "Yêu cầu hết thời gian. Vui lòng thử lại.",
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
    let errorMessage = data?.message || data?.error || DEFAULT_ERROR_MESSAGES[status] || "Đã xảy ra lỗi không xác định.";

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
      message: "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.",
      statusCode: 0,
    };
  }

  // Unknown error
  return {
    name: "UnknownError",
    message: error.message || "Đã xảy ra lỗi không xác định.",
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
