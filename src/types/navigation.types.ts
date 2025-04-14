import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  icon: LucideIcon;
  label: string;
  href: string;
  active: boolean;
}
