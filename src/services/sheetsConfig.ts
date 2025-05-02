
import { QueryClient } from "@tanstack/react-query";

// Google Sheets API Configuration
export const SHEET_ID = '1o-X32tleEa1GTZ9UinmpJI7pwBRjcvs4vqqkyB3vQIQ';
export const API_KEY = 'AIzaSyB0JhrzJjRkyiOZibah2Z028S6G3QRCVco'; // Google API key
export const SHEET_NAME = 'torres';

// Initialize a query client that can be used for manual invalidation
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      gcTime: 120000, // 2 minutes
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
