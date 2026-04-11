const API_URL = 'http://localhost:8000/api';

export const applicationService = {
  getMyApplications: async (token) => {
    const response = await fetch(`${API_URL}/applications/my`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  trackApplication: async (applicationId) => {
    const response = await fetch(`${API_URL}/applications/track/${applicationId}`);
    return response.json();
  }
};
