const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = rawApiUrl.endsWith('/api')
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, '')}/api`;

export class ApiError extends Error {
  constructor(public status: number, public message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  options.credentials = 'include';
  
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/pdf')) {
    return response.blob() as unknown as T;
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(
      response.status, 
      data?.message || response.statusText || 'An unexpected error occurred',
      data
    );
  }

  return data as T;
}

export const client = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, body?: any, options?: RequestInit) => 
    apiFetch<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    
  put: <T>(endpoint: string, body?: any, options?: RequestInit) => 
    apiFetch<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    
  patch: <T>(endpoint: string, body?: any, options?: RequestInit) => 
    apiFetch<T>(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    
  delete: <T>(endpoint: string, options?: RequestInit) => 
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};