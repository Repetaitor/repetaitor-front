import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FC } from 'react';
import { NavigationItem } from '@/types';

interface MobileMenuProps {
  navItems: NavigationItem[];
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({ navItems, mobileMenuOpen, setMobileMenuOpen, handleLogout }) => {
  if (!mobileMenuOpen) return null;

  return (
    <div className="absolute inset-0 z-50 animate-fade-in bg-background/95 backdrop-blur-sm md:hidden">
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
      <div className="space-y-4 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center rounded-md p-3 transition-colors duration-200 hover:bg-muted',
              item.active && 'bg-muted',
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            <item.icon className={cn('mr-3 h-5 w-5', item.active ? 'text-primary' : 'text-foreground')} />
            <span className={cn(item.active ? 'font-medium text-primary' : 'text-foreground')}>{item.label}</span>
          </Link>
        ))}
        <button
          className="flex w-full items-center rounded-md p-3 transition-colors duration-200 hover:bg-muted"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>გასვლა</span>
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
