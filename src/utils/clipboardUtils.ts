/**
 * Clipboard utilities with fallback support
 */

export interface ClipboardResult {
    success: boolean;
    method: 'navigator' | 'execCommand' | 'selection';
    error?: string;
}

export const copyToClipboard = async (text: string): Promise<ClipboardResult> => {
    if (!text) {
        return { success: false, method: 'navigator', error: 'No text provided' };
    }

    // Method 1: Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return { success: true, method: 'navigator' };
        } catch (error) {
            console.warn('Clipboard API failed:', error);
        }
    }

    // Method 2: Legacy execCommand (deprecated but widely supported)
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
            return { success: true, method: 'execCommand' };
        }
    } catch (error) {
        console.warn('execCommand failed:', error);
    }

    // Method 3: Selection fallback
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);

        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(textArea);
        selection?.removeAllRanges();
        selection?.addRange(range);

        document.body.removeChild(textArea);

        return { success: true, method: 'selection' };
    } catch (error) {
        console.warn('Selection fallback failed:', error);
    }

    return {
        success: false,
        method: 'navigator',
        error: 'All clipboard methods failed'
    };
};

export const selectText = (element: HTMLElement): boolean => {
    try {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection?.removeAllRanges();
        selection?.addRange(range);
        return true;
    } catch (error) {
        console.warn('Text selection failed:', error);
        return false;
    }
};

export const isClipboardSupported = (): boolean => {
    return !!(navigator.clipboard || document.execCommand);
};

export const getClipboardPermission = async (): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> => {
    if (!navigator.permissions || !navigator.clipboard) {
        return 'unsupported';
    }

    try {
        const permission = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
        return permission.state;
    } catch (error) {
        return 'unsupported';
    }
};