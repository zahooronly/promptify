import React from 'react';
import type { EnhanceButtonProps } from '../types';

export const EnhanceButton: React.FC<EnhanceButtonProps> = ({
  onClick,
  disabled,
  isLoading
}) => {
  return (
    <button
      className={`w-full px-6 py-3 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 backdrop-blur-md border border-white/20 text-white rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px] shadow-glass relative overflow-hidden hover:shadow-glass-hover hover:from-blue-500/90 hover:to-indigo-600/90 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-glass ${isLoading ? 'cursor-wait' : ''}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl pointer-events-none"></div>
      <div className="relative flex items-center gap-2">
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Enhancing...
          </>
        ) : (
          'Enhance'
        )}
      </div>
    </button>
  );
};