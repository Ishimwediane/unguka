import apiClient from './client';

export const authApi = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/auth/login', {
      phone_e164: credentials.phone_e164,
      password: credentials.password,
    });
    return data;
  },
  signup: async (userData) => {
    const { data } = await apiClient.post('/auth/signup', {
      phone_e164: userData.phone_e164,
      password: userData.password,
      role: 'farmer',
      full_name: userData.full_name,
      language: 'rw',
      district: userData.district,
      sector: userData.sector,
      gps_lat: userData.gps_lat || 0,
      gps_lng: userData.gps_lng || 0,
    });
    return data;
  },
};