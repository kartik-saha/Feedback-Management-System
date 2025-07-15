// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './global.css'; // Make sure your theme variables and base styles are here

// 🧼 Remove the inline transition blocker inserted in index.html
const removeTransitionBlocker = () => {
  const styleTags = document.querySelectorAll('style');
  styleTags.forEach((tag) => {
    if (tag.innerText.includes('transition: none')) {
      tag.remove();
    }
  });
};

// 🧠 Make sure theme is set early (for safety fallback — already handled in index.html)
const preferredTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', preferredTheme);

removeTransitionBlocker(); // ✨ Clean up transition blocker before mounting

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
