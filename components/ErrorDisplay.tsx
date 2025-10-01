
import React from 'react';

const ErrorDisplay: React.FC<{ message?: string }> = ({ message = "Une erreur est survenue." }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <p className="text-red-500 text-lg font-bold">{message}</p>
    <p className="text-alaiz-cream/70 mt-2">Veuillez réessayer plus tard ou rafraîchir la page.</p>
  </div>
);

export default ErrorDisplay;
