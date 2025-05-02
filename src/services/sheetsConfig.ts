
import { QueryClient } from "@tanstack/react-query";

// Google Sheets API Configuration
export const SHEET_ID = '1o-X32tleEa1GTZ9UinmpJI7pwBRjcvs4vqqkyB3vQIQ';
export const API_KEY = 'AIzaSyB0JhrzJjRkyiOZibah2Z028S6G3QRCVco'; // Google API key
export const SHEET_NAME = 'torres';

// Store whether configuration is valid
export function checkAPIConfiguration() {
  if (API_KEY && SHEET_ID && SHEET_NAME) {
    localStorage.setItem('googleAPIConfigured', 'true');
    return true;
  } else {
    localStorage.setItem('googleAPIConfigured', 'false');
    return false;
  }
}

// Initialize a query client that can be used for manual invalidation with improved settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Data will never go stale automatically
      gcTime: 3600000, // 1 hour - keep in cache longer since we're not auto-refreshing
      retry: 2, // Retry twice on failure
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnMount: false, // Don't refetch on component mount
      // Disable automatic retries on error, we'll handle this manually
      retryOnMount: false,
    },
  },
});

// Use a timestamp to track when data was last refreshed
export let LAST_REFRESH = Date.now();

// Function to update data version to force cache invalidation
export const updateRefreshTimestamp = () => {
  LAST_REFRESH = Date.now();
  localStorage.setItem('lastRefreshAttempt', new Date().toISOString());
  return LAST_REFRESH;
};

// Initialize timestamp on load and check configuration
updateRefreshTimestamp();
checkAPIConfiguration();
