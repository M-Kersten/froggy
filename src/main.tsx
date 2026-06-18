import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './utils/fonts'; // inject @font-face for the DOM UI at startup
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
