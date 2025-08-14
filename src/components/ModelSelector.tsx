import React from 'react';

export interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  disabled = false
}) => {
  const models = [
    {
      id: 'ChatGPT',
      name: 'ChatGPT',
      description: 'Conversational AI with strong dialogue capabilities',
      icon: '🤖'
    },
    {
      id: 'Claude',
      name: 'Claude',
      description: 'Analytical AI with deep reasoning and ethical considerations',
      icon: '🧠'
    },
    {
      id: 'Gemini',
      name: 'Gemini',
      description: 'Multimodal AI with creative synthesis capabilities',
      icon: '✨'
    }
  ];

  return (
    <div className="flex z-1 flex-col gap-2 mb-2 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-glass-inset">
      <label className="text-sm font-medium text-slate-600">
        Target AI Model:
      </label>
      <div className="flex gap-1.5">
        {models.map((model) => (
          <button
            key={model.id}
            className={`flex items-center gap-1 px-0 py-1.5 border-2 rounded-lg bg-white/10 backdrop-blur-sm text-slate-600 text-xs cursor-pointer transition-all duration-200 flex-1 min-w-0 justify-center hover:border-blue-500 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed ${selectedModel === model.id
              ? 'border-blue-500 bg-blue-500/10 text-blue-600 font-semibold'
              : 'border-white/20'
              }`}
            onClick={() => onModelChange(model.id)}
            disabled={disabled}
            title={model.description}
          >
            <span className="text-sm flex-shrink-0">{model.icon}</span>
            <span className="font-medium text-xs truncate">{model.name}</span>
          </button>
        ))}
      </div>
      <div className="text-xs text-slate-500 text-center italic min-h-[1.2em] leading-tight">
        {models.find(m => m.id === selectedModel)?.description}
      </div>
    </div>
  );
};