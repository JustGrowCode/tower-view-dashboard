
import { QueryClient } from "@tanstack/react-query";

// Google Sheets API Configuration
export const SHEET_ID = '1o-X32tleEa1GTZ9UinmpJI7pwBRjcvs4vqqkyB3vQIQ';
export const API_KEY = 'AIzaSyB0JhrzJjRkyiOZibah2Z028S6G3QRCVco'; // Google API key
export const SHEET_NAME = 'torres';

// Initialize a query client that can be used for manual invalidation
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Data will never go stale automatically
      gcTime: 3600000, // 1 hour - keep in cache longer since we're not auto-refreshing
      retry: 1, // Only retry once on failure
    },
  },
});

// Use a timestamp to track when data was last refreshed
export let LAST_REFRESH = Date.now();

// Function to update data version to force cache invalidation
export const updateRefreshTimestamp = () => {
  LAST_REFRESH = Date.now();
  return LAST_REFRESH;
};
