import { vi } from 'vitest';

// Mock environment variables
vi.mock('../config/environment', () => ({
    getEnvironmentConfig: vi.fn(() => ({
        geminiApiKey: 'test-api-key',
        apiTimeout: 5000
    })),
    validateApiKey: vi.fn(() => true)
}));

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
        readText: vi.fn(() => Promise.resolve(''))
    }
});

// Mock window.getSelection
Object.assign(window, {
    getSelection: vi.fn(() => ({
        removeAllRanges: vi.fn(),
        addRange: vi.fn(),
        toString: vi.fn(() => '')
    }))
});

// Mock document.createRange
Object.assign(document, {
    createRange: vi.fn(() => ({
        selectNodeContents: vi.fn(),
        setStart: vi.fn(),
        setEnd: vi.fn()
    }))
});

// Mock execCommand
Object.assign(document, {
    execCommand: vi.fn(() => true)
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
}));