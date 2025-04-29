
import { Tower } from "@/types/tower";
import { toast } from "sonner"; 

const SHEET_ID = '1o-X32tleEa1GTZ9UinmpJI7pwBRjcvs4vqqkyB3vQIQ';
const API_KEY = ''; // Insira sua chave API do Google aqui
const SHEET_NAME = 'torres';

export async function fetchTowers(): Promise<Tower[]> {
  try {
    // Only attempt to fetch if API key is provided
    if (API_KEY) {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data from Google Sheets');
      }
      
      const data = await response.json();
      const parsedTowers = parseTowersData(data.values);
      
      if (parsedTowers.length > 0) {
        toast.success('Dados carregados com sucesso do Google Sheets');
        return parsedTowers;
      } else {
        toast.error('Nenhum dado encontrado na planilha');
      }
    } else {
      console.log('No API key provided, using mock data');
    }

    // Fallback to mock data when no API key or parsing issues
    return getMockTowers();
    
  } catch (error) {
    console.error("Error fetching towers data:", error);
    toast.error(`Erro ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    return getMockTowers(); // Fallback to mock data
  }
}

function parseTowersData(rows: string[][]): Tower[] {
  if (!rows || rows.length < 2) {
    return [];
  }
  
  const headers = rows[0];
  const towers: Tower[] = [];
  
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 3) continue; // Skip empty rows
    
    // Get column indices from headers for easier mapping
    const getColumnIndex = (name: string) => {
      const index = headers.findIndex(h => h.toLowerCase().includes(name.toLowerCase()));
      return index >= 0 ? index : null;
    };

    const nameIndex = getColumnIndex('nome') || 0;
    const locationIndex = getColumnIndex('localizacao') || 1;
    const latIndex = getColumnIndex('latitude') || 2;
    const lngIndex = getColumnIndex('longitude') || 3;
    const totalInvestmentIndex = getColumnIndex('valor_total_investimento') || 4;
    const landValueIndex = getColumnIndex('valor_terreno') || 5;
    const structureValueIndex = getColumnIndex('estrutura') || 6;
    const equipmentValueIndex = getColumnIndex('equipamentos') || 7;
    const monthlyReturnIndex = getColumnIndex('remuneracao_mensal') || 10;
    const monthlyReturnPercentIndex = getColumnIndex('rentabilidade_mensal') || 11;
    const annualReturnIndex = getColumnIndex('remuneracao_anual') || 12;
    const annualReturnPercentIndex = getColumnIndex('rentabilidade_anual') || 13;
    const operatorFeeIndex = getColumnIndex('raes_operadora') || 14;
    const totalContractValueIndex = getColumnIndex('remuneracao_total') || 15;
    const totalContractPercentIndex = getColumnIndex('rentabilidade_total') || 16;
    
    // Create tower object with mapped data
    const tower: Tower = {
      id: `tower-${i}`,
      name: row[nameIndex] || `Torre ${i}`,
      location: row[locationIndex] || 'Localização não especificada',
      coordinates: {
        lat: parseFloat(row[latIndex]) || -23.5505,
        lng: parseFloat(row[lngIndex]) || -46.6333,
      },
      investment: {
        total: parseFloat(row[totalInvestmentIndex]) || 231000,
        land: parseFloat(row[landValueIndex]) || 150400,
        structure: parseFloat(row[structureValueIndex]) || 51000,
        equipment: parseFloat(row[equipmentValueIndex]) || 30000,
        other: parseFloat(row[8]) || 0,
        locationDetails: row[9] || 'Local pronto para implantação',
      },
      returns: {
        monthly: parseFloat(row[monthlyReturnIndex]) || 3000,
        annual: parseFloat(row[annualReturnIndex]) || 36000,
        operatorFee: parseFloat(row[operatorFeeIndex]) || 80800,
        totalContractValue: parseFloat(row[totalContractValueIndex]) || 1080000,
        roi: parseFloat(row[totalContractPercentIndex]) || 467.53,
      },
      contract: {
        duration: parseInt(row[17]) || 30,
        periods: row[18] || '10 + 10 + 10',
        payback: parseFloat(row[19]) || 77,
        expiryLucrativePercentage: parseFloat(row[20]) || 80.26,
      },
      market: {
        cagr: parseFloat(row[21]) || 7.84,
        topMarket: row[22] || 'América do Norte e Ásia Pacífico',
        growthRegion: row[23] || 'América do Norte e Ásia Pacífico',
        currentYear: parseInt(row[24]) || 2020,
        projectedYear: parseInt(row[25]) || 2028,
        currentValue: parseFloat(row[26]) || 7.1,
        projectedValue: parseFloat(row[27]) || 12.5,
      },
      images: {
        location: row[28] || 'https://via.placeholder.com/300x200?text=Local+da+Torre',
        tower: row[29] || 'https://via.placeholder.com/300x200?text=Torre',
      },
    };
    
    towers.push(tower);
  }
  
  return towers.length > 0 ? towers : [];
}

// Mock data for demo purposes or when API is not available
function getMockTowers(): Tower[] {
  return [
    {
      id: 'tower-1',
      name: 'Torre São Paulo',
      location: 'São Paulo, SP',
      coordinates: {
        lat: -23.5505,
        lng: -46.6333,
      },
      investment: {
        total: 231000,
        land: 150400,
        structure: 51000,
        equipment: 30000,
        other: 0,
        locationDetails: 'Local pronto para implantação',
      },
      returns: {
        monthly: 3000,
        annual: 36000,
        operatorFee: 80800,
        totalContractValue: 1080000,
        roi: 467.53,
      },
      contract: {
        duration: 30,
        periods: '10 + 10 + 10',
        payback: 77,
        expiryLucrativePercentage: 80.26,
      },
      market: {
        cagr: 7.84,
        topMarket: 'América do Norte e Ásia Pacífico',
        growthRegion: 'América do Norte e Ásia Pacífico',
        currentYear: 2020,
        projectedYear: 2028,
        currentValue: 7.1,
        projectedValue: 12.5,
      },
      images: {
        location: '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png',
        tower: '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png',
      },
    },
    {
      id: 'tower-2',
      name: 'Torre Rio de Janeiro',
      location: 'Rio de Janeiro, RJ',
      coordinates: {
        lat: -22.9068,
        lng: -43.1729,
      },
      investment: {
        total: 250000,
        land: 160000,
        structure: 55000,
        equipment: 35000,
        other: 0,
        locationDetails: 'Local pronto para implantação',
      },
      returns: {
        monthly: 3500,
        annual: 42000,
        operatorFee: 85000,
        totalContractValue: 1260000,
        roi: 504,
      },
      contract: {
        duration: 30,
        periods: '10 + 10 + 10',
        payback: 72,
        expiryLucrativePercentage: 82.5,
      },
      market: {
        cagr: 7.84,
        topMarket: 'América do Norte e Ásia Pacífico',
        growthRegion: 'América do Norte e Ásia Pacífico',
        currentYear: 2020,
        projectedYear: 2028,
        currentValue: 7.1,
        projectedValue: 12.5,
      },
      images: {
        location: '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png',
        tower: '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png',
      },
    },
  ];
}

export async function fetchTowerById(id: string): Promise<Tower | undefined> {
  const towers = await fetchTowers();
  return towers.find(tower => tower.id === id);
}

/*
  COMO CONECTAR SUA PLANILHA DO GOOGLE SHEETS:
  
  1. Acesse https://console.cloud.google.com/
  2. Crie um novo projeto ou use um existente
  3. Habilite a API Google Sheets para esse projeto
  4. Crie uma chave de API em Credenciais
  5. Copie a chave API gerada e substitua a constante API_KEY acima
  6. Certifique-se que sua planilha está pública para leitura
  7. Mantenha a mesma estrutura de cabeçalhos na planilha para compatibilidade com o mapeamento
  
  CABEÇALHOS NECESSÁRIOS NA PLANILHA:
  - nome
  - localizacao
  - latitude
  - longitude
  - valor_total_investimento
  - valor_terreno
  - estrutura
  - equipamentos
  - remuneracao_mensal
  - rentabilidade_mensal
  - remuneracao_anual
  - rentabilidade_anual
  - raes_operadora
  - remuneracao_total
  - rentabilidade_total
  ...
  
  Obs: O sistema tentará localizar esses cabeçalhos independentemente de capitalização
  ou nomes parciais, mas é recomendado manter os nomes exatos para melhor compatibilidade.
*/

