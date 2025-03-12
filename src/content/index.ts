// Content script entry point

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    console.log('Content script received message:', message);
    // Handle different message types here
    sendResponse({ status: 'received' });
    return true; // Required for async response
  }
);

// Example: Add message to background script
chrome.runtime.sendMessage(
  { type: 'CONTENT_SCRIPT_READY' },
  (response) => {
    console.log('Background script response:', response);
  }
);
