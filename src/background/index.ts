// Background script entry point

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener(
  (message: unknown, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    console.log('Received message:', message);
    // Handle different message types here
    sendResponse({ status: 'received' });
    return true; // Required for async response
  }
);