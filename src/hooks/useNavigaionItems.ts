import { useLocation } from 'react-router-dom';
import { BookOpen, ClipboardCheck, FileText, LayoutDashboard, Users } from 'lucide-react';
import { NavigationItem, UserRole } from '@/types';
import { useAuthContext } from '@/store';
import { useMemo } from 'react';

export const useNavigationItems = (): NavigationItem[] => {
  const { activeUser } = useAuthContext();
  const isTeacher = activeUser?.role === UserRole.TEACHER;
  const location = useLocation();

  const studentNavItems: NavigationItem[] = useMemo(
    () => [
      {
        icon: LayoutDashboard,
        label: 'მთავარი პანელი',
        href: '/dashboard',
        active: location.pathname === '/dashboard',
      },
      {
        icon: FileText,
        label: 'დავალებები',
        href: '/assignments',
        active: location.pathname === '/assignments' || location.pathname.startsWith('/assignments/'),
      },
    ],
    [location.pathname],
  );

  const teacherNavItems: NavigationItem[] = useMemo(
    () => [
      {
        icon: LayoutDashboard,
        label: 'მთავარი პანელი',
        href: '/dashboard',
        active: location.pathname === '/dashboard',
      },
      {
        icon: Users,
        label: 'ჯგუფები',
        href: '/groups',
        active: location.pathname === '/groups' || location.pathname.startsWith('/groups/'),
      },
      {
        icon: BookOpen,
        label: 'ესეები',
        href: '/essays',
        active: location.pathname === '/essays',
      },
      {
        icon: ClipboardCheck,
        label: 'შესრულებული დავალებები',
        href: '/submissions',
        active: location.pathname === '/submissions',
      },
    ],
    [location.pathname],
  );

  return useMemo(() => (isTeacher ? teacherNavItems : studentNavItems), [isTeacher, studentNavItems, teacherNavItems]);
};
