/**
 * Artifex.AI - Main Entry Point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './SimpleApp';
import './styles/global.css';

// Create root element
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove loading screen
const loadingScreen = document.getElementById('loading-screen');
if (loadingScreen) {
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }, 100);
}