import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { analytics } from './analytics';
import { registerServiceWorker } from './utils/serviceWorker';
import { ErrorBoundary } from './components/ErrorBoundary';

// Initialize analytics when app starts
analytics.initialize();

// Register service worker for PWA functionality
registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);