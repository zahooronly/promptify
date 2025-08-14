import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock the gemini service for E2E tests
const mockEnhancePrompt = vi.fn();
vi.mock('../services/geminiService', () => ({
  geminiService: {
    enhancePrompt: mockEnhancePrompt
  }
}));

describe('End-to-End User Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('complete user flow: input -> enhance -> copy', async () => {
    const user = userEvent.setup();
    mockEnhancePrompt.mockResolvedValue('This is an enhanced version of your prompt with better clarity and structure.');

    render(<App />);

    // Step 1: User enters a prompt
    const textarea = screen.getByLabelText('Enter your prompt:');
    await user.type(textarea, 'Write a blog post about AI');

    // Verify character count updates
    expect(screen.getByText('25/4000')).toBeInTheDocument();

    // Step 2: User clicks enhance button
    const enhanceButton = screen.getByText('Enhance');
    expect(enhanceButton).not.toBeDisabled();
    
    await user.click(enhanceButton);

    // Verify loading state
    expect(screen.getByText('Enhancing...')).toBeInTheDocument();
    expect(enhanceButton).toBeDisabled();

    // Step 3: Wait for enhancement to complete
    await waitFor(() => {
      expect(screen.getByText('This is an enhanced version of your prompt with better clarity and structure.')).toBeInTheDocument();
    });

    // Verify service was called correctly
    expect(mockEnhancePrompt).toHaveBeenCalledWith('Write a blog post about AI');

    // Step 4: User copies the result
    const copyButton = screen.getByText('📋 Copy');
    await user.click(copyButton);

    // Verify copy feedback
    await waitFor(() => {
      expect(screen.getByText('✓ Copied')).toBeInTheDocument();
    });

    // Step 5: Verify history is tracked
    expect(screen.getByText('1 enhancement made')).toBeInTheDocument();
  });

  it('error handling flow', async () => {
    const user = userEvent.setup();
    const error = new Error('Network error');
    (error as any).type = 'NETWORK_ERROR';
    (error as any).retryable = true;
    
    mockEnhancePrompt.mockRejectedValue(error);

    render(<App />);

    // Enter prompt and enhance
    const textarea = screen.getByLabelText('Enter your prompt:');
    await user.type(textarea, 'This is a test prompt for error handling');
    
    const enhanceButton = screen.getByText('Enhance');
    await user.click(enhanceButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });

    // Verify retry button is available
    const retryButton = screen.getByText('🔄 Try Again');
    expect(retryButton).toBeInTheDocument();

    // Test retry functionality
    mockEnhancePrompt.mockResolvedValue('Retry successful!');
    await user.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Retry successful!')).toBeInTheDocument();
    });
  });

  it('keyboard shortcuts flow', async () => {
    const user = userEvent.setup();
    mockEnhancePrompt.mockResolvedValue('Enhanced via keyboard shortcut');

    render(<App />);

    // Enter prompt
    const textarea = screen.getByLabelText('Enter your prompt:');
    await user.type(textarea, 'Test keyboard shortcuts');

    // Use Ctrl+Enter to enhance
    await user.keyboard('{Control>}{Enter}{/Control}');

    await waitFor(() => {
      expect(screen.getByText('Enhanced via keyboard shortcut')).toBeInTheDocument();
    });

    expect(mockEnhancePrompt).toHaveBeenCalledWith('Test keyboard shortcuts');
  });

  it('input validation flow', async () => {
    const user = userEvent.setup();
    render(<App />);

    const textarea = screen.getByLabelText('Enter your prompt:');
    const enhanceButton = screen.getByText('Enhance');

    // Test empty input
    expect(enhanceButton).toBeDisabled();

    // Test too short input
    await user.type(textarea, 'short');
    await waitFor(() => {
      expect(screen.getByText('Prompt is too short (minimum 10 characters)')).toBeInTheDocument();
    });
    expect(enhanceButton).toBeDisabled();

    // Test valid input
    await user.clear(textarea);
    await user.type(textarea, 'This is a valid prompt for testing');
    
    await waitFor(() => {
      expect(screen.queryByText('Prompt is too short')).not.toBeInTheDocument();
    });
    expect(enhanceButton).not.toBeDisabled();
  });

  it('clear all functionality', async () => {
    const user = userEvent.setup();
    mockEnhancePrompt.mockResolvedValue('Enhanced prompt');

    render(<App />);

    // Create some data
    const textarea = screen.getByLabelText('Enter your prompt:');
    await user.type(textarea, 'Test prompt for clearing');
    
    const enhanceButton = screen.getByText('Enhance');
    await user.click(enhanceButton);

    await waitFor(() => {
      expect(screen.getByText('Enhanced prompt')).toBeInTheDocument();
    });

    // Clear all data
    const clearButton = screen.getByText('Clear All');
    await user.click(clearButton);

    // Verify everything is cleared
    expect(textarea).toHaveValue('');
    expect(screen.queryByText('Enhanced prompt')).not.toBeInTheDocument();
    expect(screen.queryByText('1 enhancement made')).not.toBeInTheDocument();
  });

  it('help tooltip interaction', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Open help tooltip
    const helpButton = screen.getByLabelText('Show keyboard shortcuts');
    await user.click(helpButton);

    // Verify help content is visible
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText('Ctrl + Enter')).toBeInTheDocument();
    expect(screen.getByText('Enhance prompt')).toBeInTheDocument();

    // Close help tooltip
    const closeButton = screen.getByLabelText('Close help');
    await user.click(closeButton);

    // Verify help content is hidden
    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
  });
});