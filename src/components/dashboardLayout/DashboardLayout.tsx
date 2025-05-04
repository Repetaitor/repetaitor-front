import { FC, ReactNode, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import MobileHeader from './MobileHeader';
import MobileMenu from './MobileMenu';
import Sidebar from './Sidebar';
import { useAuthContext } from '@/store';
import { useToast } from '@/hooks';
import { NavigationRoute } from '@/types';
import LoadingAnimation from '@/components/ui/loading-animation.tsx';

interface DashboardLayoutProps {
  children: ReactNode;
  isPageLoading?: boolean;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, isPageLoading }) => {
  const { logout, isLoginLoading } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast({
        title: 'სისტემიდან გასვლა',
        description: 'მომავალ შეხვედრამდე!',
      });
      navigate(NavigationRoute.LANDING);
    } catch {
      toast({
        title: 'შეცდომა',
        description: 'გთხოვთ, სცადოთ თავიდან.',
        variant: 'danger',
      });
    }
  }, [logout, navigate, toast]);

  if (isLoginLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

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
          {isPageLoading ? (
            <div className="flex h-full w-full items-center justify-center p-6">
              <LoadingAnimation />
            </div>
          ) : (
            <div className="p-6">{children}</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
