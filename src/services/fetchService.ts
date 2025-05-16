
import { Tower } from "@/types/tower";
import { toast } from "sonner";
import { API_KEY, SHEET_ID, SHEET_NAME } from "./sheetsConfig";
import { parseTowersData } from "@/utils/towerDataParser";
import { getMockTowers } from "./mockTowerService";
import { fetchWithCorsProxy } from "./proxyService";

/**
 * Função principal para buscar dados do Google Sheets
 */
export async function fetchSheetsData(): Promise<Tower[]> {
  console.log("Iniciando busca de dados da planilha...");
  
  try {
    // Constrói a URL para a API do Google Sheets
    const googleSheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    console.log(`[FetchService] URL do Google Sheets: ${googleSheetsUrl}`);
    
    // Usa o serviço de proxy para fazer a requisição
    const response = await fetchWithCorsProxy(googleSheetsUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Parse da resposta JSON
    const data = await response.json();
    console.log("[FetchService] Resposta bruta do Google Sheets:", data);
    
    // Verifica se os dados são válidos
    if (!data.values || data.values.length < 2) {
      console.error("[FetchService] Dados insuficientes na planilha:", data);
      toast.error("A planilha não contém dados suficientes ou está em formato incorreto.");
      throw new Error("Dados insuficientes na planilha");
    }
    
    // Analisa os dados da planilha
    console.log(`[FetchService] Processando ${data.values.length} linhas da planilha...`);
    const parsedTowers = parseTowersData(data.values);
    
    if (parsedTowers.length === 0) {
      console.error("[FetchService] Nenhuma torre válida encontrada após processamento");
      toast.error("Não foi possível encontrar torres válidas na planilha.");
      throw new Error("Nenhuma torre válida encontrada na planilha");
    }
    
    console.log(`[FetchService] Sucesso! ${parsedTowers.length} torres encontradas`);
    toast.success(`${parsedTowers.length} torres carregadas com sucesso`);
    
    // Marca dados como vindos da planilha
    parsedTowers.forEach(tower => { tower.source = 'sheets'; });
    
    // Salva em cache local
    localStorage.setItem('cachedTowers', JSON.stringify(parsedTowers));
    localStorage.setItem('lastFetchTime', new Date().toISOString());
    
    return parsedTowers;
  } catch (error) {
    console.error("[FetchService] Erro ao buscar dados da planilha:", error);
    
    // Tenta usar cache local
    try {
      const cachedData = localStorage.getItem('cachedTowers');
      if (cachedData) {
        console.log("[FetchService] Usando dados em cache");
        const towers = JSON.parse(cachedData) as Tower[];
        towers.forEach(tower => { tower.source = 'cache'; });
        toast.warning("Usando dados em cache. Não foi possível conectar à planilha.");
        return towers;
      }
    } catch (cacheError) {
      console.error("[FetchService] Erro ao acessar cache:", cacheError);
    }
    
    // Se tudo falhar, usa dados de demonstração
    console.log("[FetchService] Usando dados de demonstração");
    toast.error("Usando dados de demonstração. Não foi possível obter dados da planilha.");
    return getMockTowers();
  }
}

