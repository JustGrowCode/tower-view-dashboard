
/**
 * Service to handle diagnostics and logging
 */

/**
 * Store HTTP status in localStorage for diagnostics
 */
export function storeHttpStatus(status: number): void {
  localStorage.setItem('lastHttpStatus', status.toString());
}

/**
 * Performs a fetch with timeout and diagnostics
 */
export async function performFetch(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const startTime = Date.now();
    const response = await fetch(url, { 
      ...options,
      signal: controller.signal
    });
    
    const endTime = Date.now();
    console.log(`Fetch completed in ${endTime - startTime}ms with status ${response.status}`);
    
    // Store diagnostic information
    storeHttpStatus(response.status);
    
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Log diagnostic information about the fetch operation
 */
export function logDiagnosticInfo(message: string, data?: any): void {
  console.log(`[Sheets Diagnostic] ${message}`, data || '');
}
