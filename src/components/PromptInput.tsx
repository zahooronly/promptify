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
    <div className="flex flex-col gap-2">
      <label htmlFor="prompt-input" className="text-sm font-medium text-slate-600">
        Enter your prompt:
      </label>
      <textarea
        ref={textareaRef}
        id="prompt-input"
        className={`w-full min-h-[80px] max-h-[150px] p-3 border border-white/20 rounded-xl text-sm leading-relaxed resize-y transition-all duration-300 bg-white/10 backdrop-blur-md text-slate-800 font-inherit shadow-glass-inset focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.2)] focus:bg-white/20 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
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