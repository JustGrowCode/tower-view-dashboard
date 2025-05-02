
/**
 * Service to manage CORS proxies for API requests
 */

// List of CORS proxies to try in order
export const CORS_PROXIES = [
  { name: "corsproxy.io", url: "https://corsproxy.io/?" },
  { name: "cors-anywhere (backup)", url: "https://cors-anywhere.herokuapp.com/" },
  { name: "allorigins", url: "https://api.allorigins.win/raw?url=" }
];

// Track which proxies we've attempted
let currentProxyIndex = 0;
let proxiesAttempted: string[] = [];

/**
 * Reset the proxy tracking state
 */
export function resetProxyState(): void {
  currentProxyIndex = 0;
  proxiesAttempted = [];
  localStorage.removeItem('proxiesAttempted');
}

/**
 * Get the next proxy to try
 */
export function getNextProxy(): { name: string, url: string } {
  const proxy = CORS_PROXIES[currentProxyIndex];
  
  // Track attempted proxies
  if (!proxiesAttempted.includes(proxy.name)) {
    proxiesAttempted.push(proxy.name);
    localStorage.setItem('proxiesAttempted', proxiesAttempted.join(', '));
  }
  
  return proxy;
}

/**
 * Update the current proxy index for the next request
 */
export function updateCurrentProxyIndex(successfulIndex: number): void {
  currentProxyIndex = successfulIndex;
}

/**
 * Get the list of attempted proxies
 */
export function getAttemptedProxies(): string[] {
  return proxiesAttempted;
}
