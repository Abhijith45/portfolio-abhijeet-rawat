import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import { logErrorToWebhook } from './services/logger';
import './index.css';

// Global unhandled runtime error & promise rejection listeners
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // Ignore benign cross-origin script error noise with no message
    if (!event.message && !event.error) return;

    logErrorToWebhook({
      severity: 'ERROR',
      component: 'window:uncaughtError',
      stack: event.error?.stack || `${event.filename || 'unknown'}:${event.lineno || 0}:${event.colno || 0}`,
      statusCode: 500,
      message: event.message || 'Uncaught browser window error',
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason || 'Unhandled Promise Rejection'));
    logErrorToWebhook({
      severity: 'ERROR',
      component: 'window:unhandledrejection',
      stack: error.stack || 'N/A',
      statusCode: 500,
      message: error.message || 'Unhandled Promise Rejection',
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

