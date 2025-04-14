import { FC, ReactNode, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import MobileHeader from './MobileHeader';
import MobileMenu from './MobileMenu';
import Sidebar from './Sidebar';
import { useAuthContext } from '@/store';
import { useToast } from '@/hooks';
import { NavigationRoute } from '@/types';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = useCallback(() => {
    logout();
    toast({
      title: 'სისტემიდან გასვლა',
      description: 'მომავალ შეხვედრამდე!',
    });
    navigate(NavigationRoute.LANDING);
  }, [logout, navigate, toast]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MobileHeader setMobileMenuOpen={setMobileMenuOpen} />

      <MobileMenu mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} handleLogout={handleLogout} />

      <div className="flex flex-1">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          handleLogout={handleLogout}
        />

        <main className={cn('flex-1 transition-all duration-300 md:ml-64', sidebarCollapsed && 'md:ml-16')}>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
