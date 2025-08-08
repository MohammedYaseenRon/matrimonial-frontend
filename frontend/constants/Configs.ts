const SERVER_URL = process.env.NODE_ENV === 'production' 
  ? '/api'
  : process.env.EXPO_PUBLIC_SERVER_BASE_URL || 'http://localhost:3000';

export const Configs = {
  SERVER_URL,
  // Add other configurations as needed
};