import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { DraggableButton } from "./DraggableButton";
import { storage } from "./storage";

export const Content = () => {
  const [buttonPosition, setButtonPosition] = useState({ x: 100, y: 100 });
  const [selectedText, setSelectedText] = useState("");

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString());
    }
  };

  const enhancePrompt = async () => {
    if (!selectedText) return;

    const apiKey = await storage.get("geminiApiKey");
    if (!apiKey) {
      alert("Please set your Gemini API key in the extension popup");
      return;
    }

    const activeElement = document.activeElement as HTMLTextAreaElement;
    if (
      activeElement &&
      (activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "INPUT")
    ) {
      try {
        // Here you would call the Gemini API to enhance the prompt
        // For now, we'll just append a placeholder enhancement
        const enhancedPrompt = `${selectedText}\n\nEnhanced with more context and clarity.`;
        activeElement.value = enhancedPrompt;
        activeElement.dispatchEvent(new Event("input", { bubbles: true }));
      } catch (error) {
        console.error("Error enhancing prompt:", error);
        alert("Failed to enhance the prompt. Please try again.");
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    return () => document.removeEventListener("mouseup", handleTextSelection);
  }, []);

  return (
    <DraggableButton
      onEnhancePrompt={enhancePrompt}
      position={buttonPosition}
      setPosition={setButtonPosition}
    />
  );
};

// Create container for the app
const container = document.createElement("div");
container.id = "promptify-extension-root";
document.body.appendChild(container);

// Render the app
const root = createRoot(container);
root.render(<Content />);
