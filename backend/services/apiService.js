const fetch = require('node-fetch');
const { CRM_BASE_URL, MTV_BASE_URL, CRM_HEADERS, MTV_HEADERS } = require('../config/apiConfig');

const apiRequest = async (baseUrl, endpoint, method = 'GET', headers, body = null) => {
  const url = `${baseUrl}/${endpoint}`;
  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} - ${data.message || 'Unknown error'}`);
    }

    return data;
  } catch (error) {
    console.error(`Error in API request to ${url}:`, error);
    throw error;
  }
};

module.exports = {
  crmRequest: (endpoint, method = 'GET', body = null) =>
    apiRequest(CRM_BASE_URL, endpoint, method, CRM_HEADERS, body),
  mtvRequest: (endpoint, method = 'GET', body = null) =>
    apiRequest(MTV_BASE_URL, endpoint, method, MTV_HEADERS, body),
};