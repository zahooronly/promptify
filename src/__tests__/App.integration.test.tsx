import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock the gemini service
const mockEnhancePrompt = vi.fn();
vi.mock('../services/geminiService', () => ({
  geminiService: {
    enhancePrompt: mockEnhancePrompt
  }
}));

// Mock clipboard utilities
vi.mock('../utils/clipboardUtils', () => ({
  copyToClipboard: vi.fn(() => Promise.resolve({ success: true, method: 'navigator' })),
  selectText: vi.fn(() => true),
  isClipboardSupported: vi.fn(() => true)
}));

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnhancePrompt.mockClear();
  });

  it('renders the main interface correctly', () => {
    render(<App />);
    
    expect(screen.getByText('Promptify')).toBeInTheDocument();
    expect(screen.getByText('Enhance your prompts with AI')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter your prompt:')).toBeInTheDocument();
    expect(screen.getByText('Enhance')).toBeInTheDocument();
  });

  it('shows validation error for short prompt', async () => {
    render(<App />);
    
    const textarea = screen.getByRole('textbox');
    const enhanceButton = screen.getByText('Enhance');
    
    fireEvent.change(textarea, { target: { value: 'short' } });
    
    await waitFor(() => {
      expect(enhanceButton).toBeDisabled();
    });
  });

  it('enables enhance button for valid prompt', async () => {
    render(<App />);
    
    const textarea = screen.getByRole('textbox');
    const enhanceButton = screen.getByText('Enhance');
    
    fireEvent.change(textarea, { target: { value: 'This is a valid prompt for testing purposes' } });
    
    await waitFor(() => {
      expect(enhanceButton).not.toBeDisabled();
    });
  });

  it('handles successful prompt enhancement', async () => {
    mockEnhancePrompt.mockResolvedValue('Enhanced prompt result');
    
    render(<App />);
    
    const textarea = screen.getByRole('textbox');
    const enhanceButton = screen.getByText('Enhance');
    
    fireEvent.change(textarea, { target: { value: 'This is a valid prompt for testing purposes' } });
    fireEvent.click(enhanceButton);
    
    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Enhancing...')).toBeInTheDocument();
    });
    
    // Should show result
    await waitFor(() => {
      expect(screen.getByText('Enhanced prompt result')).toBeInTheDocument();
    });
    
    expect(mockEnhancePrompt).toHaveBeenCalledWith('This is a valid prompt for testing purposes');
  });

  it('handles enhancement errors', async () => {
    const error = new Error('API Error');
    error.name = 'AppError';
    (error as any).type = 'NETWORK_ERROR';
    (error as any).retryable = true;
    
    mockEnhancePrompt.mockRejectedValue(error);
    
    render(<App />);
    
    const textarea = screen.getByRole('textbox');
    const enhanceButton = screen.getByText('Enhance');
    
    fireEvent.change(textarea, { target: { value: 'This is a valid prompt for testing purposes' } });
    fireEvent.click(enhanceButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
  });

  it('shows character count', async () => {
    render(<App />);
    
    const textarea = screen.getByRole('textbox');
    
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    
    await waitFor(() => {
      expect(screen.getByText('11/4000')).toBeInTheDocument();
    });
  });

  it('shows copy functionality when content exists', async () => {
    mockEnhancePrompt.mockResolvedValue('Enhanced prompt result');
    
    render(<App />);
    
    const textarea = screen.getByRole('textbox');
    const enhanceButton = screen.getByText('Enhance');
    
    fireEvent.change(textarea, { target: { value: 'This is a valid prompt for testing purposes' } });
    fireEvent.click(enhanceButton);
    
    await waitFor(() => {
      expect(screen.getByText('📋 Copy')).toBeInTheDocument();
      expect(screen.getByText('Select All')).toBeInTheDocument();
    });
  });

  it('handles keyboard shortcuts', async () => {
    mockEnhancePrompt.mockResolvedValue('Enhanced prompt result');
    
    render(<App />);
    
    const textarea = screen.getByRole('textbox');
    
    fireEvent.change(textarea, { target: { value: 'This is a valid prompt for testing purposes' } });
    
    // Test Ctrl+Enter shortcut
    fireEvent.keyDown(document, { key: 'Enter', ctrlKey: true });
    
    await waitFor(() => {
      expect(mockEnhancePrompt).toHaveBeenCalled();
    });
  });

  it('shows help tooltip', () => {
    render(<App />);
    
    const helpButton = screen.getByLabelText('Show keyboard shortcuts');
    expect(helpButton).toBeInTheDocument();
    
    fireEvent.click(helpButton);
    
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
  });

  it('clears all data when clear button is clicked', async () => {
    mockEnhancePrompt.mockResolvedValue('Enhanced prompt result');
    
    render(<App />);
    
    const textarea = screen.getByRole('textbox');
    const enhanceButton = screen.getByText('Enhance');
    
    // Add some content
    fireEvent.change(textarea, { target: { value: 'This is a valid prompt for testing purposes' } });
    fireEvent.click(enhanceButton);
    
    await waitFor(() => {
      expect(screen.getByText('Enhanced prompt result')).toBeInTheDocument();
    });
    
    // Clear all
    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);
    
    await waitFor(() => {
      expect(textarea).toHaveValue('');
      expect(screen.queryByText('Enhanced prompt result')).not.toBeInTheDocument();
    });
  });
});