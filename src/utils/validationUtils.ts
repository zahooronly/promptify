/**
 * Input validation utilities
 */

export interface ValidationResult {
    isValid: boolean;
    error?: string;
    warnings?: string[];
}

export const validatePrompt = (prompt: string): ValidationResult => {
    const trimmed = prompt.trim();
    const warnings: string[] = [];

    // Empty check
    if (!trimmed) {
        return {
            isValid: false,
            error: 'Prompt cannot be empty'
        };
    }

    // Length checks
    if (trimmed.length < 10) {
        return {
            isValid: false,
            error: 'Prompt is too short (minimum 10 characters)'
        };
    }

    if (trimmed.length > 4000) {
        return {
            isValid: false,
            error: 'Prompt is too long (maximum 4000 characters)'
        };
    }

    // Warning for very long prompts
    if (trimmed.length > 3500) {
        warnings.push('Very long prompt may take more time to process');
    }

    // Check for potentially problematic content
    if (trimmed.length < 20) {
        warnings.push('Short prompts may produce less detailed enhancements');
    }

    // Check for repeated characters (potential spam)
    const repeatedPattern = /(.)\1{10,}/;
    if (repeatedPattern.test(trimmed)) {
        warnings.push('Detected repeated characters - this may affect enhancement quality');
    }

    // Check for excessive whitespace
    const excessiveWhitespace = /\s{5,}/;
    if (excessiveWhitespace.test(prompt)) {
        warnings.push('Consider removing excessive whitespace');
    }

    // Check for common formatting issues
    if (prompt !== trimmed) {
        warnings.push('Leading or trailing whitespace will be ignored');
    }

    return {
        isValid: true,
        warnings: warnings.length > 0 ? warnings : undefined
    };
};

export const sanitizePrompt = (prompt: string): string => {
    return prompt
        .trim()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n{3,}/g, '\n\n'); // Replace multiple newlines with double newline
};

export const getPromptStats = (prompt: string): {
    characters: number;
    words: number;
    lines: number;
    estimatedTokens: number;
} => {
    const trimmed = prompt.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = trimmed ? trimmed.split('\n').length : 0;

    // Rough token estimation (1 token ≈ 4 characters for English)
    const estimatedTokens = Math.ceil(trimmed.length / 4);

    return {
        characters: trimmed.length,
        words,
        lines,
        estimatedTokens
    };
};

export const suggestImprovements = (prompt: string): string[] => {
    const suggestions: string[] = [];
    const trimmed = prompt.trim();

    if (trimmed.length < 50) {
        suggestions.push('Consider adding more context or details to get better enhancements');
    }

    if (!trimmed.includes('?') && !trimmed.includes('.') && !trimmed.includes('!')) {
        suggestions.push('Adding punctuation can help clarify your intent');
    }

    if (trimmed.toLowerCase() === trimmed) {
        suggestions.push('Consider using proper capitalization for better results');
    }

    if (!/\b(please|help|create|generate|write|explain|describe)\b/i.test(trimmed)) {
        suggestions.push('Starting with action words like "create", "explain", or "help" can improve results');
    }

    return suggestions;
};