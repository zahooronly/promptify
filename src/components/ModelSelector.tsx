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
    <div className="model-selector">
      <label className="model-selector-label">
        Target AI Model:
      </label>
      <div className="model-options">
        {models.map((model) => (
          <button
            key={model.id}
            className={`model-option ${selectedModel === model.id ? 'selected' : ''}`}
            onClick={() => onModelChange(model.id)}
            disabled={disabled}
            title={model.description}
          >
            <span className="model-icon">{model.icon}</span>
            <span className="model-name">{model.name}</span>
          </button>
        ))}
      </div>
      <div className="model-description">
        {models.find(m => m.id === selectedModel)?.description}
      </div>
    </div>
  );
};