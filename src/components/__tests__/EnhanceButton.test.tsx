import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EnhanceButton } from '../EnhanceButton';

describe('EnhanceButton', () => {
  const defaultProps = {
    onClick: vi.fn(),
    disabled: false,
    isLoading: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct text when not loading', () => {
    render(<EnhanceButton {...defaultProps} />);
    expect(screen.getByText('Enhance')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(<EnhanceButton {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Enhancing...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('loading');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<EnhanceButton {...defaultProps} onClick={onClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<EnhanceButton {...defaultProps} disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when loading', () => {
    render(<EnhanceButton {...defaultProps} isLoading={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<EnhanceButton {...defaultProps} onClick={onClick} disabled={true} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows loading spinner when loading', () => {
    render(<EnhanceButton {...defaultProps} isLoading={true} />);
    expect(screen.getByRole('button').querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('has correct button type', () => {
    render(<EnhanceButton {...defaultProps} />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});