
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';
import { User } from '../types';

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: User['role'] }> = ({ children, role }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader message="Vérification de l'authentification..." /></div>;
  }

  if (!currentUser) {
    // Redirige vers la page de connexion, mais garde en mémoire la page où l'utilisateur voulait aller.
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }
  
  if (role && currentUser.role !== role) {
    // Redirige vers la page d'accueil si l'utilisateur n'a pas le bon rôle.
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
