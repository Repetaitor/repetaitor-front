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
import Assignments from '@/pages/Assignments.tsx';
import Editor from '@/pages/Editor.tsx';
import Submissions from '@/pages/Submissions.tsx';
import Evaluate from '@/pages/Evaluate.tsx';
import Feedback from '@/pages/Feedback.tsx';
import AssignmentDetail from '@/pages/AssignmentDetail.tsx';

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
        <Route path={NavigationRoute.ASSIGNMENTS} element={<Assignments />} />
        <Route path={NavigationRoute.AI_ASSIGNMENTS} element={<Assignments isAIAssignment />} />
        <Route path={`${NavigationRoute.ASSIGNMENTS}/:id`} element={<AssignmentDetail />} />
        <Route path={`${NavigationRoute.EDITOR}/:id`} element={<Editor />} />
        <Route path={NavigationRoute.SUBMISSIONS} element={<Submissions />} />
        <Route path={`${NavigationRoute.EVALUATE}/:userId/:assignmentId`} element={<Evaluate />} />
        <Route path={`${NavigationRoute.FEEDBACK}/:assignmentId`} element={<Feedback />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
