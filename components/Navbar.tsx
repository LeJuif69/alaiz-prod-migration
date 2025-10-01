import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon, UserIcon, ChevronDownIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

const NavItem: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void; end?: boolean; className?: string }> = ({ to, children, onClick, end, className }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={end}
      className={({ isActive }) => `${className} block px-4 py-2 text-lg font-semibold transition-colors duration-300 ${
          isActive ? 'text-alaiz-gold-light' : 'text-alaiz-cream/80 hover:text-alaiz-gold'
      }`}
    >
      {children}
    </NavLink>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    setIsOpen(false);
    navigate('/');
  };
  
  const closeAllMenus = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Accueil", end: true },
    { to: "/label", label: "Le Label" },
    { to: "/portfolio", label: "Portfolio" },
    { to: "/tutor", label: "Gombiste IA" },
    { to: "/academie", label: "Académie" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-alaiz-black/80 backdrop-blur-md shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex-shrink-0" onClick={closeAllMenus}>
             <div className="flex items-center justify-center h-20 px-4">
                <span className="font-playfair font-bold text-2xl transition-all duration-500 ease-in-out hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]">
                    <span className="text-alaiz-gold-light">A Laiz </span>
                    <span className="text-alaiz-cream">Prod</span>
                </span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-2">
             {navLinks.map(link => (
                <NavItem key={link.to} to={link.to} end={link.end}>{link.label}</NavItem>
             ))}
            {currentUser ? (
              <div className="relative flex items-center gap-4">
                <NotificationBell />
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-alaiz-gray hover:bg-alaiz-dark transition-colors">
                  <UserIcon className="w-6 h-6 text-alaiz-gold" />
                  <span className="font-semibold text-alaiz-cream">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDownIcon className={`w-5 h-5 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-alaiz-dark rounded-md shadow-lg py-1 z-10 animate-fade-in-up" style={{animationDuration: '0.2s'}}>
                    <Link to="/profil" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-alaiz-cream hover:bg-alaiz-gray">Mon Profil</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-alaiz-gray">Déconnexion</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/connexion" className="ml-4 px-6 py-2 rounded-full font-bold bg-alaiz-gold text-alaiz-black hover:bg-alaiz-gold-light transition-colors">
                Connexion
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
             {currentUser && (
                <>
                  <NotificationBell />
                  <Link to="/profil" onClick={() => setIsOpen(false)} className="text-alaiz-gold"><UserIcon className="w-7 h-7" /></Link>
                </>
             )}
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Ouvrir le menu">
              <MenuIcon className="w-8 h-8 text-alaiz-gold" />
            </button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Menu --- */}
      {/* Overlay */}
      <div
          className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ease-in-out md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
      ></div>

      {/* Panel */}
      <div
          className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-alaiz-gray shadow-lg p-6 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          role="dialog"
          aria-modal="true"
      >
          <div className="flex justify-between items-center mb-8">
              <span className="font-playfair font-bold text-xl text-alaiz-gold-light">Menu</span>
              <button onClick={() => setIsOpen(false)} aria-label="Fermer le menu">
                  <XIcon className="w-8 h-8 text-alaiz-gold" />
              </button>
          </div>
          
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link, index) => (
                <div key={link.to} className={`transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: `${100 + index * 50}ms` }}>
                  <NavItem to={link.to} onClick={closeAllMenus} end={link.end} className="!px-0 !py-3">{link.label}</NavItem>
                </div>
            ))}
            <div className={`mt-6 pt-6 border-t border-alaiz-gold/20 transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: `${100 + navLinks.length * 50}ms` }}>
              {currentUser ? (
                   <button onClick={handleLogout} className="block w-full text-left px-0 py-3 text-lg font-semibold text-red-400 hover:bg-alaiz-gray rounded">Déconnexion</button>
              ) : (
                   <Link to="/connexion" onClick={closeAllMenus} className="block text-center py-3 rounded-full font-bold bg-alaiz-gold text-alaiz-black hover:bg-alaiz-gold-light transition-colors">
                      Connexion
                   </Link>
              )}
            </div>
          </nav>
      </div>

    </header>
  );
};

export default Navbar;