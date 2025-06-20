import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Toaster from './components/toast/toaster.tsx';
import { AuthContextProvider, EssaysProvider, GroupsProvider } from '@/store';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <GroupsProvider>
        <EssaysProvider>
          <Toaster />
          <App />
        </EssaysProvider>
      </GroupsProvider>
    </AuthContextProvider>
  </BrowserRouter>,
);
