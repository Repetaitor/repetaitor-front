import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Toaster from './components/toast/toaster.tsx';
import { AuthContextProvider, EssaysProvider, GroupsProvider } from '@/store';

createRoot(document.getElementById('root')!).render(
  <AuthContextProvider>
    <GroupsProvider>
      <EssaysProvider>
        <Toaster />
        <App />
      </EssaysProvider>
    </GroupsProvider>
  </AuthContextProvider>,
);
