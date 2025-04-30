
import { Tower } from "@/types/tower";
import { toast } from "sonner"; 
import { QueryClient } from "@tanstack/react-query";

const SHEET_ID = '1o-X32tleEa1GTZ9UinmpJI7pwBRjcvs4vqqkyB3vQIQ';
const API_KEY = 'AIzaSyB0JhrzJjRkyiOZibah2Z028S6G3QRCVco'; // Google API key
const SHEET_NAME = 'torres';

// Initialize a query client that can be used for manual invalidation
export const queryClient = new QueryClient();

// Function to refresh data manually
export const refreshTowersData = async () => {
  toast.info("Atualizando dados...");
  await queryClient.invalidateQueries({ queryKey: ['towers'] });
  toast.success("Dados atualizados com sucesso!");
};

export async function fetchTowers(): Promise<Tower[]> {
  try {
    // Only attempt to fetch if API key is provided
    if (API_KEY) {
      console.log("Fetching data from Google Sheets...");
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Falha ao buscar dados do Google Sheets');
      }
      
      const data = await response.json();
      console.log("Received data from Google Sheets:", data);
      
      if (!data.values || data.values.length < 2) {
        console.error("No data or insufficient data returned from the sheet");
        toast.error('Dados insuficientes na planilha');
        return getMockTowers();
      }
      
      const parsedTowers = parseTowersData(data.values);
      
      if (parsedTowers.length > 0) {
        console.log("Successfully parsed towers data:", parsedTowers);
        toast.success('Dados carregados com sucesso do Google Sheets');
        return parsedTowers;
      } else {
        console.error("Failed to parse tower data");
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

// Helper to parse currency strings like "R$ 1.234,56" to number
function parseCurrency(value: string): number {
  if (!value) return 0;
  
  // Remove currency symbol, dots for thousands, and replace comma with dot for decimal
  return parseFloat(
    value.replace(/[R$\s.]/g, '')
      .replace(',', '.')
  );
}

function parseTowersData(rows: string[][]): Tower[] {
  if (!rows || rows.length < 2) {
    return [];
  }
  
  const headers = rows[0];
  console.log("Sheet headers:", headers);
  const towers: Tower[] = [];
  
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 3) {
      console.warn(`Skipping row ${i} due to insufficient data:`, row);
      continue; // Skip empty rows
    }
    
    // Map headers with more flexibility
    // Get column indices from headers for easier mapping
    const getColumnIndex = (possibleNames: string[]) => {
      for (const name of possibleNames) {
        const index = headers.findIndex(h => 
          h.toLowerCase().includes(name.toLowerCase())
        );
        if (index >= 0) return index;
      }
      return null;
    };

    const projectIndex = getColumnIndex(['projeto', 'nome']) || 0;
    const cityIndex = getColumnIndex(['cidade']) || 1;
    const stateIndex = getColumnIndex(['estado']) || 2;
    const latIndex = getColumnIndex(['latitude', 'lat']) || 3;
    const lngIndex = getColumnIndex(['longitude', 'lng']) || 4;
    const landValueIndex = getColumnIndex(['valor_terreno', 'terreno']) || 5;
    const structureValueIndex = getColumnIndex(['estrutura', 'taça']) || 6;
    const equipmentValueIndex = getColumnIndex(['equipamentos']) || 7;
    const otherIndex = getColumnIndex(['despesas', 'documentacao']) || 8;
    const locationDetailsIndex = getColumnIndex(['local', 'localização', 'detalhes']) || 9;
    const totalInvestmentIndex = getColumnIndex(['valor_total_investimento', 'investimento_total']) || 10;
    const monthlyReturnIndex = getColumnIndex(['remuneracao_mensal', 'retorno_mensal']) || 11;
    const monthlyReturnPercentIndex = getColumnIndex(['rentabilidade_mensal']) || 12;
    const operatorFeeIndex = getColumnIndex(['operadora_adicional', 'raes_operadora']) || 13;
    const annualReturnIndex = getColumnIndex(['remuneracao_anual', 'retorno_anual']) || 14;
    const annualReturnPercentIndex = getColumnIndex(['rentabilidade_anual']) || 15;
    const contractDurationIndex = getColumnIndex(['periodo_contrato', 'contrato']) || 16;
    const totalContractValueIndex = getColumnIndex(['remuneracao_total', 'contrato_total']) || 17;
    const totalContractPercentIndex = getColumnIndex(['rentabilidade_total']) || 18;
    const paybackIndex = getColumnIndex(['payback']) || 19;
    const expiryLucrativePercentageIndex = getColumnIndex(['expiry']) || 20;
    const cagrIndex = getColumnIndex(['cagr']) || 21;
    const topMarketIndex = getColumnIndex(['maior_mercado']) || 22;
    const growthRegionIndex = getColumnIndex(['mercado_crescimento']) || 23;
    const currentYearIndex = getColumnIndex(['ano_atual']) || 24;
    const projectedYearIndex = getColumnIndex(['ano_projetado']) || 25;
    const currentValueIndex = getColumnIndex(['valor_atual']) || 26;
    const projectedValueIndex = getColumnIndex(['valor_projetado']) || 27;
    const mapUrlIndex = getColumnIndex(['maps', 'google_maps']) || 28;
    const locationImageIndex = getColumnIndex(['imagem_terreno', 'terreno_imagem']) || 29;
    const towerImageIndex = getColumnIndex(['imagem_torre', 'torre_imagem']) || 30;
    
    const getValue = (index: number | null, defaultValue: any = ''): any => {
      if (index === null || index >= row.length) return defaultValue;
      return row[index] || defaultValue;
    };
    
    const getNumericValue = (index: number | null, defaultValue: number = 0): number => {
      if (index === null || index >= row.length) return defaultValue;
      const value = row[index];
      if (!value) return defaultValue;
      
      if (typeof value === 'number') return value;
      
      // Try to parse currency or numeric string
      try {
        if (value.includes('R$') || value.includes('.') || value.includes(',')) {
          return parseCurrency(value);
        }
        return parseFloat(value) || defaultValue;
      } catch (e) {
        console.warn(`Failed to parse numeric value: ${value}`, e);
        return defaultValue;
      }
    };
    
    try {
      // Create tower object with mapped data
      const tower: Tower = {
        id: `tower-${i}`,
        name: getValue(projectIndex, `Torre ${i}`),
        location: `${getValue(cityIndex, 'Cidade')} - ${getValue(stateIndex, 'UF')}`,
        coordinates: {
          lat: getNumericValue(latIndex, -23.5505),
          lng: getNumericValue(lngIndex, -46.6333),
        },
        investment: {
          total: getNumericValue(totalInvestmentIndex, 231000),
          land: getNumericValue(landValueIndex, 150400),
          structure: getNumericValue(structureValueIndex, 51000),
          equipment: getNumericValue(equipmentValueIndex, 30000),
          other: getNumericValue(otherIndex, 0),
          locationDetails: getValue(locationDetailsIndex, 'Local pronto para implantação'),
        },
        returns: {
          monthly: getNumericValue(monthlyReturnIndex, 3000),
          annual: getNumericValue(annualReturnIndex, 36000),
          operatorFee: getNumericValue(operatorFeeIndex, 80800),
          totalContractValue: getNumericValue(totalContractValueIndex, 1080000),
          roi: getNumericValue(totalContractPercentIndex, 467.53),
        },
        contract: {
          duration: parseInt(getValue(contractDurationIndex, '30')) || 30,
          periods: getValue(16, '10 + 10 + 10'),
          payback: getNumericValue(paybackIndex, 77),
          expiryLucrativePercentage: getNumericValue(expiryLucrativePercentageIndex, 80.26),
        },
        market: {
          cagr: getNumericValue(cagrIndex, 7.84),
          topMarket: getValue(topMarketIndex, 'América do Norte e Ásia Pacífico'),
          growthRegion: getValue(growthRegionIndex, 'América do Norte e Ásia Pacífico'),
          currentYear: parseInt(getValue(currentYearIndex, '2020')) || 2020,
          projectedYear: parseInt(getValue(projectedYearIndex, '2028')) || 2028,
          currentValue: getNumericValue(currentValueIndex, 7.1),
          projectedValue: getNumericValue(projectedValueIndex, 12.5),
        },
        images: {
          location: getValue(locationImageIndex, '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png'),
          tower: getValue(towerImageIndex, '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png'),
        },
      };
      
      towers.push(tower);
      console.log(`Successfully processed row ${i} into tower:`, tower.name);
    } catch (error) {
      console.error(`Error processing row ${i}:`, error, row);
    }
  }
  
  console.log(`Parsed ${towers.length} towers from ${rows.length-1} rows`);
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
