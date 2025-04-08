import { API_CONFIG } from '../config/constants';

const apiHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'api_key': API_CONFIG.API_KEY,
};

export const apiService = {
  async get(endpoint, params = {}) {
    const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    const response = await fetch(url, {
      method: 'GET',
      headers: apiHeaders,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
};