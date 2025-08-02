import { describe, it, expect, vi, beforeEach } from 'vitest';
import { copyToClipboard, selectText, isClipboardSupported } from '../clipboardUtils';

describe('clipboardUtils', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Reset DOM
        document.body.innerHTML = '';

        // Mock window.getSelection
        const mockSelection = {
            removeAllRanges: vi.fn(),
            addRange: vi.fn()
        };
        vi.stubGlobal('getSelection', () => mockSelection);

        // Mock document.createRange
        const mockRange = {
            selectNodeContents: vi.fn()
        };
        vi.stubGlobal('createRange', () => mockRange);
    });

    describe('copyToClipboard', () => {
        it('returns error for empty text', async () => {
            const result = await copyToClipboard('');
            expect(result.success).toBe(false);
            expect(result.error).toBe('No text provided');
        });

        it('uses navigator.clipboard when available', async () => {
            const mockWriteText = vi.fn().mockResolvedValue(undefined);
            Object.assign(navigator, {
                clipboard: { writeText: mockWriteText }
            });
            Object.assign(window, { isSecureContext: true });

            const result = await copyToClipboard('test text');

            expect(mockWriteText).toHaveBeenCalledWith('test text');
            expect(result.success).toBe(true);
            expect(result.method).toBe('navigator');
        });

        it('falls back to execCommand when clipboard API fails', async () => {
            // Mock clipboard API to fail
            Object.assign(navigator, {
                clipboard: {
                    writeText: vi.fn().mockRejectedValue(new Error('Clipboard failed'))
                }
            });

            // Mock execCommand to succeed
            const mockExecCommand = vi.fn().mockReturnValue(true);
            Object.assign(document, { execCommand: mockExecCommand });

            const result = await copyToClipboard('test text');

            expect(result.success).toBe(true);
            expect(result.method).toBe('execCommand');
        });

        it('falls back to selection when all methods fail', async () => {
            // Mock all methods to fail
            Object.assign(navigator, { clipboard: undefined });
            Object.assign(document, { execCommand: vi.fn().mockReturnValue(false) });

            const result = await copyToClipboard('test text');

            expect(result.success).toBe(true);
            expect(result.method).toBe('selection');
        });
    });

    describe('selectText', () => {
        it('selects text in element', () => {
            const element = document.createElement('div');
            element.textContent = 'test content';
            document.body.appendChild(element);

            const result = selectText(element);
            expect(result).toBe(true);
        });

        it('handles selection errors gracefully', () => {
            const element = document.createElement('div');

            // Mock getSelection to throw
            vi.stubGlobal('getSelection', () => {
                throw new Error('Selection failed');
            });

            const result = selectText(element);
            expect(result).toBe(false);
        });
    });

    describe('isClipboardSupported', () => {
        it('returns true when clipboard is supported', () => {
            Object.assign(navigator, { clipboard: { writeText: vi.fn() } });
            expect(isClipboardSupported()).toBe(true);
        });

        it('returns true when execCommand is supported', () => {
            Object.assign(navigator, { clipboard: undefined });
            Object.assign(document, { execCommand: vi.fn() });
            expect(isClipboardSupported()).toBe(true);
        });

        it('returns false when no clipboard methods are supported', () => {
            Object.assign(navigator, { clipboard: undefined });
            Object.assign(document, { execCommand: undefined });
            expect(isClipboardSupported()).toBe(false);
        });
    });
});