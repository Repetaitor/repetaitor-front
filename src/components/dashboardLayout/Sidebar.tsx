import { Link } from 'react-router-dom';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FC } from 'react';
import { NavigationItem } from '@/types';

interface SidebarProps {
  navItems: NavigationItem[];
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  handleLogout: () => void;
}

const Sidebar: FC<SidebarProps> = ({ navItems, sidebarCollapsed, setSidebarCollapsed, handleLogout }) => {
  return (
    <aside
      className={cn(
        'fixed z-30 hidden h-full flex-col overflow-hidden border-r border-muted/30 bg-card transition-all duration-300 md:flex',
        sidebarCollapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex items-center justify-between border-b border-muted/30 p-4">
        {!sidebarCollapsed && (
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-xl font-bold text-transparent">
              RepetAItor
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn('ml-auto')}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto py-4">
        <nav className="flex-1 space-y-2 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center rounded-md p-3 transition-colors duration-200 hover:bg-muted',
                item.active && 'bg-muted',
              )}
            >
              <item.icon className={cn('h-5 w-5', item.active ? 'text-primary' : 'text-foreground')} />
              {!sidebarCollapsed && (
                <span className={cn('ml-3', item.active ? 'font-medium text-primary' : 'text-foreground')}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-muted/30 p-4">
        <button
          className={cn('flex w-full items-center rounded-md p-3 transition-colors duration-200 hover:bg-muted')}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!sidebarCollapsed && <span className="ml-3">გასვლა</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
