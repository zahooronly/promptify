import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiServiceImpl } from '../geminiService';
import { ErrorType } from '../../types';

// Mock the GoogleGenAI module
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn()
    }
  }))
}));

// Mock environment config
vi.mock('../../config/environment', () => ({
  getEnvironmentConfig: vi.fn(() => ({
    geminiApiKey: 'AIzaSyDJhlgptXdfdKL54TJY73C8CFnfDDKrr7A',
    apiTimeout: 5000
  })),
  validateApiKey: vi.fn(() => true)
}));

describe('GeminiService', () => {
  let service: GeminiServiceImpl;
  let mockGenerateContent: any;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new GeminiServiceImpl();
    mockGenerateContent = service['ai'].models.generateContent;
  });

  describe('enhancePrompt', () => {
    it('should enhance a valid prompt successfully', async () => {
      const mockResponse = { text: 'Enhanced prompt text' };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await service.enhancePrompt('Original prompt');

      expect(result).toBe('Enhanced prompt text');
      expect(mockGenerateContent).toHaveBeenCalledWith({
        model: 'gemini-2.0-flash-exp',
        contents: expect.stringContaining('Original prompt')
      });
    });

    it('should throw error for empty prompt', async () => {
      await expect(service.enhancePrompt('')).rejects.toMatchObject({
        type: ErrorType.INVALID_INPUT,
        message: 'Prompt cannot be empty'
      });
    });

    it('should throw error for prompt that is too long', async () => {
      const longPrompt = 'a'.repeat(4001);
      
      await expect(service.enhancePrompt(longPrompt)).rejects.toMatchObject({
        type: ErrorType.INVALID_INPUT,
        message: 'Prompt is too long (max 4000 characters)'
      });
    });

    it('should handle API authentication errors', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API key invalid'));

      await expect(service.enhancePrompt('test')).rejects.toMatchObject({
        type: ErrorType.AUTHENTICATION_ERROR,
        message: 'Invalid API key'
      });
    });

    it('should handle network errors', async () => {
      mockGenerateContent.mockRejectedValue(new Error('network error'));

      await expect(service.enhancePrompt('test')).rejects.toMatchObject({
        type: ErrorType.NETWORK_ERROR,
        message: 'Network error. Please check your connection.'
      });
    });

    it('should handle rate limit errors', async () => {
      mockGenerateContent.mockRejectedValue(new Error('quota exceeded'));

      await expect(service.enhancePrompt('test')).rejects.toMatchObject({
        type: ErrorType.RATE_LIMIT_ERROR,
        message: 'API rate limit exceeded. Please try again later.'
      });
    });
  });
});