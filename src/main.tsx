import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/tokens.css';
import '@/styles/base.css';
import { App } from '@/app/App';
import { learnerStore } from '@/app/state/learnerStore';

const container = document.getElementById('root');
if (!container) throw new Error('Root element saknas');

// Kick off hydration before React mounts so the first render already has data
// in most cases. The app renders a stable skeleton if it is not ready yet.
void learnerStore.init();

// Persist transient state when the page is being backgrounded or closed.
// `pagehide` is the reliable signal on iOS, where `beforeunload` often does
// not fire at all.
window.addEventListener('pagehide', () => learnerStore.flush());
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') learnerStore.flush();
});

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
