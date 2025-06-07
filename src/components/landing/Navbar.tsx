import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button.tsx';
import { NavigationRoute } from '@/types';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === NavigationRoute.LANDING;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Close mobile menu if open
    setIsMobileMenuOpen(false);

    // If not on homepage, navigate there first, then scroll
    if (!isHomePage) {
      window.location.href = `/#${sectionId}`;
      return;
    }

    // Handle smooth scrolling on homepage
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-header/95 py-2 shadow-md backdrop-blur-md' : 'bg-transparent py-4',
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-2xl font-bold text-transparent">
            RepetAItor
          </span>
        </Link>

        <nav className="hidden items-center space-x-8 md:flex">
          <Link to="/" className="text-foreground transition-colors hover:text-primary">
            მთავარი
          </Link>
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

        <button className="text-foreground md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
          <Link
            to="/"
            className="py-2 text-foreground transition-colors hover:text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <button
            className="py-2 text-left text-foreground transition-colors hover:text-primary"
            onClick={() => scrollToSection('features')}
          >
            Features
          </button>
          <button
            className="py-2 text-left text-foreground transition-colors hover:text-primary"
            onClick={() => scrollToSection('how-it-works')}
          >
            How It Works
          </button>
          <button
            className="py-2 text-left text-foreground transition-colors hover:text-primary"
            onClick={() => scrollToSection('testimonials')}
          >
            Testimonials
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
