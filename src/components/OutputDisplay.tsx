import React, { useState, useRef, useEffect } from 'react';
import type { OutputDisplayProps } from '../types';
import { announceToScreenReader } from '../utils/focusUtils';
import { copyToClipboard, selectText, isClipboardSupported } from '../utils/clipboardUtils';

export const OutputDisplay: React.FC<OutputDisplayProps> = ({
  content,
  onCopy,
  targetModel
}) => {
  const [copied, setCopied] = useState(false);
  const [copyMethod, setCopyMethod] = useState<string>('');
  const [isClipboardAvailable, setIsClipboardAvailable] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClipboardAvailable(isClipboardSupported());
  }, []);

  const handleCopy = async () => {
    if (!content) return;

    const result = await copyToClipboard(content);
    
    if (result.success) {
      setCopied(true);
      setCopyMethod(result.method);
      onCopy?.();
      
      const message = result.method === 'selection' 
        ? 'Text selected for copying (Ctrl+C to copy)'
        : 'Enhanced prompt copied to clipboard';
      
      announceToScreenReader(message);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
        setCopyMethod('');
      }, 2000);
    } else {
      // Fallback to selection
      if (contentRef.current && selectText(contentRef.current)) {
        announceToScreenReader('Text selected for copying. Press Ctrl+C to copy.');
      } else {
        announceToScreenReader('Copy failed. Please select the text manually.');
      }
    }
  };

  const handleSelect = () => {
    if (contentRef.current) {
      const success = selectText(contentRef.current);
      if (success) {
        announceToScreenReader('Text selected');
      }
    }
  };

  const handleDoubleClick = () => {
    handleSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+A to select all
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault();
      handleSelect();
    }
    // Ctrl+C to copy (if text is selected)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        // Let the browser handle the copy
        announceToScreenReader('Text copied to clipboard');
        onCopy?.();
      }
    }
  };

  if (!content) {
    return (
      <div className="output-container empty">
        <label className="output-label">Enhanced Prompt:</label>
        <div className="output-placeholder">
          Your enhanced prompt will appear here...
        </div>
      </div>
    );
  }

  return (
    <div className="output-container">
      <div className="output-header">
        <div className="output-header-left">
          <label className="output-label">Enhanced Prompt:</label>
          {targetModel && (
            <span className="model-indicator">for {targetModel}</span>
          )}
        </div>
        <div className="output-actions">
          <button
            className="select-button"
            onClick={handleSelect}
            title="Select all text"
          >
            Select All
          </button>
          <button
            className={`copy-button ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title="Copy to clipboard"
            disabled={!content}
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>
      <div 
        ref={contentRef}
        className="output-content"
        tabIndex={0}
        role="textbox"
        aria-readonly="true"
        aria-label="Enhanced prompt result"
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        title="Double-click to select all, Ctrl+A to select, Ctrl+C to copy"
      >
        {content}
      </div>
      
      {copied && (
        <div className="copy-feedback">
          ✓ {copyMethod === 'selection' ? 'Text selected (Ctrl+C to copy)' : 'Copied to clipboard!'}
        </div>
      )}
      
      {!isClipboardAvailable && (
        <div className="clipboard-warning">
          <small>⚠️ Clipboard access limited. Use Ctrl+C after selecting text.</small>
        </div>
      )}
    </div>
  );
};