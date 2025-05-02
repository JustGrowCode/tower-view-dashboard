
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
    console.log(`Buscando dados da planilha... (timestamp: ${timestamp})`);
    
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
      
      console.log(`Tentativa ${attempt + 1}: Usando proxy ${proxy.name} para acessar Google Sheets`);
      
      try {
        // Make the request with a timeout to prevent hanging
        const response = await performFetch(proxyUrl, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }, 30000); // 30s timeout (aumentado para melhor performance)
        
        // If request was successful, update the current proxy index for next time
        if (response.ok) {
          console.log(`Proxy ${proxy.name} funcionou com sucesso!`);
          updateCurrentProxyIndex(proxyIndex);
          
          // Parse response data
          const data = await response.json();
          console.log("Dados recebidos do Google Sheets:", data);
          
          if (!data.values || data.values.length < 2) {
            console.error("Dados insuficientes retornados da planilha");
            toast.error('Dados insuficientes na planilha');
            return null;
          }
          
          // Process the data
          const parsedTowers = parseTowersData(data.values);
          
          if (parsedTowers.length > 0) {
            console.log("Dados das torres analisados com sucesso:", parsedTowers);
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
            console.error("Falha ao analisar dados das torres");
            toast.error('Nenhuma torre encontrada na planilha');
            return null;
          }
        } else {
          // Log the error status
          console.error(`Proxy ${proxy.name} retornou status ${response.status}`);
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
        console.error(`Erro com o proxy ${proxy.name}:`, error);
        lastError = error;
        // Continue to next proxy
      }
    }
    
    // If we get here, all proxies failed
    console.error("Todos os proxies falharam ao acessar a API Google Sheets");
    if (lastError) {
      toast.error(`Não foi possível acessar a API: ${lastError.message}`);
    } else {
      toast.error("Não foi possível acessar a API da planilha");
    }
    
    return null;
    
  } catch (error: any) {
    console.error("Erro ao buscar dados do Google Sheets:", error);
    toast.error(`Erro ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    return null;
  }
}
