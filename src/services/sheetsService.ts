
import { Tower } from "@/types/tower";
import { toast } from "sonner";
import { queryClient, updateRefreshTimestamp } from "./sheetsConfig";
import { getMockTowers } from "./mockTowerService";
import { QueryFunctionContext } from "@tanstack/react-query";
import { fetchSheetsData } from "./fetchService";
import { clearAllCache, getCachedTowers } from "./cacheService";
import { resetProxyState } from "./proxyService";

/**
 * Main service to manage tower data retrieval
 */

/**
 * Refreshes the towers data by invalidating cache and triggering a refetch
 */
export async function refreshTowersData() {
  toast.info("Atualizando dados...");
  
  // Update timestamp to track refresh and prevent caching
  updateRefreshTimestamp();
  
  // Clear any local storage cache for proxies
  resetProxyState();
  
  // Force refetch by invalidating, removing, and then refetching
  await queryClient.invalidateQueries({ queryKey: ['towers'] });
  await queryClient.removeQueries({ queryKey: ['towers'] });
  
  // Immediately refetch to ensure fresh data
  const result = await queryClient.fetchQuery({ 
    queryKey: ['towers'],
    queryFn: fetchTowers,
    staleTime: 0, // Force fresh fetch
  });
  
  if (result && result.length > 0) {
    if (result[0].source === 'sheets') {
      toast.success("Dados atualizados com sucesso!");
    } else if (result[0].source === 'cache') {
      toast.warning("Usando dados em cache. Não foi possível conectar à planilha.");
    } else {
      toast.error("Usando dados de demonstração. Não foi possível obter dados da planilha.");
    }
  } else {
    toast.error("Nenhum dado encontrado.");
  }
  
  return result;
}

/**
 * Fetches tower data from Google Sheets or falls back to mock data
 */
export async function fetchTowers(context?: QueryFunctionContext): Promise<Tower[]> {
  // Check for cached result first if we're not explicitly refreshing
  if (!context || context.meta?.skipCache !== true) {
    const cachedTowers = getCachedTowers();
    if (cachedTowers) {
      return cachedTowers;
    }
  }
  
  // Try to fetch fresh data from the sheets API
  const sheetsData = await fetchSheetsData();
  
  if (sheetsData && sheetsData.length > 0) {
    return sheetsData;
  }
  
  // As a fallback, check for cached data again
  const cachedData = getCachedTowers();
  if (cachedData) {
    toast.warning('Usando dados em cache. Não foi possível conectar à planilha.');
    return cachedData;
  }
  
  // Last resort: return mock data
  return getMockTowers();
}

/**
 * Fetches a specific tower by ID
 */
export async function fetchTowerById(id: string): Promise<Tower | undefined> {
  const towers = await fetchTowers();
  return towers.find(tower => tower.id === id);
}

// Re-export the query client for use in other files
export { queryClient } from './sheetsConfig';
export { clearAllCache };
