import NetInfo from '@react-native-community/netinfo';

export const API_URL = 'https://api.npoint.io/866592d4df655060f42c';

// Custom error so the UI layer can distinguish "no internet" from
// "server/API failure" and show the right message in each case.
export class AppError extends Error {
  constructor(message, type = 'GENERIC') {
    super(message);
    this.type = type; // 'NO_INTERNET' | 'HTTP' | 'PARSE' | 'GENERIC'
  }
}

/**
 * Fetches the product list.
 * Throws AppError with a specific `type` so screens can render
 * the right message ("No Internet Connection" vs API failure text).
 */
export async function fetchProducts() {
  // 1. Check connectivity before even attempting the request.
  const netState = await NetInfo.fetch();
  if (!netState.isConnected || netState.isInternetReachable === false) {
    throw new AppError('No Internet Connection', 'NO_INTERNET');
  }

  let response;
  try {
    response = await fetch(API_URL);
  } catch (err) {
    // fetch() itself throws on network-level failures (DNS, timeout, etc.)
    throw new AppError('No Internet Connection', 'NO_INTERNET');
  }

  if (!response.ok) {
    throw new AppError(
      `Failed to load products (Error ${response.status}: ${response.statusText})`,
      'HTTP'
    );
  }

  try {
    const data = await response.json();
    return data;
  } catch (err) {
    throw new AppError('Failed to parse product data from server.', 'PARSE');
  }
}
