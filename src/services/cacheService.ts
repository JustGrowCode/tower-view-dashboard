
import { Tower } from "@/types/tower";
import { queryClient } from "./sheetsConfig";

/**
 * Handles caching operations for tower data
 */

/**
 * Clears all application cache data
 */
export async function clearAllCache(): Promise<void> {
  // Clear localStorage items
  localStorage.removeItem('cachedTowers');
  localStorage.removeItem('lastFetchTime');
  localStorage.removeItem('lastSuccessfulFetch');
  localStorage.removeItem('lastHttpStatus');
  localStorage.removeItem('proxiesAttempted');
  
  // Clear React Query cache for towers
  await queryClient.removeQueries({ queryKey: ['towers'] });
  
  console.log("All cache data cleared successfully");
}

/**
 * Store tower data in the cache
 */
export function cacheTowers(towers: Tower[]): void {
  localStorage.setItem('cachedTowers', JSON.stringify(towers));
  localStorage.setItem('lastFetchTime', new Date().toISOString());
}

/**
 * Store successful fetch timestamp
 */
export function storeSuccessfulFetch(): void {
  localStorage.setItem('lastSuccessfulFetch', new Date().toISOString());
}

/**
 * Try to retrieve cached towers data
 */
export function getCachedTowers(): Tower[] | null {
  const cachedData = localStorage.getItem('cachedTowers');
  if (cachedData) {
    try {
      const parsedCache = JSON.parse(cachedData);
      console.log("Retrieved cached towers data");
      
      // Mark as coming from cache
      if (parsedCache && parsedCache.length > 0) {
        parsedCache.forEach((tower: Tower) => {
          tower.source = 'cache';
        });
      }
      
      return parsedCache;
    } catch (e) {
      console.error("Error parsing cached data", e);
      localStorage.removeItem('cachedTowers');
    }
  }
  return null;
}
