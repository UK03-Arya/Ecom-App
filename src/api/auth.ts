import apiClient from './client';

export const login = (username: string, password: string) => {
  return apiClient.post('/auth/login', { username, password });
};
