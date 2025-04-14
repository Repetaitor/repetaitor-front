import { useLocation } from 'react-router-dom';
import { BookOpen, ClipboardCheck, FileText, LayoutDashboard, Users } from 'lucide-react';
import { NavigationItem, NavigationRoute, UserRole } from '@/types';
import { useAuthContext } from '@/store';
import { useCallback, useMemo } from 'react';

const STUDENT_NAV_ITEMS: NavigationItem[] = [
  {
    icon: LayoutDashboard,
    label: 'მთავარი პანელი',
    href: NavigationRoute.DASHBOARD,
  },
  {
    icon: FileText,
    label: 'დავალებები',
    href: NavigationRoute.ASSIGNMENTS,
  },
];

const TEACHER_NAV_ITEMS: NavigationItem[] = [
  {
    icon: LayoutDashboard,
    label: 'მთავარი პანელი',
    href: NavigationRoute.DASHBOARD,
  },
  {
    icon: Users,
    label: 'ჯგუფები',
    href: NavigationRoute.GROUPS,
  },
  {
    icon: BookOpen,
    label: 'ესეები',
    href: NavigationRoute.ESSAYS,
  },
  {
    icon: ClipboardCheck,
    label: 'შესრულებული დავალებები',
    href: NavigationRoute.SUBMISSIONS,
  },
];

export const useNavigationItems = () => {
  const { activeUser } = useAuthContext();
  const isTeacher = activeUser?.role === UserRole.TEACHER;
  const location = useLocation();

  const isActivePage = useCallback(
    (route: NavigationRoute) => location.pathname === route || location.pathname.startsWith(`${route}/`),
    [location.pathname],
  );

  const navItems = useMemo(
    () =>
      (isTeacher ? TEACHER_NAV_ITEMS : STUDENT_NAV_ITEMS).map((item) => ({
        ...item,
        active: isActivePage(item.href),
      })),
    [isActivePage, isTeacher],
  );

  return { navItems };
};
