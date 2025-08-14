import { useState, useCallback } from 'react';
import type { ToastProps } from '../components/Toast';

interface ToastOptions {
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

interface UseToastReturn {
    toasts: ToastProps[];
    showToast: (message: string, options?: ToastOptions) => string;
    removeToast: (id: string) => void;
    clearAllToasts: () => void;
}

export const useToast = (): UseToastReturn => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const showToast = useCallback((message: string, options: ToastOptions = {}): string => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast: ToastProps = {
            id,
            message,
            type: options.type || 'info',
            duration: options.duration,
            onClose: removeToast
        };

        setToasts(prev => [...prev, newToast]);
        return id;
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    return {
        toasts,
        showToast,
        removeToast,
        clearAllToasts
    };
};