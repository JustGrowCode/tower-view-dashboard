
import { Tower } from "@/types/tower";
import { toast } from "sonner";
import { QueryClient, QueryFunctionContext } from "@tanstack/react-query";
import { parseTowersData } from "@/utils/towerDataParser";
import { getMockTowers } from "./mockTowerService";

// Configurações do Google Sheets
const SHEET_ID = '1o-X32tleEa1GTZ9UinmpJI7pwBRjcvs4vqqkyB3vQIQ';
const API_KEY = 'AIzaSyB0JhrzJjRkyiOZibah2Z028S6G3QRCVco';
const SHEET_NAME = 'torres';

// Cache em localStorage para armazenar dados quando offline
const CACHE_KEY = 'cachedTowers';
const CACHE_TIMESTAMP = 'lastFetchTime';

// Criar um query client configurado
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 3600000,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

/**
 * Função que limpa o cache local
 */
export function clearCache(): void {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP);
  console.log("Cache limpo");
}

/**
 * Salva os dados no cache
 */
function saveToCache(towers: Tower[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(towers));
    localStorage.setItem(CACHE_TIMESTAMP, new Date().toISOString());
  } catch (err) {
    console.error("Erro ao salvar no cache:", err);
  }
}

/**
 * Recupera os dados do cache
 */
function getFromCache(): Tower[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const towers = JSON.parse(cached) as Tower[];
    // Marca os dados como vindos do cache
    towers.forEach(tower => { tower.source = 'cache'; });
    return towers;
  } catch (err) {
    console.error("Erro ao ler do cache:", err);
    return null;
  }
}

/**
 * Função principal para buscar dados do Google Sheets
 */
async function fetchFromGoogleSheets(): Promise<Tower[] | null> {
  // Adicionamos um timestamp para evitar cache do navegador
  const timestamp = new Date().getTime();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}&_t=${timestamp}`;
  
  console.log("Buscando dados da planilha do Google Sheets...");
  
  try {
    // Usa um dos proxies CORS disponíveis
    const CORS_PROXIES = [
      "https://corsproxy.io/?",
      "https://api.allorigins.win/raw?url="
    ];
    
    // Tenta cada proxy em sequência
    for (const proxy of CORS_PROXIES) {
      try {
        console.log(`Tentando proxy: ${proxy}`);
        
        const proxyUrl = proxy + encodeURIComponent(url);
        
        // Adiciona um timeout para evitar requisições pendentes
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos
        
        const response = await fetch(proxyUrl, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.error(`Erro HTTP: ${response.status}`);
          continue; // Tenta o próximo proxy
        }
        
        const data = await response.json();
        
        if (!data.values || data.values.length < 2) {
          console.error("Dados insuficientes retornados da planilha");
          continue; // Tenta o próximo proxy
        }
        
        // Processa os dados da planilha
        const parsedTowers = parseTowersData(data.values);
        
        if (parsedTowers.length > 0) {
          console.log(`${parsedTowers.length} torres carregadas com sucesso`);
          
          // Marca os dados como vindos da planilha
          parsedTowers.forEach(tower => { tower.source = 'sheets'; });
          
          // Salva no cache local
          saveToCache(parsedTowers);
          
          return parsedTowers;
        }
      } catch (error) {
        console.error(`Erro com o proxy: ${error}`);
        // Continua para o próximo proxy
      }
    }
    
    // Se chegou aqui, todos os proxies falharam
    console.error("Todos os proxies falharam");
    return null;
    
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return null;
  }
}

/**
 * Função que atualiza os dados das torres
 */
export async function refreshTowersData(): Promise<Tower[] | null> {
  toast.info("Atualizando dados...");
  
  try {
    // Tentar buscar novos dados
    const freshData = await fetchFromGoogleSheets();
    
    if (freshData && freshData.length > 0) {
      // Atualiza o cache do React Query
      queryClient.setQueryData(['towers'], freshData);
      toast.success("Dados atualizados com sucesso!");
      return freshData;
    }
    
    // Se não conseguiu dados frescos, tenta usar o cache
    const cachedData = getFromCache();
    if (cachedData && cachedData.length > 0) {
      queryClient.setQueryData(['towers'], cachedData);
      toast.warning("Usando dados em cache. Não foi possível conectar à planilha.");
      return cachedData;
    }
    
    // Se não tem cache, usa dados mock
    const mockData = getMockTowers();
    queryClient.setQueryData(['towers'], mockData);
    toast.error("Usando dados de demonstração. Não foi possível obter dados da planilha.");
    return mockData;
    
  } catch (error) {
    console.error("Erro ao atualizar dados:", error);
    toast.error("Erro ao atualizar dados");
    
    // Tenta usar cache ou mock como fallback
    const cachedData = getFromCache();
    if (cachedData && cachedData.length > 0) {
      return cachedData;
    }
    return getMockTowers();
  }
}

/**
 * Função para buscar torres (usada pelo React Query)
 */
export async function fetchTowers(context?: QueryFunctionContext): Promise<Tower[]> {
  try {
    // Verifica se já temos dados em cache do React Query
    const existingData = queryClient.getQueryData<Tower[]>(['towers']);
    if (existingData && existingData.length > 0) {
      return existingData;
    }
    
    // Tenta buscar novos dados
    const freshData = await fetchFromGoogleSheets();
    if (freshData && freshData.length > 0) {
      return freshData;
    }
    
    // Tenta usar cache local
    const cachedData = getFromCache();
    if (cachedData && cachedData.length > 0) {
      return cachedData;
    }
    
    // Último recurso: dados mock
    return getMockTowers();
  } catch (error) {
    console.error("Erro ao buscar torres:", error);
    
    // Tenta usar cache ou mock como fallback
    const cachedData = getFromCache();
    if (cachedData && cachedData.length > 0) {
      return cachedData;
    }
    return getMockTowers();
  }
}

/**
 * Busca uma torre específica pelo ID
 */
export async function fetchTowerById(id: string): Promise<Tower | undefined> {
  const towers = await fetchTowers();
  return towers.find(tower => tower.id === id);
}
