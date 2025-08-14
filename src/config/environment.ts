export interface EnvironmentConfig {
  geminiApiKey: string;
  apiTimeout: number;
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const geminiApiKey = import.meta.env.VITE_GEMMA_API_KEY;
  
  if (!geminiApiKey) {
    throw new Error('GEMMA_API_KEY is not configured. Please add VITE_GEMMA_API_KEY to your environment variables.');
  }

  return {
    geminiApiKey,
    apiTimeout: 30000, // 30 seconds
  };
};

export const validateApiKey = (apiKey: string): boolean => {
  // Basic validation for Google API key format
  return apiKey.startsWith('AIza') && apiKey.length >= 35;
};