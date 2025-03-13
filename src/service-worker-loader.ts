// Service worker registration with proper error handling
try {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          '/service-worker-loader.js',
          {
            type: 'module',
          }
        );
        console.log('Service worker registered successfully:', registration);
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    });
  }
} catch (error) {
  console.error('Service worker registration error:', error);
}