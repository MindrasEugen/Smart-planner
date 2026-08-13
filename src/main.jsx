import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import { ToastProvider } from './ui/components/Toast/index.js';
import App from './ui/App.jsx';
import { agendaStore } from './logic/store/index.js';
import { setupStorePersistence } from './logic/store/persistence.js';
import { setupAutoNotifications } from './logic/notifications/integration.js';
// import './styles/theme.scss'; // Disabilitato temporaneamente - usando Tailwind CSS
import './styles/global.css';

// Material Symbols e Inter font sono caricati tramite CDN in index.html
// Tema custom basato su Google Stitch Cognitive Protocol Design System

// UNICO punto di registrazione del Service Worker (src/sw.js).
// Va prima delle notifiche: queste attendono la registrazione per poter
// mostrare le notifiche di sistema.
registerSW({ immediate: true });

// Inizializza persistenza automatica all'avvio
// Usiamo agendaStore (vanilla store) invece di useAgendaStore (hook)
// perche' siamo fuori da un componente React
const cleanupPersistence = setupStorePersistence(agendaStore);

// Inizializza notifiche automatiche all'avvio
const cleanupNotifications = setupAutoNotifications();

// Renderizza l'app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Pulizia al reload (opzionale)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanupPersistence();
    cleanupNotifications();
  });
}
