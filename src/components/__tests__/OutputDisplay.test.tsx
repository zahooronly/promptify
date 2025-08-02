import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OutputDisplay } from '../OutputDisplay';

// Mock the clipboard utilities
vi.mock('../../utils/clipboardUtils', () => ({
  copyToClipboard: vi.fn(() => Promise.resolve({ success: true, method: 'navigator' })),
  selectText: vi.fn(() => true),
  isClipboardSupported: vi.fn(() => true)
}));

// Mock the focus utilities
vi.mock('../../utils/focusUtils', () => ({
  announceToScreenReader: vi.fn()
}));

describe('OutputDisplay', () => {
  const defaultProps = {
    content: '',
    onCopy: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows placeholder when content is empty', () => {
    render(<OutputDisplay {...defaultProps} />);
    expect(screen.getByText('Your enhanced prompt will appear here...')).toBeInTheDocument();
  });

  it('displays content when provided', () => {
    render(<OutputDisplay {...defaultProps} content="Enhanced prompt text" />);
    expect(screen.getByText('Enhanced prompt text')).toBeInTheDocument();
  });

  it('shows copy and select buttons when content exists', () => {
    render(<OutputDisplay {...defaultProps} content="test content" />);
    expect(screen.getByText('📋 Copy')).toBeInTheDocument();
    expect(screen.getByText('Select All')).toBeInTheDocument();
  });

  it('calls onCopy when copy button is clicked', async () => {
    const onCopy = vi.fn();
    render(<OutputDisplay {...defaultProps} content="test content" onCopy={onCopy} />);
    
    fireEvent.click(screen.getByText('📋 Copy'));
    
    await waitFor(() => {
      expect(onCopy).toHaveBeenCalled();
    });
  });

  it('shows copied state after successful copy', async () => {
    render(<OutputDisplay {...defaultProps} content="test content" />);
    
    fireEvent.click(screen.getByText('📋 Copy'));
    
    await waitFor(() => {
      expect(screen.getByText('✓ Copied')).toBeInTheDocument();
    });
  });

  it('handles double-click to select text', () => {
    const { container } = render(<OutputDisplay {...defaultProps} content="test content" />);
    const outputContent = container.querySelector('.output-content');
    
    fireEvent.doubleClick(outputContent!);
    // Test passes if no error is thrown
  });

  it('handles keyboard shortcuts', () => {
    const { container } = render(<OutputDisplay {...defaultProps} content="test content" />);
    const outputContent = container.querySelector('.output-content');
    
    // Test Ctrl+A
    fireEvent.keyDown(outputContent!, { key: 'a', ctrlKey: true });
    // Test passes if no error is thrown
  });

  it('has correct accessibility attributes', () => {
    render(<OutputDisplay {...defaultProps} content="test content" />);
    const outputContent = screen.getByRole('textbox');
    
    expect(outputContent).toHaveAttribute('aria-readonly', 'true');
    expect(outputContent).toHaveAttribute('aria-label', 'Enhanced prompt result');
    expect(outputContent).toHaveAttribute('tabIndex', '0');
  });

  it('copy button is disabled when no content', () => {
    render(<OutputDisplay {...defaultProps} content="" />);
    // Should show placeholder, not copy button
    expect(screen.queryByText('📋 Copy')).not.toBeInTheDocument();
  });
});