import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Toaster from './components/toast/toaster.tsx';
import { AuthContextProvider } from '@/store/user-context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <Toaster />
      <App />
    </AuthContextProvider>
  </StrictMode>,
);
