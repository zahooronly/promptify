import type { AppError } from '../types';

export interface GeminiService {
    enhancePrompt(prompt: string, targetModel?: string): Promise<string>;
}

export interface GeminiServiceConfig {
    apiKey: string;
    timeout: number;
    model: string;
}

export interface GeminiApiResponse {
    text: string;
    success: boolean;
    error?: AppError;
}

export interface EnhancementOptions {
    maxLength?: number;
    style?: 'professional' | 'creative' | 'concise' | 'detailed';
    temperature?: number;
}