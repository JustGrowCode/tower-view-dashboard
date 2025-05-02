
import { Tower } from "@/types/tower";

/**
 * Parses currency strings like "R$ 1.234,56" to number
 * Also handles plain numbers, which is now the preferred format
 */
export function parseCurrency(value: string): number {
  if (!value) return 0;
  
  console.log(`Analisando valor de moeda: "${value}"`);
  
  // Try to parse as a plain number first (preferred format)
  if (!isNaN(Number(value))) {
    const numValue = Number(value);
    console.log(`Analisado como número simples: ${numValue}`);
    return numValue;
  }
  
  // Handle currency format (for backward compatibility)
  try {
    // Remove currency symbol, dots for thousands, and replace comma with dot for decimal
    const cleaned = value.replace(/[R$\s.]/g, '').replace(',', '.');
    const numValue = parseFloat(cleaned);
    console.log(`Analisado a partir do formato de moeda: ${numValue} (de: ${value})`);
    return numValue;
  } catch (e) {
    console.error(`Erro ao analisar valor de moeda: "${value}"`, e);
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
  console.log("Cabeçalhos da planilha:", headers);
  const towers: Tower[] = [];
  
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 3) {
      console.warn(`Pulando linha ${i} devido a dados insuficientes:`, row);
      continue; // Skip empty rows
    }
    
    // Mapeamento direto dos cabeçalhos para índices
    const headerMap: { [key: string]: number } = {};
    headers.forEach((header, index) => {
      headerMap[header.toLowerCase().trim()] = index;
    });
    
    console.log("Mapeamento de cabeçalhos para linha:", i, headerMap);
    
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
        console.warn(`Falha ao analisar valor numérico: ${value}`, e);
        return defaultValue;
      }
    };
    
    try {
      // Create tower object with mapped data - Melhorado o mapeamento para aumentar as chances de encontrar os valores corretos
      const tower: Tower = {
        id: `tower-${i}`,
        name: getValue(['projeto', 'nome', 'nome_do_projeto', 'name'], 0, `Torre ${i}`),
        location: `${getValue(['cidade', 'city'], 1, 'Cidade')} - ${getValue(['estado', 'state', 'uf'], 2, 'UF')}`,
        coordinates: {
          lat: getNumericValue(['latitude', 'lat'], undefined, -23.5505),
          lng: getNumericValue(['longitude', 'lng', 'long'], undefined, -46.6333),
        },
        investment: {
          total: getNumericValue(['valor_total_investimento', 'valor_total', 'investimento_total', 'total_investimento'], undefined, 231000),
          land: getNumericValue(['valor_terreno', 'terreno', 'custo_terreno'], undefined, 150400),
          structure: getNumericValue(['estrutura', 'valor_estrutura', 'custo_estrutura', 'estimativa_negociacao'], undefined, 51000),
          equipment: getNumericValue(['equipamentos', 'valor_equipamentos', 'custo_equipamentos', 'comissao_hunter'], undefined, 30000),
          other: getNumericValue(['despesas_documentacao', 'outras_despesas', 'outros_custos'], undefined, 0),
          locationDetails: getValue(['local', 'localização', 'detalhes', 'detalhes_local', 'consultoria_estruturacao'], undefined, 'Local pronto para implantação'),
        },
        returns: {
          monthly: getNumericValue(['remuneracao_mensal_prevista', 'remuneracao_mensal', 'retorno_mensal'], undefined, 3000),
          annual: getNumericValue(['remuneracao_anual_prevista', 'remuneracao_anual', 'retorno_anual'], undefined, 36000),
          operatorFee: getNumericValue(['operadora_adicional_recebivel', 'fee_operador', 'taxa_operador'], undefined, 80800),
          totalContractValue: getNumericValue(['remuneracao_total_contrato', 'valor_total_contrato', 'contrato_valor_total'], undefined, 1080000),
          roi: getNumericValue(['rentabilidade_total_contrato_%', 'roi_%', 'rentabilidade_total_%'], undefined, 467.53),
        },
        contract: {
          duration: parseInt(getValue(['periodo_contrato', 'duracao_contrato', 'duracao'], undefined, '30')) || 30,
          periods: getValue(['periodo_contrato', 'periodos', 'renovacao'], undefined, '10 + 10 + 10'),
          payback: getNumericValue(['payback', 'periodo_retorno', 'periodo_estudo'], undefined, 77),
          expiryLucrativePercentage: getNumericValue(['expiry', 'lucratividade_expiracao', 'lucratividade_%'], undefined, 80.26),
        },
        market: {
          cagr: getNumericValue(['cagr_2024_2029_%', 'cagr_%', 'taxa_crescimento_%'], undefined, 7.84),
          topMarket: getValue(['maior_mercado', 'mercado_principal', 'principal_mercado'], undefined, 'América do Norte e Ásia Pacífico'),
          growthRegion: getValue(['mercado_crescimento_mais_rapido', 'regiao_crescimento', 'regiao_crescimento_rapido'], undefined, 'América do Norte e Ásia Pacífico'),
          currentYear: getNumericValue(['ano_atual'], undefined, 2024),
          projectedYear: getNumericValue(['ano_projetado'], undefined, 2029),
          currentValue: getNumericValue(['tamanho_mercado_2024_usd', 'valor_mercado_atual', 'mercado_atual_usd'], undefined, 7.1),
          projectedValue: getNumericValue(['tamanho_mercado_2029_usd', 'valor_mercado_projetado', 'mercado_projetado_usd'], undefined, 12.5),
        },
        images: {
          location: getValue(['imagem_terreno_url', 'url_imagem_terreno', 'foto_local'], undefined, '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png'),
          tower: getValue(['imagem_torre_url', 'url_imagem_torre', 'foto_torre'], undefined, '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png'),
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
      console.log(`Linha ${i} processada com sucesso como torre:`, tower.name);
    } catch (error) {
      console.error(`Erro ao processar linha ${i}:`, error, row);
    }
  }
  
  console.log(`Analisadas ${towers.length} torres a partir de ${rows.length-1} linhas`);
  return towers;
}
