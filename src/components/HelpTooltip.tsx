import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export const HelpTooltip: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const shortcuts = [
    { key: 'Ctrl + Enter', description: 'Enhance prompt' },
    { key: 'Escape', description: 'Clear errors' },
    { key: 'I', description: 'Focus input field' },
    { key: 'O', description: 'Focus output area' },
    { key: 'C', description: 'Clear all data' },
    { key: 'Ctrl + A', description: 'Select all text (in output)' },
    { key: 'Double-click', description: 'Select all text (in output)' }
  ];

  return (
    <div className="relative">
      <button
        className="w-8 h-8 rounded-full border border-white/40 bg-white/20 text-white text-sm font-bold cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-white/30 hover:border-white/60 hover:scale-105"
        onClick={() => setIsVisible(!isVisible)}
        title="Keyboard shortcuts"
        aria-label="Show keyboard shortcuts"
      >
        ?
      </button>

      {isVisible && createPortal(
        <>
          <div
            className="fixed inset-0 bg-black/10"
            style={{ zIndex: 999999 }}
            onClick={() => setIsVisible(false)}
            aria-hidden="true"
          />
          <div
            className="fixed top-16 right-4 w-80 bg-white/95 border border-gray-200/50 rounded-xl shadow-2xl overflow-hidden"
            style={{ zIndex: 1000000 }}
          >
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-b border-gray-200/30">
              <h3 className="text-base font-semibold text-gray-800">⌨️ Keyboard Shortcuts</h3>
              <button
                className="w-6 h-6 bg-gray-100/80 border-none text-gray-500 cursor-pointer rounded-full transition-all duration-200 hover:bg-gray-200 hover:text-gray-700 flex items-center justify-center text-sm"
                onClick={() => setIsVisible(false)}
                aria-label="Close help"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-white/80 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-gray-50/60 transition-colors duration-150">
                    <kbd className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 text-xs font-mono text-gray-700 shadow-sm whitespace-nowrap">
                      {shortcut.key}
                    </kbd>
                    <span className="text-sm text-gray-600 text-right flex-1">
                      {shortcut.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-gradient-to-r from-gray-50/80 to-slate-50/80 border-t border-gray-200/30 text-center">
              <small className="text-gray-500 text-xs">
                💡 Tip: Use Tab to navigate between elements
              </small>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};