import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  // Recharge automatiquement la page quand une nouvelle version prend le contrôle,
  // pour que les mises à jour déployées s'appliquent sans vider le cache manuellement.
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Vérifie les mises à jour au démarrage et à chaque retour sur l'onglet/app.
        registration.update();
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') registration.update();
        });
      })
      .catch((error) => {
        console.error('Service worker registration failed.', error);
      });
  });
}
