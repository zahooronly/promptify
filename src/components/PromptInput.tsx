import React, { useRef, useEffect } from 'react';
import type { PromptInputProps } from '../types';

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your prompt here...",
  disabled = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow Ctrl+Enter to bubble up for the global handler
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      return; // Let the global handler in usePromptEnhancer handle this
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  // Focus on mount
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  return (
    <div className="prompt-input-container">
      <label htmlFor="prompt-input" className="prompt-label">
        Enter your prompt:
      </label>
      <textarea
        ref={textareaRef}
        id="prompt-input"
        className={`prompt-textarea ${disabled ? 'disabled' : ''}`}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={4}
        maxLength={4000}
        spellCheck={true}
      />
    </div>
  );
};