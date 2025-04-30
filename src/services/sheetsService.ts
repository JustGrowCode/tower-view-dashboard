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
    
    // Mapeamento direto dos cabeçalhos para índices
    const headerMap: { [key: string]: number } = {};
    headers.forEach((header, index) => {
      headerMap[header.toLowerCase().trim()] = index;
    });
    
    console.log("Header mapping:", headerMap);
    
    // Obter valor com base no cabeçalho, com fallback para índices fixos se necessário
    const getValue = (headerNames: string[], defaultIndex?: number, defaultValue: any = ''): any => {
      for (const name of headerNames) {
        const normalizedName = name.toLowerCase().trim();
        if (headerMap[normalizedName] !== undefined) {
          const value = row[headerMap[normalizedName]];
          return value !== undefined ? value : defaultValue;
        }
      }
      
      // Fallback para índice fixo se fornecido
      if (defaultIndex !== undefined && defaultIndex < row.length) {
        return row[defaultIndex];
      }
      
      return defaultValue;
    };
    
    // Obter valor numérico
    const getNumericValue = (headerNames: string[], defaultIndex?: number, defaultValue = 0): number => {
      const value = getValue(headerNames, defaultIndex);
      
      if (!value) return defaultValue;
      if (typeof value === 'number') return value;
      
      try {
        // Tentar analisar como moeda ou número
        if (typeof value === 'string' && (value.includes('R$') || value.includes('.') || value.includes(','))) {
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
        name: getValue(['projeto', 'projeto'], 1, `Torre ${i}`),
        location: `${getValue(['cidade'], 2, 'Cidade')} - ${getValue(['estado'], 3, 'UF')}`,
        coordinates: {
          lat: getNumericValue(['latitude', 'lat'], undefined, -23.5505),
          lng: getNumericValue(['longitude', 'lng'], undefined, -46.6333),
        },
        investment: {
          total: getNumericValue(['valor_total_investimento'], 10, 231000),
          land: getNumericValue(['valor_terreno'], 5, 150400),
          structure: getNumericValue(['estrutura'], 6, 51000),
          equipment: getNumericValue(['equipamentos'], 7, 30000),
          other: getNumericValue(['despesas_documentacao'], 8, 0),
          locationDetails: getValue(['local', 'localização', 'detalhes'], 9, 'Local pronto para implantação'),
        },
        returns: {
          monthly: getNumericValue(['remuneracao_mensal_prevista'], 11, 3000),
          annual: getNumericValue(['remuneracao_anual_prevista'], 14, 36000),
          operatorFee: getNumericValue(['operadora_adicional_recebivel'], 13, 80800),
          totalContractValue: getNumericValue(['remuneracao_total_contrato'], 17, 1080000),
          roi: getNumericValue(['rentabilidade_total_contrato_%'], 18, 467.53),
        },
        contract: {
          duration: parseInt(getValue(['periodo_contrato'], 16, '30')) || 30,
          periods: getValue(['periodo'], 16, '10 + 10 + 10'),
          payback: getNumericValue(['payback'], 19, 77),
          expiryLucrativePercentage: getNumericValue(['expiry'], 20, 80.26),
        },
        market: {
          cagr: getNumericValue(['cagr_2024_2029_%'], 21, 7.84),
          topMarket: getValue(['maior_mercado'], 22, 'América do Norte e Ásia Pacífico'),
          growthRegion: getValue(['mercado_crescimento_mais_rapido'], 23, 'América do Norte e Ásia Pacífico'),
          currentYear: parseInt(getValue(['ano_atual'], 24, '2020')) || 2020,
          projectedYear: parseInt(getValue(['ano_projetado'], 25, '2028')) || 2028,
          currentValue: getNumericValue(['tamanho_mercado_2024_usd'], 26, 7.1),
          projectedValue: getNumericValue(['tamanho_mercado_2029_usd'], 27, 12.5),
        },
        images: {
          location: getValue(['imagem_terreno_url'], 28, '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png'),
          tower: getValue(['imagem_torre_url'], 29, '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png'),
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
