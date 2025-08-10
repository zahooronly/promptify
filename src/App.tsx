import { PromptInput, EnhanceButton, OutputDisplay, ErrorMessage, ErrorBoundary } from './components';
import { ToastContainer } from './components/Toast';
import { HelpTooltip } from './components/HelpTooltip';
import { ModelSelector } from './components/ModelSelector';
import { usePromptEnhancer } from './hooks/usePromptEnhancer';
import { useToast } from './hooks/useToast';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { getErrorMessage, logError } from './utils/errorUtils';
import './App.css';

function App() {
  const { state, actions, computed } = usePromptEnhancer();
  const { toasts, showToast, removeToast } = useToast();

  const handleCopy = () => {
    showToast('Enhanced prompt copied to clipboard!', { type: 'success', duration: 2000 });
  };

  const handleError = (error: Error) => {
    logError(error as any, 'App Error Boundary');
    showToast('An unexpected error occurred', { type: 'error' });
  };

  // Keyboard navigation
  const { focusInput, focusOutput } = useKeyboardNavigation({
    onEnhance: () => {
      if (!computed.isEnhanceDisabled) {
        actions.enhancePrompt();
      }
    },
    onClear: () => {
      if (computed.hasHistory && !state.isLoading) {
        actions.clearAll();
        showToast('All data cleared', { type: 'info', duration: 1500 });
      }
    },
    onEscape: () => {
      if (state.error) {
        actions.clearError();
      }
    },
    onFocusInput: () => focusInput(),
    onFocusOutput: () => focusOutput(),
    disabled: state.isLoading
  });

  return (
    <ErrorBoundary onError={handleError}>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Promptify</h1>
              <p>Enhance your prompts with AI</p>
            </div>
            <HelpTooltip />
          </div>
        </header>

        <main className="app-main">
          <ModelSelector
            selectedModel={state.selectedModel}
            onModelChange={actions.setSelectedModel}
            disabled={state.isLoading}
          />

          <PromptInput
            value={state.prompt}
            onChange={actions.setPrompt}
            disabled={state.isLoading}
            placeholder="Enter your prompt here... (Ctrl+Enter to enhance)"
          />

          <div className="input-feedback">
            {!computed.isValidInput && state.prompt && (
              <span className="validation-error">
                {actions.validateInput(state.prompt)}
              </span>
            )}
            <span className={`character-count ${computed.characterCount > 3800 ? 'warning' : ''}`}>
              {computed.characterCount}/4000
            </span>
          </div>

          <EnhanceButton
            onClick={actions.enhancePrompt}
            disabled={computed.isEnhanceDisabled}
            isLoading={state.isLoading}
          />

          {state.error && (
            <ErrorMessage
              message={getErrorMessage(state.error)}
              errorType={state.error.type}
              details={state.error.details}
              onRetry={computed.canRetry ? actions.retryEnhancement : undefined}
              onDismiss={actions.clearError}
              autoHide={state.error.type === 'INVALID_INPUT'}
            />
          )}

          <OutputDisplay
            content={state.enhancedPrompt}
            onCopy={handleCopy}
            targetModel={state.selectedModel}
          />

          {state.enhancedPrompt && (
            <div className="grand-prompt-indicator">
              Enhanced using advanced prompt engineering principles
            </div>
          )}

          {computed.hasHistory && (
            <div className="app-footer">
              <button 
                className="clear-button" 
                onClick={actions.clearAll}
                disabled={state.isLoading}
                title="Clear all data and start fresh"
              >
                Clear All
              </button>
              <span className="history-count">
                {state.requestHistory.length} enhancement{state.requestHistory.length !== 1 ? 's' : ''} made
              </span>
            </div>
          )}
        </main>

        <ToastContainer 
          toasts={toasts} 
          onRemoveToast={removeToast} 
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
