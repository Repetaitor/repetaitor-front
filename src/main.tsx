import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Toaster from './components/toast/toaster.tsx';
import { AuthContextProvider, GroupsProvider } from '@/store';

createRoot(document.getElementById('root')!).render(
  <AuthContextProvider>
    <GroupsProvider>
      <Toaster />
      <App />
    </GroupsProvider>
  </AuthContextProvider>,
);
