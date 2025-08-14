import { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
    onEnhance?: () => void;
    onClear?: () => void;
    onEscape?: () => void;
    onFocusInput?: () => void;
    onFocusOutput?: () => void;
    disabled?: boolean;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
    const {
        onEnhance,
        onClear,
        onEscape,
        onFocusInput,
        onFocusOutput,
        disabled = false
    } = options;

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (disabled) return;

        const isInputFocused = document.activeElement?.tagName === 'TEXTAREA' ||
            document.activeElement?.tagName === 'INPUT';

        // Global shortcuts (work anywhere)
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onEnhance?.();
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            onEscape?.();
            return;
        }

        // Only handle these if not in an input field
        if (!isInputFocused) {
            switch (event.key) {
                case 'i':
                case 'I':
                    event.preventDefault();
                    onFocusInput?.();
                    break;

                case 'o':
                case 'O':
                    event.preventDefault();
                    onFocusOutput?.();
                    break;

                case 'c':
                case 'C':
                    if (event.ctrlKey || event.metaKey) {
                        // Let browser handle Ctrl+C
                        return;
                    }
                    event.preventDefault();
                    onClear?.();
                    break;

                case 'Enter':
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        onEnhance?.();
                    }
                    break;
            }
        }
    }, [disabled, onEnhance, onClear, onEscape, onFocusInput, onFocusOutput]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Return helper functions for manual focus management
    return {
        focusInput: () => {
            const input = document.querySelector('textarea') as HTMLTextAreaElement;
            if (input) {
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
            }
        },

        focusOutput: () => {
            const output = document.querySelector('.output-content') as HTMLElement;
            if (output) {
                output.focus();
            }
        },

        focusEnhanceButton: () => {
            const button = document.querySelector('.enhance-button') as HTMLButtonElement;
            if (button && !button.disabled) {
                button.focus();
            }
        }
    };
};