
import { Tower } from "@/types/tower";

/**
 * Converte valores de moeda ou números para o formato numérico
 */
export function parseCurrency(value: string | number): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  
  // Tenta analisar como número simples primeiro
  if (!isNaN(Number(value))) {
    return Number(value);
  }
  
  // Para formato de moeda (R$ 1.234,56)
  try {
    const cleaned = value.replace(/[R$\s.]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  } catch (e) {
    console.error(`Erro ao analisar valor: "${value}"`, e);
    return 0;
  }
}

/**
 * Analisa os dados brutos da planilha em objetos Tower
 */
export function parseTowersData(rows: string[][]): Tower[] {
  if (!rows || rows.length < 2) {
    console.error("Dados insuficientes para análise");
    return [];
  }
  
  const headers = rows[0].map(h => h.toLowerCase().trim());
  console.log("Cabeçalhos detectados:", headers);
  
  const towers: Tower[] = [];
  
  // Pula a linha de cabeçalho
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 3) continue; // Pula linhas vazias
    
    // Função para obter valor baseado nos possíveis nomes de cabeçalho
    const getValue = (fieldNames: string[], defaultValue: any = ''): any => {
      for (const name of fieldNames) {
        const index = headers.indexOf(name.toLowerCase());
        if (index !== -1 && index < row.length) {
          return row[index] || defaultValue;
        }
      }
      return defaultValue;
    };
    
    // Função para obter valor numérico
    const getNumericValue = (fieldNames: string[], defaultValue = 0): number => {
      const value = getValue(fieldNames);
      return parseCurrency(value || defaultValue);
    };
    
    try {
      const tower: Tower = {
        id: `tower-${i}`,
        name: getValue(['projeto', 'nome', 'nome_projeto', 'torre'], `Torre ${i}`),
        location: `${getValue(['cidade', 'city'])} - ${getValue(['estado', 'state', 'uf'])}`,
        coordinates: {
          lat: getNumericValue(['latitude', 'lat'], -23.5505),
          lng: getNumericValue(['longitude', 'lng', 'long'], -46.6333),
        },
        investment: {
          total: getNumericValue(['valor_total_investimento', 'investimento_total', 'valor_total', 'total']),
          land: getNumericValue(['valor_terreno', 'terreno', 'custo_terreno']),
          structure: getNumericValue(['estrutura', 'valor_estrutura', 'custo_estrutura']),
          equipment: getNumericValue(['equipamentos', 'valor_equipamentos', 'custo_equipamentos']),
          other: getNumericValue(['outras_despesas', 'outros_custos', 'despesas_adicionais']),
          locationDetails: getValue(['local', 'detalhes_local', 'localização'], 'Local pronto para implantação'),
        },
        returns: {
          monthly: getNumericValue(['remuneracao_mensal', 'retorno_mensal']),
          annual: getNumericValue(['remuneracao_anual', 'retorno_anual']),
          operatorFee: getNumericValue(['fee_operador', 'taxa_operador']),
          totalContractValue: getNumericValue(['valor_total_contrato', 'contrato_valor_total']),
          roi: getNumericValue(['roi_%', 'rentabilidade_%', 'rentabilidade_total_%']),
        },
        contract: {
          duration: parseInt(getValue(['duracao_contrato', 'periodo_contrato', 'duracao'], '30')) || 30,
          periods: getValue(['periodos', 'renovacao'], '10 + 10 + 10'),
          payback: getNumericValue(['payback', 'periodo_retorno']),
          expiryLucrativePercentage: getNumericValue(['lucratividade_expiracao', 'lucratividade_%']),
        },
        market: {
          cagr: getNumericValue(['cagr_%', 'taxa_crescimento_%']),
          topMarket: getValue(['mercado_principal', 'maior_mercado'], 'América do Norte e Ásia Pacífico'),
          growthRegion: getValue(['regiao_crescimento', 'regiao_crescimento_rapido'], 'América do Norte e Ásia Pacífico'),
          currentYear: getNumericValue(['ano_atual'], 2024),
          projectedYear: getNumericValue(['ano_projetado'], 2029),
          currentValue: getNumericValue(['valor_mercado_atual', 'mercado_atual_usd'], 7.1),
          projectedValue: getNumericValue(['valor_mercado_projetado', 'mercado_projetado_usd'], 12.5),
        },
        images: {
          location: getValue(['imagem_terreno_url', 'url_imagem_terreno'], '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png'),
          tower: getValue(['imagem_torre_url', 'url_imagem_torre'], '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png'),
        },
        source: 'sheets'
      };
      
      // Ajuste adicional para periodicidade de contrato
      if (tower.contract.periods.includes('+')) {
        const parts = tower.contract.periods.split('+').map(p => parseInt(p.trim()));
        const validParts = parts.filter(p => !isNaN(p));
        if (validParts.length > 0) {
          tower.contract.duration = validParts.reduce((sum, val) => sum + val, 0);
        }
      }
      
      towers.push(tower);
      console.log(`Torre analisada: ${tower.name}`);
    } catch (error) {
      console.error(`Erro ao processar linha ${i}:`, error);
    }
  }
  
  console.log(`Análise concluída: ${towers.length} torres encontradas`);
  return towers;
}
