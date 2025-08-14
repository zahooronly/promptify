import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePromptEnhancer } from '../usePromptEnhancer';

// Mock the gemini service
vi.mock('../../services/geminiService', () => ({
    geminiService: {
        enhancePrompt: vi.fn()
    }
}));

describe('usePromptEnhancer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Clear any existing event listeners
        document.removeEventListener('keydown', vi.fn());
    });

    it('initializes with correct default state', () => {
        const { result } = renderHook(() => usePromptEnhancer());

        expect(result.current.state.prompt).toBe('');
        expect(result.current.state.enhancedPrompt).toBe('');
        expect(result.current.state.isLoading).toBe(false);
        expect(result.current.state.error).toBe(null);
        expect(result.current.state.requestHistory).toEqual([]);
    });

    it('updates prompt when setPrompt is called', () => {
        const { result } = renderHook(() => usePromptEnhancer());

        act(() => {
            result.current.actions.setPrompt('test prompt');
        });

        expect(result.current.state.prompt).toBe('test prompt');
    });

    it('clears error when prompt is updated', () => {
        const { result } = renderHook(() => usePromptEnhancer());

        // Set an error first
        act(() => {
            result.current.state.error = new Error('test error') as any;
        });

        act(() => {
            result.current.actions.setPrompt('new prompt');
        });

        expect(result.current.state.error).toBe(null);
    });

    it('validates input correctly', () => {
        const { result } = renderHook(() => usePromptEnhancer());

        // Empty prompt
        expect(result.current.actions.validateInput('')).toBe('Prompt cannot be empty');

        // Too short
        expect(result.current.actions.validateInput('short')).toBe('Prompt is too short (min 10 characters)');

        // Too long
        const longPrompt = 'a'.repeat(4001);
        expect(result.current.actions.validateInput(longPrompt)).toBe('Prompt is too long (max 4000 characters)');

        // Valid prompt
        expect(result.current.actions.validateInput('This is a valid prompt for testing')).toBe(null);
    });

    it('computes isEnhanceDisabled correctly', () => {
        const { result } = renderHook(() => usePromptEnhancer());

        // Initially disabled (empty prompt)
        expect(result.current.computed.isEnhanceDisabled).toBe(true);

        // Still disabled with invalid prompt
        act(() => {
            result.current.actions.setPrompt('short');
        });
        expect(result.current.computed.isEnhanceDisabled).toBe(true);

        // Enabled with valid prompt
        act(() => {
            result.current.actions.setPrompt('This is a valid prompt for testing');
        });
        expect(result.current.computed.isEnhanceDisabled).toBe(false);
    });

    it('clears all data when clearAll is called', () => {
        const { result } = renderHook(() => usePromptEnhancer());

        // Set some data first
        act(() => {
            result.current.actions.setPrompt('test prompt');
            result.current.state.enhancedPrompt = 'enhanced';
            result.current.state.requestHistory = [{ originalPrompt: 'test', timestamp: Date.now() }];
        });

        act(() => {
            result.current.actions.clearAll();
        });

        expect(result.current.state.prompt).toBe('');
        expect(result.current.state.enhancedPrompt).toBe('');
        expect(result.current.state.requestHistory).toEqual([]);
    });

    it('clears error when clearError is called', () => {
        const { result } = renderHook(() => usePromptEnhancer());

        // Set an error first
        act(() => {
            result.current.state.error = new Error('test error') as any;
        });

        act(() => {
            result.current.actions.clearError();
        });

        expect(result.current.state.error).toBe(null);
    });

    it('computes character count correctly', () => {
        const { result } = renderHook(() => usePromptEnhancer());

        act(() => {
            result.current.actions.setPrompt('test prompt');
        });

        expect(result.current.computed.characterCount).toBe(11);
    });

    it('computes hasHistory correctly', () => {
        const { result } = renderHook(() => usePromptEnhancer());

        expect(result.current.computed.hasHistory).toBe(false);

        // Add to history
        act(() => {
            result.current.state.requestHistory = [{ originalPrompt: 'test', timestamp: Date.now() }];
        });

        expect(result.current.computed.hasHistory).toBe(true);
    });
});