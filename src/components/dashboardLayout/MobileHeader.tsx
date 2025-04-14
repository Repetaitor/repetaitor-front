import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  setMobileMenuOpen: (open: boolean) => void;
}

const MobileHeader: FC<MobileHeaderProps> = ({ setMobileMenuOpen }) => {
  return (
    <header className="flex items-center justify-between border-b border-muted/30 bg-header p-4 md:hidden">
      <Link to="/" className="flex items-center gap-2">
        <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-xl font-bold text-transparent">
          RepetAItor
        </span>
      </Link>
      <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
    </header>
  );
};

export default MobileHeader;
