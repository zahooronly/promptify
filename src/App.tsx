import { PromptInput, EnhanceButton, OutputDisplay, ErrorMessage, ErrorBoundary } from './components';
import { ToastContainer } from './components/Toast';
import { HelpTooltip } from './components/HelpTooltip';
import { ModelSelector } from './components/ModelSelector';
import { usePromptEnhancer } from './hooks/usePromptEnhancer';
import { useToast } from './hooks/useToast';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { getErrorMessage, logError } from './utils/errorUtils';


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
      <div className="w-[400px] h-[600px] min-w-[400px] min-h-[600px] flex flex-col font-sans bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl text-slate-800 overflow-hidden shadow-glass">
        <header className="px-5 py-4 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 backdrop-blur-md border border-white/20 rounded-t-2xl text-white shadow-glass flex-shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-t-2xl pointer-events-none"></div>
          <div className="relative flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-xl font-semibold tracking-tight">Promptify</h1>
              <p className="text-sm opacity-90 font-normal mt-1">Enhance your prompts with AI</p>
            </div>
            <HelpTooltip />
          </div>
        </header>

        <main className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto bg-white/5 backdrop-blur-md">
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

          <div className="flex justify-between items-center -mt-2 mb-1">
            {!computed.isValidInput && state.prompt && (
              <span className="text-red-500 text-xs font-medium">
                {actions.validateInput(state.prompt)}
              </span>
            )}
            <span className={`text-xs font-medium ml-auto ${computed.characterCount > 3800 ? 'text-amber-500' : 'text-slate-500'}`}>
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
            <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
              <span className="text-sm">✨</span>
              Enhanced using advanced prompt engineering principles
            </div>
          )}

          {computed.hasHistory && (
            <div className="flex justify-between items-center pt-3 border-t border-white/20 mt-auto">
              <button 
                className="px-3 py-1.5 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-slate-600 text-xs cursor-pointer transition-all duration-200 hover:bg-red-500 hover:text-white hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={actions.clearAll}
                disabled={state.isLoading}
                title="Clear all data and start fresh"
              >
                Clear All
              </button>
              <span className="text-xs text-slate-500">
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
