
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, YoutubeIcon, WhatsAppIcon } from './Icons';
import { useData } from '../contexts/DataContext';

const Footer: React.FC = () => {
  const { labelInfo, loading } = useData();

  if (loading || !labelInfo) {
    return (
        <footer className="bg-alaiz-gray border-t border-alaiz-gold/20 mt-16 animate-pulse">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="h-24 bg-alaiz-dark/50 rounded"></div>
                    <div className="h-24 bg-alaiz-dark/50 rounded"></div>
                    <div className="h-24 bg-alaiz-dark/50 rounded"></div>
                    <div className="h-24 bg-alaiz-dark/50 rounded"></div>
                </div>
            </div>
            <div className="bg-alaiz-black py-4">
                <div className="container mx-auto px-6 text-center text-sm text-alaiz-cream/50">
                    &copy; {new Date().getFullYear()} A Laiz Prod. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
  }
  
  return (
    <footer className="bg-alaiz-gray border-t border-alaiz-gold/20 mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
                <h3 className="text-xl font-playfair font-bold text-alaiz-gold-light">{labelInfo.name}</h3>
                <p className="text-alaiz-cream/70 mt-2">{labelInfo.slogan}</p>
                <div className="flex justify-center md:justify-center space-x-4 mt-4">
                    <a href={labelInfo.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-alaiz-cream/60 hover:text-alaiz-gold transition-colors"><FacebookIcon className="w-6 h-6" /></a>
                    <a href={labelInfo.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-alaiz-cream/60 hover:text-alaiz-gold transition-colors"><InstagramIcon className="w-6 h-6" /></a>
                    <a href={labelInfo.socials.youtube} target="_blank" rel="noopener noreferrer" className="text-alaiz-cream/60 hover:text-alaiz-gold transition-colors"><YoutubeIcon className="w-6 h-6" /></a>
                    <a href={labelInfo.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="text-alaiz-cream/60 hover:text-alaiz-gold transition-colors"><WhatsAppIcon className="w-6 h-6" /></a>
                </div>
            </div>
            
            <div>
                 <h4 className="font-bold text-alaiz-cream">Liens Rapides</h4>
                 <nav className="mt-2 space-y-1 text-alaiz-cream/70">
                    <NavLink to="/" className="hover:text-alaiz-gold transition-colors block">Accueil</NavLink>
                    <NavLink to="/label" className="hover:text-alaiz-gold transition-colors block">Le Label</NavLink>
                    <NavLink to="/academie" className="hover:text-alaiz-gold transition-colors block">Académie</NavLink>
                    <NavLink to="/blog" className="hover:text-alaiz-gold transition-colors block">Blog</NavLink>
                    <NavLink to="/contact" className="hover:text-alaiz-gold transition-colors block">Contact</NavLink>
                    <NavLink to="/mentions-legales" className="hover:text-alaiz-gold transition-colors block">Mentions Légales</NavLink>
                 </nav>
            </div>

            <div>
                 <h4 className="font-bold text-alaiz-cream">Explorer</h4>
                 <nav className="mt-2 space-y-1 text-alaiz-cream/70">
                    <NavLink to="/portfolio" className="hover:text-alaiz-gold transition-colors block">Portfolio</NavLink>
                    <NavLink to="/tutor" className="hover:text-alaiz-gold transition-colors block">Gombiste IA</NavLink>
                 </nav>
            </div>

            <div>
                <h4 className="font-bold text-alaiz-cream">Contact</h4>
                <div className="mt-2 space-y-1 text-alaiz-cream/70">
                    <p>{labelInfo.address}</p>
                    {labelInfo.phones.map(phone => <p key={phone}>{phone}</p>)}
                    <a href={`mailto:${labelInfo.emails.contact}`} className="hover:text-alaiz-gold transition-colors block">{labelInfo.emails.contact}</a>
                </div>
            </div>

        </div>
      </div>
      <div className="bg-alaiz-black py-4">
        <div className="container mx-auto px-6 text-center text-sm text-alaiz-cream/50">
          &copy; {new Date().getFullYear()} {labelInfo.name}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
