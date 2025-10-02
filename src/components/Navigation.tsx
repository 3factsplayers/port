import { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  onAdminClick: () => void;
}

export default function Navigation({ onAdminClick }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => scrollToSection('home')}
            className={`text-xl font-bold transition-colors ${
              isScrolled ? 'text-slate-900' : 'text-slate-900'
            }`}
          >
            Portfolio
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('home')}
              className={`font-medium transition-colors ${
                isScrolled
                  ? 'text-slate-700 hover:text-slate-900'
                  : 'text-slate-800 hover:text-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('works')}
              className={`font-medium transition-colors ${
                isScrolled
                  ? 'text-slate-700 hover:text-slate-900'
                  : 'text-slate-800 hover:text-slate-900'
              }`}
            >
              Works
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className={`font-medium transition-colors ${
                isScrolled
                  ? 'text-slate-700 hover:text-slate-900'
                  : 'text-slate-800 hover:text-slate-900'
              }`}
            >
              Skills
            </button>
            <button
              onClick={onAdminClick}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <Shield className="w-4 h-4" />
              {user ? 'Dashboard' : 'Admin'}
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-900"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg mt-2">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('works')}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              Works
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              Skills
            </button>
            <button
              onClick={() => {
                onAdminClick();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              <Shield className="w-4 h-4" />
              {user ? 'Dashboard' : 'Admin'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}