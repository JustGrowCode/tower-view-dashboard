
import { Tower } from "@/types/tower";
import { toast } from "sonner";
import { API_KEY, SHEET_ID, SHEET_NAME } from "./sheetsConfig";
import { parseTowersData } from "@/utils/towerDataParser";
import { getMockTowers } from "./mockTowerService";

// Lista de proxies CORS para tentar em sequência
const CORS_PROXIES = [
  "https://corsproxy.io/?",
  "https://api.allorigins.win/raw?url=",
  "https://cors-anywhere.herokuapp.com/"
];

/**
 * Função principal para buscar dados do Google Sheets
 */
export async function fetchSheetsData(): Promise<Tower[]> {
  console.log("Iniciando busca de dados da planilha...");
  
  // Adiciona timestamp para evitar cache do navegador
  const timestamp = new Date().getTime();
  const targetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}&_t=${timestamp}`;
  
  // Tenta cada proxy em sequência
  for (const proxy of CORS_PROXIES) {
    try {
      console.log(`Tentando proxy: ${proxy}`);
      const proxyUrl = proxy + encodeURIComponent(targetUrl);
      
      // Configuração com timeout mais longo (60 segundos)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      
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
      
      if (response.ok) {
        const data = await response.json();
        console.log("Dados recebidos do Google Sheets:", data);
        
        if (!data.values || data.values.length < 2) {
          console.error("Dados insuficientes na planilha");
          continue; // Tenta próximo proxy
        }
        
        // Processa os dados recebidos
        const parsedTowers = parseTowersData(data.values);
        
        if (parsedTowers.length > 0) {
          console.log(`Sucesso! ${parsedTowers.length} torres encontradas`);
          toast.success(`${parsedTowers.length} torres carregadas com sucesso`);
          
          // Marca dados como vindos da planilha
          parsedTowers.forEach(tower => { tower.source = 'sheets'; });
          
          // Salva em cache local
          localStorage.setItem('cachedTowers', JSON.stringify(parsedTowers));
          localStorage.setItem('lastFetchTime', new Date().toISOString());
          
          return parsedTowers;
        }
      } else {
        console.error(`Erro HTTP ${response.status} com proxy ${proxy}`);
      }
    } catch (error) {
      console.error(`Falha com proxy ${proxy}:`, error);
      // Continua para o próximo proxy
    }
  }
  
  // Se todos os proxies falharam, tenta usar cache local
  try {
    const cachedData = localStorage.getItem('cachedTowers');
    if (cachedData) {
      const towers = JSON.parse(cachedData) as Tower[];
      towers.forEach(tower => { tower.source = 'cache'; });
      toast.warning("Usando dados em cache. Não foi possível conectar à planilha.");
      return towers;
    }
  } catch (error) {
    console.error("Erro ao acessar cache:", error);
  }
  
  // Último recurso: usar dados de demonstração
  toast.error("Usando dados de demonstração. Não foi possível obter dados da planilha.");
  return getMockTowers();
}
