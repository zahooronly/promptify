import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PromptInput } from '../PromptInput';

describe('PromptInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    placeholder: 'Enter your prompt...',
    disabled: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct placeholder', () => {
    render(<PromptInput {...defaultProps} />);
    expect(screen.getByPlaceholderText('Enter your prompt...')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<PromptInput {...defaultProps} value="test prompt" />);
    expect(screen.getByDisplayValue('test prompt')).toBeInTheDocument();
  });

  it('calls onChange when text is entered', () => {
    const onChange = vi.fn();
    render(<PromptInput {...defaultProps} onChange={onChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'new text' } });
    
    expect(onChange).toHaveBeenCalledWith('new text');
  });

  it('is disabled when disabled prop is true', () => {
    render(<PromptInput {...defaultProps} disabled={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('has correct accessibility attributes', () => {
    render(<PromptInput {...defaultProps} />);
    const textarea = screen.getByRole('textbox');
    
    expect(textarea).toHaveAttribute('id', 'prompt-input');
    expect(screen.getByLabelText('Enter your prompt:')).toBeInTheDocument();
  });

  it('respects maxLength attribute', () => {
    render(<PromptInput {...defaultProps} />);
    const textarea = screen.getByRole('textbox');
    
    expect(textarea).toHaveAttribute('maxLength', '4000');
  });

  it('auto-focuses when not disabled', async () => {
    render(<PromptInput {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  it('does not auto-focus when disabled', () => {
    render(<PromptInput {...defaultProps} disabled={true} />);
    expect(screen.getByRole('textbox')).not.toHaveFocus();
  });
});