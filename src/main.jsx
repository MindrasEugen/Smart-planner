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

// Un import() dinamico (le pagine sono lazy-loaded) fallisce con un chunk
// il cui hash non esiste più sul server subito dopo un nuovo deploy, se
// questa tab era rimasta aperta sulla build precedente: senza gestirlo,
// React non ha un ErrorBoundary e l'albero crasha con una pagina bianca.
// Vite emette 'vite:preloadError' in questo caso: un solo reload basta,
// perché scarica il nuovo index.html con i riferimenti ai chunk aggiornati.
window.addEventListener('vite:preloadError', () => {
  if (sessionStorage.getItem('vite-preload-error-reloaded')) return;
  sessionStorage.setItem('vite-preload-error-reloaded', '1');
  window.location.reload();
});

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

// Riabilita il reload automatico per un futuro (diverso) deploy: senza questo,
// il guard sessionStorage sopra bloccherebbe il reload di un secondo incidente
// nella stessa sessione del browser.
setTimeout(() => sessionStorage.removeItem('vite-preload-error-reloaded'), 5000);

// Pulizia al reload (opzionale)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanupPersistence();
    cleanupNotifications();
  });
}
