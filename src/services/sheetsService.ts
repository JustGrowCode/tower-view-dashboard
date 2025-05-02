
import { Tower } from "@/types/tower";
import { toast } from "sonner";
import { queryClient, SHEET_ID, SHEET_NAME, API_KEY, LAST_REFRESH, updateRefreshTimestamp } from "./sheetsConfig";
import { parseTowersData } from "@/utils/towerDataParser";
import { getMockTowers } from "./mockTowerService";

/**
 * Refreshes the towers data by invalidating cache and triggering a refetch
 */
export async function refreshTowersData() {
  toast.info("Atualizando dados...");
  
  // Update timestamp to track refresh and prevent caching
  const timestamp = updateRefreshTimestamp();
  
  // Clear any local storage cache
  localStorage.removeItem('cachedTowers');
  
  // Force refetch by invalidating, removing, and then refetching
  await queryClient.invalidateQueries({ queryKey: ['towers'] });
  await queryClient.removeQueries({ queryKey: ['towers'] });
  
  // Immediately refetch to ensure fresh data
  const result = await queryClient.fetchQuery({ 
    queryKey: ['towers'],
    queryFn: () => fetchTowers(timestamp),
  });
  
  if (result.length > 0) {
    // Store last successful fetch time
    localStorage.setItem('lastFetchTime', new Date().toISOString());
    toast.success("Dados atualizados com sucesso!");
  } else {
    toast.error("Nenhum dado encontrado na planilha.");
  }
  
  return result;
}

/**
 * Fetches tower data from Google Sheets or falls back to mock data
 * @param timestamp Optional timestamp to prevent caching
 */
export async function fetchTowers(timestamp?: number): Promise<Tower[]> {
  const usedTimestamp = timestamp || LAST_REFRESH;
  
  try {
    console.log(`Fetching data from Google Sheets... (timestamp: ${usedTimestamp})`);
    
    // Check if API key is available
    if (!API_KEY) {
      console.error("API key is missing");
      toast.error('Chave de API não configurada');
      return getMockTowers();
    }
    
    // Add timestamp parameter to prevent caching
    const requestUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}&_t=${usedTimestamp}`;
    console.log("Making request to:", requestUrl);
    
    // Make the request with a timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
    
    try {
      const response = await fetch(requestUrl, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store' 
      });
      
      clearTimeout(timeoutId);
      
      // Handle HTTP errors
      if (!response.ok) {
        console.error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        toast.error(`Falha ao buscar dados do Google Sheets: ${response.status}`);
        
        // Log detailed error information
        try {
          const errorData = await response.json();
          console.error("Error details:", errorData);
        } catch (e) {
          console.error("Could not parse error response");
        }
        
        return getMockTowers();
      }
      
      // Parse response data
      const data = await response.json();
      console.log("Received data from Google Sheets:", data);
      
      if (!data.values || data.values.length < 2) {
        console.error("No data or insufficient data returned from the sheet");
        toast.error('Dados insuficientes na planilha');
        return getMockTowers();
      }
      
      // Process the data
      const parsedTowers = parseTowersData(data.values);
      
      if (parsedTowers.length > 0) {
        console.log("Successfully parsed towers data:", parsedTowers);
        toast.success('Dados carregados com sucesso do Google Sheets');
        
        return parsedTowers;
      } else {
        console.error("Failed to parse tower data");
        toast.error('Nenhum dado encontrado na planilha');
        return getMockTowers();
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error("Fetch error:", fetchError);
      
      if (fetchError.name === 'AbortError') {
        toast.error('Tempo excedido na requisição. Verifique sua conexão.');
      } else {
        toast.error(`Erro na requisição: ${fetchError.message}`);
      }
      
      return getMockTowers();
    }
  } catch (error: any) {
    console.error("Error fetching towers data:", error);
    toast.error(`Erro ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    return getMockTowers(); // Fallback to mock data
  }
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
