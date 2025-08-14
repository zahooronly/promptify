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
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-600 m-0">Enhanced Prompt:</label>
        <div className="p-6 text-center text-slate-500 italic border-2 border-dashed border-white/20 rounded-xl bg-white/5 backdrop-blur-sm">
          Your enhanced prompt will appear here...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600 ">Enhanced Prompt:</label>
          {targetModel && (
            <span className="text-xs text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-md">
              for {targetModel}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 border border-white/20 rounded-md bg-white/10 backdrop-blur-sm text-slate-600 text-xs cursor-pointer transition-all duration-200 hover:bg-white/20 hover:border-blue-500"
            onClick={handleSelect}
            title="Select all text"
          >
            Select All
          </button>
          <button
            className={`px-2 py-1 border rounded-md text-xs cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              copied 
                ? 'bg-green-500 text-white border-green-500' 
                : 'border-white/20 bg-white/10 backdrop-blur-sm text-slate-600 hover:bg-white/20 hover:border-blue-500'
            }`}
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
        className="p-4 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-sm leading-relaxed whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
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
        <div className="mt-2 p-2 bg-green-500 text-white rounded-md text-xs text-center animate-pulse">
          ✓ {copyMethod === 'selection' ? 'Text selected (Ctrl+C to copy)' : 'Copied to clipboard!'}
        </div>
      )}
      
      {!isClipboardAvailable && (
        <div className="mt-2 p-2 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-md text-xs text-center">
          <small>⚠️ Clipboard access limited. Use Ctrl+C after selecting text.</small>
        </div>
      )}
    </div>
  );
};