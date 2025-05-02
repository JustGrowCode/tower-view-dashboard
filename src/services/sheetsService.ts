
import { Tower } from "@/types/tower";
import { toast } from "sonner";
import { queryClient, SHEET_ID, SHEET_NAME, API_KEY, LAST_REFRESH, updateRefreshTimestamp } from "./sheetsConfig";
import { parseTowersData } from "@/utils/towerDataParser";
import { getMockTowers } from "./mockTowerService";
import { QueryFunctionContext } from "@tanstack/react-query";

// List of CORS proxies to try in order
const CORS_PROXIES = [
  { name: "corsproxy.io", url: "https://corsproxy.io/?" },
  { name: "cors-anywhere (backup)", url: "https://cors-anywhere.herokuapp.com/" },
  { name: "allorigins", url: "https://api.allorigins.win/raw?url=" }
];

// Track which proxies we've attempted
let currentProxyIndex = 0;
let proxiesAttempted: string[] = [];

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
  
  // Update timestamp to prevent any browser caching
  updateRefreshTimestamp();
  
  console.log("All cache data cleared successfully");
  
  // Reset proxy index to start fresh
  currentProxyIndex = 0;
  proxiesAttempted = [];
}

/**
 * Refreshes the towers data by invalidating cache and triggering a refetch
 */
export async function refreshTowersData() {
  toast.info("Atualizando dados...");
  
  // Update timestamp to track refresh and prevent caching
  const timestamp = updateRefreshTimestamp();
  
  // Clear any local storage cache
  localStorage.removeItem('cachedTowers');
  localStorage.removeItem('proxiesAttempted');
  
  // Reset proxy index to start fresh
  currentProxyIndex = 0;
  proxiesAttempted = [];
  
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
      // Store last successful fetch time
      localStorage.setItem('lastSuccessfulFetch', new Date().toISOString());
      toast.success("Dados atualizados com sucesso!");
    } else {
      toast.warning("Dados de fallback carregados. Não foi possível conectar à planilha.");
    }
  } else {
    toast.error("Nenhum dado encontrado.");
  }
  
  return result;
}

/**
 * Performs a fetch with timeout and diagnostics
 */
async function performFetch(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const startTime = Date.now();
    const response = await fetch(url, { 
      ...options,
      signal: controller.signal
    });
    
    const endTime = Date.now();
    console.log(`Fetch completed in ${endTime - startTime}ms with status ${response.status}`);
    
    // Store diagnostic information
    localStorage.setItem('lastHttpStatus', response.status.toString());
    
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetches tower data from Google Sheets or falls back to mock data
 * Try multiple CORS proxies if one fails
 */
export async function fetchTowers(context?: QueryFunctionContext): Promise<Tower[]> {
  // Usar LAST_REFRESH do config ou timestamp atual para evitar cache
  const usedTimestamp = LAST_REFRESH;
  
  // Check for cached result first if we're not explicitly refreshing
  if (!context || context.meta?.skipCache !== true) {
    const cachedData = localStorage.getItem('cachedTowers');
    if (cachedData) {
      try {
        const parsedCache = JSON.parse(cachedData);
        console.log("Using cached towers data");
        
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
  }
  
  // If we have a cachedTowers but couldn't parse it, remove it
  if (localStorage.getItem('cachedTowers')) {
    localStorage.removeItem('cachedTowers');
  }
  
  try {
    console.log(`Tentando buscar dados da planilha... (timestamp: ${usedTimestamp})`);
    
    // Check if API key is available
    if (!API_KEY) {
      console.error("API key is missing");
      toast.error('Chave de API não configurada');
      localStorage.setItem('googleAPIConfigured', 'false');
      return getMockTowers();
    }
    
    localStorage.setItem('googleAPIConfigured', 'true');
    
    // Target API URL
    const targetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}&_t=${usedTimestamp}`;
    
    // Try each proxy in sequence until one works
    let lastError: Error | null = null;
    proxiesAttempted = [];
    
    for (let attempt = 0; attempt < CORS_PROXIES.length; attempt++) {
      const proxyIndex = (currentProxyIndex + attempt) % CORS_PROXIES.length;
      const proxy = CORS_PROXIES[proxyIndex];
      
      const proxyUrl = proxy.url + encodeURIComponent(targetUrl);
      proxiesAttempted.push(proxy.name);
      localStorage.setItem('proxiesAttempted', proxiesAttempted.join(', '));
      
      console.log(`Attempt ${attempt + 1}: Using proxy ${proxy.name} to access Google Sheets`);
      
      try {
        // Make the request with a timeout to prevent hanging - increase timeout to 20s
        const response = await performFetch(proxyUrl, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }, 20000);
        
        // If request was successful, update the current proxy index for next time
        if (response.ok) {
          console.log(`Proxy ${proxy.name} worked successfully!`);
          currentProxyIndex = proxyIndex;
          
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
            
            // Set source to be explicitly from sheets
            parsedTowers.forEach(tower => {
              tower.source = 'sheets';
            });
            
            // Cache the successful result
            localStorage.setItem('cachedTowers', JSON.stringify(parsedTowers));
            localStorage.setItem('lastSuccessfulFetch', new Date().toISOString());
            localStorage.setItem('lastFetchTime', new Date().toISOString());
            
            return parsedTowers;
          } else {
            console.error("Failed to parse tower data");
            toast.error('Nenhuma torre encontrada na planilha');
            return getMockTowers();
          }
        } else {
          // Log the error status
          console.error(`Proxy ${proxy.name} returned status ${response.status}`);
          lastError = new Error(`HTTP status ${response.status}`);
          
          // Try to get detailed error info
          try {
            const errorData = await response.json();
            console.error("Google Sheets API Error:", errorData);
            if (errorData.error?.message) {
              lastError = new Error(errorData.error.message);
            }
          } catch (e) {
            // Couldn't parse JSON error, continue with next proxy
          }
        }
      } catch (error: any) {
        console.error(`Error with proxy ${proxy.name}:`, error);
        lastError = error;
        // Continue to next proxy
      }
    }
    
    // If we get here, all proxies failed
    console.error("All proxies failed to access Google Sheets API");
    if (lastError) {
      toast.error(`Não foi possível acessar a API: ${lastError.message}`);
    } else {
      toast.error("Não foi possível acessar a API da planilha");
    }
    
    // Try to get cached data as a fallback
    const cachedData = localStorage.getItem('cachedTowers');
    if (cachedData) {
      try {
        const parsedCache = JSON.parse(cachedData);
        toast.warning('Usando dados em cache. Não foi possível conectar à planilha.');
        
        // Mark as coming from cache
        parsedCache.forEach((tower: Tower) => {
          tower.source = 'cache';
        });
        
        return parsedCache;
      } catch (e) {
        console.error("Error parsing cached data", e);
      }
    }
    
    // Last resort: return mock data
    return getMockTowers();
    
  } catch (error: any) {
    console.error("Error fetching towers data:", error);
    toast.error(`Erro ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    
    // Try to get cached data as a fallback
    const cachedData = localStorage.getItem('cachedTowers');
    if (cachedData) {
      try {
        const parsedCache = JSON.parse(cachedData);
        toast.warning('Usando dados em cache devido a erro.');
        // Mark as coming from cache
        parsedCache.forEach((tower: Tower) => {
          tower.source = 'cache';
        });
        return parsedCache;
      } catch (e) {
        console.error("Error parsing cached data", e);
      }
    }
    
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
