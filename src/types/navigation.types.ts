import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  icon: LucideIcon;
  label: string;
  href: NavigationRoute;
}

export enum NavigationRoute {
  LANDING = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  VERIFY_EMAIL = '/verify-email',
  DASHBOARD = '/dashboard',
  ASSIGNMENTS = '/assignments',
  GROUPS = '/groups',
  ESSAYS = '/essays',
  SUBMISSIONS = '/submissions',
  EDITOR = '/editor',
  FEEDBACK = '/feedback',
}
