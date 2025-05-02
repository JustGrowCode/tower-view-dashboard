
import { Tower } from "@/types/tower";
import { toast } from "sonner";
import { QueryClient } from "@tanstack/react-query";
import { fetchSheetsData } from "./fetchService";
import { getMockTowers } from "./mockTowerService";

// Configurações do Google Sheets
export const SHEET_ID = '1o-X32tleEa1GTZ9UinmpJI7pwBRjcvs4vqqkyB3vQIQ';
export const API_KEY = 'AIzaSyB0JhrzJjRkyiOZibah2Z028S6G3QRCVco';
export const SHEET_NAME = 'torres';

// Criar um query client configurado
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Função que atualiza os dados das torres (para o botão de atualizar)
 */
export async function refreshTowersData(): Promise<Tower[]> {
  toast.info("Atualizando dados...");
  
  try {
    // Buscar dados atualizados
    const freshData = await fetchSheetsData();
    
    if (freshData.length > 0) {
      // Atualiza o cache do React Query
      queryClient.setQueryData(['towers'], freshData);
      
      if (freshData[0].source === 'sheets') {
        toast.success("Dados atualizados com sucesso!");
      }
      
      return freshData;
    }
    
    return getMockTowers();
  } catch (error) {
    console.error("Erro ao atualizar dados:", error);
    toast.error("Erro ao atualizar dados");
    return getMockTowers();
  }
}

/**
 * Função para buscar torres (usada pelo React Query)
 */
export async function fetchTowers(): Promise<Tower[]> {
  try {
    // Verifica se já temos dados em cache do React Query
    const existingData = queryClient.getQueryData<Tower[]>(['towers']);
    if (existingData && existingData.length > 0) {
      return existingData;
    }
    
    // Buscar dados novos
    return await fetchSheetsData();
  } catch (error) {
    console.error("Erro ao buscar torres:", error);
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
