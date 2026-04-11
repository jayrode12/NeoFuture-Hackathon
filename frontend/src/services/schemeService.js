const API_URL = 'http://localhost:8000/api';

export const schemeService = {
  getMatchedSchemes: async (token) => {
    const response = await fetch(`${API_URL}/schemes/matched`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getAllSchemes: async () => {
    const response = await fetch(`${API_URL}/schemes`);
    return response.json();
  },

  applyForScheme: async (schemeId, token) => {
    const response = await fetch(`${API_URL}/applications/apply?schemeId=${schemeId}`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getSchemeInsights: async (schemeId, token) => {
    const response = await fetch(`${API_URL}/intelligence/insights/${schemeId}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};
