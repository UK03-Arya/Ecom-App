import apiClient from './client';
import { Product } from '../types';

export const getProducts = async (): Promise<{ products: Product[] }> => {
  const response = await apiClient.get('/products');
  return response.data;
};
