import { useMemo } from 'react';

const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="bg-header px-6 py-12">
      <p className="mb-4 text-center text-sm text-muted-foreground md:mb-0">
        &copy; {currentYear} RepetAItor. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
