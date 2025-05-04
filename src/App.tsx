import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import Landing from '@/pages/Landing';
import VerifyEmail from '@/pages/VerifyEmail';
import Dashboard from '@/pages/Dashboard';
import { NavigationRoute } from '@/types';
import Groups from '@/pages/Groups.tsx';
import GroupDetail from '@/pages/GroupDetail.tsx';
import Essays from '@/pages/Essays.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={NavigationRoute.LANDING} element={<Landing />} />
        <Route path={NavigationRoute.LOGIN} element={<Login />} />
        <Route path={NavigationRoute.REGISTER} element={<Register />} />
        <Route path={NavigationRoute.VERIFY_EMAIL} element={<VerifyEmail />} />
        <Route path={NavigationRoute.DASHBOARD} element={<Dashboard />} />
        <Route path={NavigationRoute.GROUPS} element={<Groups />} />
        <Route path={`${NavigationRoute.GROUPS}/:id`} element={<GroupDetail />} />
        <Route path={NavigationRoute.ESSAYS} element={<Essays />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
