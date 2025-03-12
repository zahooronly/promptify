import { useState, useEffect, FormEvent } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./App.css";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string, model: string) => void;
}

const AVAILABLE_MODELS = [
  {
    id: "gemini-2.0-flash-thinking-exp-01-21",
    name: "Gemini 2.0 Flash Thinking Experimental 01-21",
  },
  { id: "gemini-2.0-pro-exp-02-05", name: "Gemini 2.0 Pro Experimental 02-05" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
  { id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash-Lite" },
];

function Popup({ isOpen, onClose, onSubmit }: PopupProps) {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);

  interface StorageResult {
    geminiApiKey?: string;
    selectedModel?: string;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    chrome.storage.local.set({
      geminiApiKey: apiKey,
      selectedModel: selectedModel,
    });
    onSubmit(apiKey, selectedModel);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>🔑 Gemini API Key</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="popup-form">
          <div className="input-group">
            <label>API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              required
            />
          </div>
          <div className="input-group">
            <label>Select Model</label>
            <div className="radio-group">
              {AVAILABLE_MODELS.map((model) => (
                <label key={model.id} className="radio-label">
                  <input
                    type="radio"
                    name="model"
                    value={model.id}
                    checked={selectedModel === model.id}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  />
                  {model.name}
                </label>
              ))}
            </div>
          </div>
          <div className="popup-footer">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save & Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [genAI, setGenAI] = useState<GoogleGenerativeAI | null>(null);

  useEffect(() => {
    chrome.storage.local
      .get(["geminiApiKey", "selectedModel"])
      .then((result: StorageResult) => {
        if (result.geminiApiKey) {
          setApiKey(result.geminiApiKey);
          setSelectedModel(result.selectedModel || AVAILABLE_MODELS[0].id);
          setGenAI(new GoogleGenerativeAI(result.geminiApiKey));
        } else {
          setShowPopup(true);
        }
      });
  }, []);

  const handleApiKeySubmit = (newApiKey: string, model: string) => {
    setApiKey(newApiKey);
    setSelectedModel(model);
    setGenAI(new GoogleGenerativeAI(newApiKey));
  };

  return (
    <div className="app">
      {apiKey ? (
        <div className="content">
          <h1>Promptify</h1>
          <h2>Prompt Engineer by Zahoor Ahmad</h2>
          <p>
            Current Model:{" "}
            {AVAILABLE_MODELS.find((m) => m.id === selectedModel)?.name}
          </p>
          <button onClick={() => setShowPopup(true)}>Change API Key</button>
        </div>
      ) : null}
      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onSubmit={handleApiKeySubmit}
      />
    </div>
  );
}

export default App;
