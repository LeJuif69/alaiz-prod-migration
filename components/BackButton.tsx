import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeftIcon } from './Icons';

interface BackButtonProps {
  to?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to = '/', className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBackClick = () => {
        // React Router v6 specific: location.key will be 'default' on the first page load.
        // If it's anything else, it means we have a navigation history within the app.
        if (location.key !== 'default') {
            navigate(-1);
        } else {
            // Fallback for direct page access.
            navigate(to, { replace: true });
        }
    };

    return (
        <button
            onClick={handleBackClick}
            className={`
                group
                relative w-12 h-12 rounded-full 
                flex items-center justify-center
                bg-alaiz-gray/50 border-2 border-alaiz-gold/40
                text-alaiz-gold
                transition-all duration-300 ease-in-out
                hover:bg-alaiz-gold/10 hover:border-alaiz-gold hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-alaiz-black focus:ring-alaiz-gold
                ${className}
            `}
            aria-label="Retour"
            title="Retour"
        >
            <span className="absolute inset-0 rounded-full bg-alaiz-gold opacity-0 transition-opacity duration-300 group-hover:opacity-10"></span>
            <ChevronLeftIcon className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-1" />
        </button>
    );
};

export default BackButton;