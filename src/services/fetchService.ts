
import { Tower } from "@/types/tower";
import { toast } from "sonner";
import { API_KEY, SHEET_ID, SHEET_NAME, updateRefreshTimestamp } from "./sheetsConfig";
import { parseTowersData } from "@/utils/towerDataParser";
import { getMockTowers } from "./mockTowerService";
import { getNextProxy, updateCurrentProxyIndex, resetProxyState, CORS_PROXIES } from "./proxyService";
import { performFetch } from "./diagnosticsService";
import { cacheTowers, getCachedTowers, storeSuccessfulFetch } from "./cacheService";

/**
 * Core functionality to fetch data from Google Sheets
 */
export async function fetchSheetsData(): Promise<Tower[] | null> {
  // Use timestamp for cache busting
  const timestamp = updateRefreshTimestamp();
  
  try {
    console.log(`Tentando buscar dados da planilha... (timestamp: ${timestamp})`);
    
    // Check if API key is available
    if (!API_KEY) {
      console.error("API key is missing");
      toast.error('Chave de API não configurada');
      localStorage.setItem('googleAPIConfigured', 'false');
      return null;
    }
    
    localStorage.setItem('googleAPIConfigured', 'true');
    
    // Target API URL
    const targetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}&_t=${timestamp}`;
    
    // Try each proxy in sequence until one works
    let lastError: Error | null = null;
    resetProxyState();
    
    for (let attempt = 0; attempt < CORS_PROXIES.length; attempt++) {
      const proxyIndex = (attempt) % CORS_PROXIES.length;
      const proxy = getNextProxy();
      
      const proxyUrl = proxy.url + encodeURIComponent(targetUrl);
      
      console.log(`Attempt ${attempt + 1}: Using proxy ${proxy.name} to access Google Sheets`);
      
      try {
        // Make the request with a timeout to prevent hanging
        const response = await performFetch(proxyUrl, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }, 20000); // 20s timeout
        
        // If request was successful, update the current proxy index for next time
        if (response.ok) {
          console.log(`Proxy ${proxy.name} worked successfully!`);
          updateCurrentProxyIndex(proxyIndex);
          
          // Parse response data
          const data = await response.json();
          console.log("Received data from Google Sheets:", data);
          
          if (!data.values || data.values.length < 2) {
            console.error("No data or insufficient data returned from the sheet");
            toast.error('Dados insuficientes na planilha');
            return null;
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
            cacheTowers(parsedTowers);
            storeSuccessfulFetch();
            
            return parsedTowers;
          } else {
            console.error("Failed to parse tower data");
            toast.error('Nenhuma torre encontrada na planilha');
            return null;
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
    
    return null;
    
  } catch (error: any) {
    console.error("Error fetching from Google Sheets:", error);
    toast.error(`Erro ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    return null;
  }
}
