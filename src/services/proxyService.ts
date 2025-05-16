
/**
 * Service to manage CORS proxies for API requests
 */

// Lista de proxies CORS para tentar, em ordem de prioridade
export const CORS_PROXIES = [
  "https://corsproxy.io/?",
  "https://proxy.cors.sh/",
  "https://cors-proxy.htmldriven.com/?url=",
  "https://api.allorigins.win/raw?url="
];

// Estado do último proxy bem-sucedido
let lastSuccessfulProxy: string | null = null;

/**
 * Tenta fazer uma requisição usando diferentes proxies CORS
 * @param url URL original para requisição
 * @param options Opções do fetch
 * @returns Resposta da requisição
 */
export async function fetchWithCorsProxy(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  console.log(`[ProxyService] Iniciando requisição para: ${url}`);
  
  // Se já sabemos de um proxy que funcionou antes, tentamos ele primeiro
  if (lastSuccessfulProxy) {
    console.log(`[ProxyService] Tentando usar último proxy bem-sucedido: ${lastSuccessfulProxy}`);
    try {
      const proxyUrl = lastSuccessfulProxy + encodeURIComponent(url);
      const response = await fetch(proxyUrl, options);
      
      if (response.ok) {
        console.log(`[ProxyService] Proxy anterior funcionou: ${lastSuccessfulProxy}`);
        return response;
      } else {
        console.warn(`[ProxyService] Proxy anterior falhou com status ${response.status}`);
        // Continua para tentar outros proxies
      }
    } catch (error) {
      console.warn(`[ProxyService] Proxy anterior falhou: ${error}`);
      // Continua para tentar outros proxies
    }
  }

  // Adiciona timestamp para evitar cache
  const timestampedUrl = url.includes('?') 
    ? `${url}&_t=${Date.now()}` 
    : `${url}?_t=${Date.now()}`;
  
  // Tenta cada proxy em sequência
  for (const proxy of CORS_PROXIES) {
    try {
      console.log(`[ProxyService] Tentando proxy: ${proxy}`);
      const proxyUrl = proxy + encodeURIComponent(timestampedUrl);
      
      // Timeout de 15 segundos para cada tentativa
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(proxyUrl, {
        ...options,
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log(`[ProxyService] Proxy funcionou: ${proxy}`);
        lastSuccessfulProxy = proxy; // Armazena o proxy bem-sucedido
        return response;
      } else {
        console.error(`[ProxyService] Erro HTTP ${response.status} com proxy ${proxy}`);
      }
    } catch (error) {
      console.error(`[ProxyService] Falha com proxy ${proxy}:`, error);
    }
  }
  
  throw new Error("Todos os proxies CORS falharam. Não foi possível acessar a URL.");
}

/**
 * Reseta o estado do proxy
 */
export function resetProxyState(): void {
  lastSuccessfulProxy = null;
  console.log("[ProxyService] Estado do proxy resetado");
}

