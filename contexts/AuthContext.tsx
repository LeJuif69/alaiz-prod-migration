
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import * as authService from '../services/authService';
import { User, Creation } from '../types';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    adminLogin: (email: string, password: string) => Promise<User>;
    loginWithProvider: (provider: 'Google' | 'Facebook') => Promise<User>;
    signup: (name: string, email: string, password: string, role: 'Élève' | 'Artiste') => Promise<User>;
    logout: () => Promise<void>;
    enrollInCourse: (formulaId: string) => Promise<User | void>;
    saveUserCreation: (creation: Omit<Creation, 'id' | 'date'>) => Promise<User | void>;
    updateUser: (data: { name?: string; email?: string }) => Promise<User | void>;
    updatePreferences: (preferences: User['preferences']) => Promise<User | void>;
    requestPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const user = await authService.login(email, password);
        setCurrentUser(user);
        return user;
    };
    
    const adminLogin = async (email: string, password: string) => {
        const user = await authService.adminLogin(email, password);
        setCurrentUser(user);
        return user;
    };

    const loginWithProvider = async (provider: 'Google' | 'Facebook') => {
        const user = await authService.loginWithProvider(provider);
        setCurrentUser(user);
        return user;
    };

    const signup = async (name: string, email: string, password: string, role: 'Élève' | 'Artiste') => {
        const user = await authService.signup(name, email, password, role);
        setCurrentUser(user);
        return user;
    };

    const logout = async () => {
        await authService.logout();
        setCurrentUser(null);
    };
    
    const enrollInCourse = async (formulaId: string) => {
        if (!currentUser) throw new Error("Vous devez être connecté pour vous inscrire.");
        const updatedUser = await authService.enrollInCourse(currentUser.id, formulaId);
        setCurrentUser(updatedUser);
        return updatedUser;
    };
    
    const saveUserCreation = async (creation: Omit<Creation, 'id' | 'date'>) => {
        if (!currentUser) throw new Error("Utilisateur non connecté.");
        const updatedUser = await authService.addCreation(currentUser.id, creation);
        setCurrentUser(updatedUser);
        return updatedUser;
    };

    const updateUser = async (data: { name?: string; email?: string }) => {
         if (!currentUser) throw new Error("Utilisateur non connecté.");
        const updatedUser = await authService.updateUserData(currentUser.id, data);
        setCurrentUser(updatedUser);
        return updatedUser;
    };
    
    const updatePreferences = async (preferences: User['preferences']) => {
        if (!currentUser || !preferences) throw new Error("Utilisateur non connecté.");
        const updatedUser = await authService.updateUserPreferences(currentUser.id, preferences);
        setCurrentUser(updatedUser);
        return updatedUser;
    };
    
    const requestPasswordReset = async (email: string) => {
        await authService.requestPasswordReset(email);
    };

    const value = { currentUser, loading, login, adminLogin, signup, logout, enrollInCourse, saveUserCreation, loginWithProvider, updateUser, updatePreferences, requestPasswordReset };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
