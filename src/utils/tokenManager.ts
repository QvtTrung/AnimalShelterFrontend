import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Token refresh interval (e.g., refresh every 14 minutes if token expires in 15 minutes)
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds

let refreshIntervalId: NodeJS.Timeout | null = null;

/**
 * Refresh the access token
 */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const refresh_token = localStorage.getItem("refresh_token");
    
    if (!refresh_token) {
      console.error("No refresh token available");
      return false;
    }

    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      { refresh_token },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    );

    const { directusUser, user, token, refresh_token: newRefreshToken } = response.data.data;

    if (token) {
      localStorage.setItem("token", token);

      if (newRefreshToken) {
        localStorage.setItem("refresh_token", newRefreshToken);
      }

      if (directusUser) {
        localStorage.setItem("directusUser", JSON.stringify(directusUser));
      }

      if (user) {
        localStorage.setItem("appUser", JSON.stringify(user));
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return false;
  }
}

/**
 * Start periodic token refresh
 * This will refresh the token every TOKEN_REFRESH_INTERVAL milliseconds
 */
export function startTokenRefresh() {
  // Clear any existing interval
  stopTokenRefresh();

  // Set up new interval
  refreshIntervalId = setInterval(async () => {
    const token = localStorage.getItem("token");
    
    // Only refresh if we have a token
    if (token) {
      const success = await refreshAccessToken();
      
      if (!success) {
        // If refresh fails, stop trying but don't force logout
        // Let the authProvider and axios interceptors handle authentication
        stopTokenRefresh();
      }
    } else {
      // No token, stop refreshing
      stopTokenRefresh();
    }
  }, TOKEN_REFRESH_INTERVAL);
}

/**
 * Stop periodic token refresh
 */
export function stopTokenRefresh() {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
    console.log("Token refresh interval stopped");
  }
}

/**
 * Initialize token manager
 * Call this when user logs in
 */
export function initTokenManager() {
  const token = localStorage.getItem("token");
  
  if (token) {
    startTokenRefresh();
  }
}

/**
 * Clean up token manager
 * Call this when user logs out
 */
export function cleanupTokenManager() {
  stopTokenRefresh();
}
