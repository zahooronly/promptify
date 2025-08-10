import { GoogleGenAI } from "@google/genai";
import { getEnvironmentConfig, validateApiKey } from '../config/environment';
import type { GeminiService, GeminiServiceConfig } from './types';
import { AppErrorClass, ErrorType } from '../types';
import { buildGrandPrompt } from '../prompts/grandPrompt';

export class GeminiServiceImpl implements GeminiService {
    private ai: GoogleGenAI;
    private config: GeminiServiceConfig;

    constructor() {
        const envConfig = getEnvironmentConfig();

        if (!validateApiKey(envConfig.geminiApiKey)) {
            throw new Error('Invalid API key format');
        }

        this.config = {
            apiKey: envConfig.geminiApiKey,
            timeout: envConfig.apiTimeout,
            model: "gemini-2.0-flash-exp"
        };

        this.ai = new GoogleGenAI({
            apiKey: this.config.apiKey
        });
    }

    async enhancePrompt(prompt: string, targetModel: string = 'Gemini'): Promise<string> {
        if (!prompt || prompt.trim().length === 0) {
            throw this.createError(ErrorType.INVALID_INPUT, 'Prompt cannot be empty');
        }

        if (prompt.length > 4000) {
            throw this.createError(ErrorType.INVALID_INPUT, 'Prompt is too long (max 4000 characters)');
        }

        try {
            const enhancementPrompt = this.buildEnhancementPrompt(prompt, targetModel);

            const response = await Promise.race([
                this.ai.models.generateContent({
                    model: this.config.model,
                    contents: enhancementPrompt,
                }),
                this.createTimeoutPromise()
            ]);

            if (!response || !response.text) {
                throw this.createError(ErrorType.UNKNOWN_ERROR, 'No response received from AI service');
            }

            return response.text.trim();
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    private buildEnhancementPrompt(originalPrompt: string, targetModel: string = 'Gemini'): string {
        return buildGrandPrompt(originalPrompt, targetModel);
    }

    private createTimeoutPromise(): Promise<never> {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(this.createError(ErrorType.NETWORK_ERROR, 'Request timed out'));
            }, this.config.timeout);
        });
    }

    private handleApiError(error: any): AppErrorClass {
        console.error('Gemini API Error:', error);

        if (error instanceof AppErrorClass) {
            return error;
        }

        // Handle specific API errors
        if (error.message?.includes('API key')) {
            return this.createError(ErrorType.AUTHENTICATION_ERROR, 'Invalid API key');
        }

        if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
            return this.createError(ErrorType.RATE_LIMIT_ERROR, 'API rate limit exceeded. Please try again later.');
        }

        if (error.message?.includes('network') || error.message?.includes('fetch')) {
            return this.createError(ErrorType.NETWORK_ERROR, 'Network error. Please check your connection.');
        }

        return this.createError(ErrorType.UNKNOWN_ERROR, 'An unexpected error occurred');
    }

    private createError(type: ErrorType, message: string, details?: string): AppErrorClass {
        return new AppErrorClass(
            type,
            message,
            details,
            type === ErrorType.NETWORK_ERROR || type === ErrorType.RATE_LIMIT_ERROR
        );
    }
}

// Export singleton instance
export const geminiService = new GeminiServiceImpl();