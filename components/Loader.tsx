
import React from 'react';

const Loader: React.FC<{ message?: string }> = ({ message = "Chargement..." }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alaiz-gold mb-4"></div>
    <p className="text-alaiz-cream/80 text-lg">{message}</p>
  </div>
);

export default Loader;
