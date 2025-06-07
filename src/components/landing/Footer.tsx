const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-header px-6 py-12">
      {/*<div className="mt-12 flex flex-col items-center justify-between border-t border-muted/40 pt-8 md:flex-row">*/}
      <p className="mb-4 text-sm text-muted-foreground md:mb-0">
        &copy; {currentYear} RepetAItor. All rights reserved.
      </p>
      {/*</div>*/}
    </footer>
  );
};

export default Footer;
