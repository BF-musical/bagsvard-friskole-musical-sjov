
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#" className="font-pacifico text-musical-blue text-2xl">Bagsværd Friskole</a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <a href="#about" className="font-medium hover:text-musical-orange transition-colors">Om Musicalen</a>
            <a href="#gallery" className="font-medium hover:text-musical-orange transition-colors">Galleri</a>
            <a href="#cast" className="font-medium hover:text-musical-orange transition-colors">Medvirkende</a>
            <a href="#info" className="font-medium hover:text-musical-orange transition-colors">Information</a>
            <a href="#contact" className="font-medium hover:text-musical-orange transition-colors">Kontakt</a>
          </div>

          <Button 
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12"/>
              ) : (
                <path d="M4 12h16M4 6h16M4 18h16"/>
              )}
            </svg>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col space-y-3">
            <a href="#about" className="font-medium hover:text-musical-orange transition-colors" onClick={() => setIsMenuOpen(false)}>Om Musicalen</a>
            <a href="#gallery" className="font-medium hover:text-musical-orange transition-colors" onClick={() => setIsMenuOpen(false)}>Galleri</a>
            <a href="#cast" className="font-medium hover:text-musical-orange transition-colors" onClick={() => setIsMenuOpen(false)}>Medvirkende</a>
            <a href="#info" className="font-medium hover:text-musical-orange transition-colors" onClick={() => setIsMenuOpen(false)}>Information</a>
            <a href="#contact" className="font-medium hover:text-musical-orange transition-colors" onClick={() => setIsMenuOpen(false)}>Kontakt</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
