import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Toaster from './components/toast/toaster.tsx';
import { AuthContextProvider, EssaysProvider, GroupsProvider } from '@/store';
import { BrowserRouter } from 'react-router-dom';
import ChatBaseView from './components/chat/chatView.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <GroupsProvider>
        <EssaysProvider>
          <Toaster />
          <App />
          <ChatBaseView />
        </EssaysProvider>
      </GroupsProvider>
    </AuthContextProvider>
  </BrowserRouter>,
);
