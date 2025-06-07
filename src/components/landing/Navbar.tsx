import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button.tsx';
import { NavigationRoute } from '@/types';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHomePage = useMemo(() => location.pathname === NavigationRoute.LANDING, [location.pathname]);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      setIsMobileMenuOpen(false);

      if (!isHomePage) {
        window.location.href = `/#${sectionId}`;
        return;
      }

      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [isHomePage],
  );

  const scrollToTop = useCallback(() => {
    setIsMobileMenuOpen(false);

    if (!isHomePage) {
      window.location.href = NavigationRoute.LANDING;
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isHomePage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-header/95 py-2 shadow-md backdrop-blur-md' : 'bg-transparent py-4',
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <button
          onClick={() => (window.location.href = '/')}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-2xl font-bold text-transparent">
            RepetAItor
          </span>
        </button>

        <nav className="hidden items-center space-x-8 md:flex">
          <button onClick={scrollToTop} className="text-foreground transition-colors hover:text-primary">
            მთავარი
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="text-foreground transition-colors hover:text-primary"
          >
            ფუნქციები
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-foreground transition-colors hover:text-primary"
          >
            მუშაობის პრინციპი
          </button>
        </nav>

        <div className="hidden items-center space-x-4 md:flex">
          <Link to="/login">
            <Button variant="outline" size="sm">
              შესვლა
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">რეგისტრაცია</Button>
          </Link>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-x-0 top-[60px] z-50 border-b border-muted/40 bg-card md:hidden',
          isMobileMenuOpen ? 'flex animate-fade-in flex-col' : 'hidden',
        )}
      >
        <div className="container mx-auto flex flex-col space-y-4 px-6 py-4">
          <button className="py-2 text-left text-foreground transition-colors hover:text-primary" onClick={scrollToTop}>
            მთავარი
          </button>
          <button
            className="py-2 text-left text-foreground transition-colors hover:text-primary"
            onClick={() => scrollToSection('features')}
          >
            ფუნცქციები
          </button>
          <button
            className="py-2 text-left text-foreground transition-colors hover:text-primary"
            onClick={() => scrollToSection('how-it-works')}
          >
            მუშაობის პრინციპი
          </button>
          <div className="flex flex-col space-y-2 pt-2">
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
