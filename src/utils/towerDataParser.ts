
import { Tower } from "@/types/tower";

/**
 * Parses currency strings like "R$ 1.234,56" to number
 * Also handles plain numbers, which is now the preferred format
 */
export function parseCurrency(value: string): number {
  if (!value) return 0;
  
  console.log(`Parsing currency value: "${value}"`);
  
  // Try to parse as a plain number first (preferred format)
  if (!isNaN(Number(value))) {
    const numValue = Number(value);
    console.log(`Parsed as plain number: ${numValue}`);
    return numValue;
  }
  
  // Handle currency format (for backward compatibility)
  try {
    // Remove currency symbol, dots for thousands, and replace comma with dot for decimal
    const cleaned = value.replace(/[R$\s.]/g, '').replace(',', '.');
    const numValue = parseFloat(cleaned);
    console.log(`Parsed from currency format: ${numValue} (from: ${value})`);
    return numValue;
  } catch (e) {
    console.error(`Error parsing currency value: "${value}"`, e);
    return 0;
  }
}

/**
 * Parses raw data from Google Sheets into Tower objects
 */
export function parseTowersData(rows: string[][]): Tower[] {
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
    
    console.log("Header mapping for row:", i, headerMap);
    
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
    
    // Obter valor numérico - melhorado para lidar com números simples
    const getNumericValue = (headerNames: string[], defaultIndex?: number, defaultValue = 0): number => {
      const value = getValue(headerNames, defaultIndex);
      
      if (!value) return defaultValue;
      if (typeof value === 'number') return value;
      
      try {
        // Para valores simples numéricos (formato preferido agora)
        if (typeof value === 'string' && !isNaN(Number(value))) {
          return Number(value);
        }
        
        // Para compatibilidade com formatos de moeda
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
        name: getValue(['projeto'], 1, `Torre ${i}`),
        location: `${getValue(['cidade'], 2, 'Cidade')} - ${getValue(['estado'], 3, 'UF')}`,
        coordinates: {
          lat: getNumericValue(['latitude', 'lat'], undefined, -23.5505),
          lng: getNumericValue(['longitude', 'lng'], undefined, -46.6333),
        },
        investment: {
          total: getNumericValue(['valor_total_investimento'], 10, 231000),
          land: getNumericValue(['valor_terreno'], 5, 150400),
          structure: getNumericValue(['estrutura', 'estimativa_negociacao'], 6, 51000),
          equipment: getNumericValue(['equipamentos', 'comissao_hunter'], 7, 30000),
          other: getNumericValue(['despesas_documentacao'], 8, 0),
          locationDetails: getValue(['local', 'localização', 'detalhes', 'consultoria_estruturacao'], 9, 'Local pronto para implantação'),
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
          periods: getValue(['periodo_contrato'], 16, '10 + 10 + 10'),
          payback: getNumericValue(['payback', 'periodo_estudo'], 19, 77),
          expiryLucrativePercentage: getNumericValue(['expiry'], 20, 80.26),
        },
        market: {
          cagr: getNumericValue(['cagr_2024_2029_%'], 22, 7.84),
          topMarket: getValue(['maior_mercado'], 24, 'América do Norte e Ásia Pacífico'),
          growthRegion: getValue(['mercado_crescimento_mais_rapido'], 23, 'América do Norte e Ásia Pacífico'),
          currentYear: 2024,
          projectedYear: 2029,
          currentValue: getNumericValue(['tamanho_mercado_2024_usd'], 20, 7.1),
          projectedValue: getNumericValue(['tamanho_mercado_2029_usd'], 21, 12.5),
        },
        images: {
          location: getValue(['imagem_terreno_url'], 27, '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png'),
          tower: getValue(['imagem_torre_url'], 28, '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png'),
        },
        source: 'sheets'
      };
      
      // Ajuste adicional para o campo de duração do contrato
      const contractText = tower.contract.periods;
      if (contractText && contractText.includes('anos')) {
        const durationMatch = contractText.match(/(\d+)\s*\+\s*(\d+)\s*\+\s*(\d+)/);
        if (durationMatch) {
          const total = parseInt(durationMatch[1]) + parseInt(durationMatch[2]) + parseInt(durationMatch[3]);
          tower.contract.duration = total;
        } else {
          const yearMatch = contractText.match(/(\d+)\s*anos/);
          if (yearMatch) {
            tower.contract.duration = parseInt(yearMatch[1]);
          }
        }
      }
      
      // Limpeza da string de períodos
      if (tower.contract.periods && tower.contract.periods.includes('anos')) {
        tower.contract.periods = tower.contract.periods.replace(/\s*anos/, '');
      }
      
      towers.push(tower);
      console.log(`Successfully processed row ${i} into tower:`, tower.name);
    } catch (error) {
      console.error(`Error processing row ${i}:`, error, row);
    }
  }
  
  console.log(`Parsed ${towers.length} towers from ${rows.length-1} rows`);
  return towers;
}
