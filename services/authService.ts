
import { User, Creation } from '../types';

// --- SIMULATION DE BASE DE DONNÉES ---
// Dans une application réelle, ces données seraient dans une base de données sécurisée.
let users: User[] = [
  {
    id: 0,
    name: "Admin",
    email: "admin@alaizprod.art",
    role: "Admin",
    creations: [],
    preferences: { notifications: { newBlog: false, newEvents: false, recommendations: false } }
  },
  { 
    id: 1, 
    name: "Hervé Nanfang", 
    email: "herve@test.com", 
    role: "Artiste", 
    courses: [],
    creations: [],
    preferences: { notifications: { newBlog: true, newEvents: true, recommendations: true } }
  },
  { 
    id: 2, 
    name: "Sarah M.", 
    email: "sarah@test.com", 
    role: "Élève", 
    courses: ['indiv'],
    creations: [],
    preferences: { notifications: { newBlog: true, newEvents: false, recommendations: true } }
  },
];
let nextUserId = 3;

const SESSION_KEY = 'alaiz_user_session';

// Simule la latence du réseau
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const findUserIndex = (userId: number) => {
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error("Utilisateur non trouvé.");
    return index;
};

const persistUserSession = (user: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const login = async (email: string, password: string): Promise<User> => {
    await delay(500);
    // Dans une vraie application, le mot de passe serait haché et vérifié côté serveur.
    // Ici, nous ignorons le mot de passe pour la simulation.
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        persistUserSession(user);
        return user;
    }
    throw new Error("Email ou mot de passe incorrect.");
};

export const adminLogin = async (email: string, password: string): Promise<User> => {
    await delay(500);
    // Dans une vraie application, le mot de passe serait haché et vérifié côté serveur.
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.role === 'Admin') {
        // Le mot de passe est ignoré pour la simulation
        persistUserSession(user);
        return user;
    }
    throw new Error("Identifiants administrateur incorrects ou accès refusé.");
};

export const loginWithProvider = async (provider: 'Google' | 'Facebook'): Promise<User> => {
    await delay(1000);
    const mockEmail = provider === 'Google' ? 'google.user@test.com' : 'facebook.user@test.com';
    let user = users.find(u => u.email.toLowerCase() === mockEmail);
    if (!user) {
        user = {
            id: nextUserId++,
            name: `${provider} User`,
            email: mockEmail,
            role: 'Élève',
            courses: [],
            creations: [],
            preferences: { notifications: { newBlog: true, newEvents: true, recommendations: true } }
        };
        users.push(user);
    }
    persistUserSession(user);
    return user;
};


export const signup = async (name: string, email: string, password: string, role: 'Élève' | 'Artiste'): Promise<User> => {
    await delay(500);
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Un compte avec cet email existe déjà.");
    }
    const newUser: User = {
        id: nextUserId++,
        name,
        email,
        role,
        courses: [],
        creations: [],
        preferences: { notifications: { newBlog: true, newEvents: true, recommendations: true } }
    };
    users.push(newUser);
    persistUserSession(newUser);
    return newUser;
};

export const logout = async (): Promise<void> => {
    await delay(200);
    localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
        try {
            const user = JSON.parse(sessionData) as User;
            const dbUser = users.find(u => u.id === user.id);
            return dbUser || null;
        } catch (error) {
            return null;
        }
    }
    return null;
};

export const enrollInCourse = async (userId: number, formulaId: string): Promise<User> => {
    await delay(1000); // Simule le traitement du paiement
    const userIndex = findUserIndex(userId);
    const user = users[userIndex];
    if (user.courses?.includes(formulaId)) return user;

    const updatedUser = { ...user, courses: [...(user.courses || []), formulaId] };
    users[userIndex] = updatedUser;
    persistUserSession(updatedUser);
    return updatedUser;
};

export const addCreation = async (userId: number, creationData: Omit<Creation, 'id' | 'date'>): Promise<User> => {
    await delay(300);
    const userIndex = findUserIndex(userId);
    const user = users[userIndex];
    
    const newCreation: Creation = {
        ...creationData,
        id: Date.now(),
        date: new Date().toISOString(),
    };

    const updatedUser: User = {
        ...user,
        creations: [newCreation, ...(user.creations || [])],
    };
    
    users[userIndex] = updatedUser;
    persistUserSession(updatedUser);
    return updatedUser;
};

export const updateUserData = async (userId: number, data: { name?: string; email?: string }): Promise<User> => {
    await delay(400);
    const userIndex = findUserIndex(userId);
    const user = users[userIndex];
    
    const updatedUser = { ...user, ...data };
    users[userIndex] = updatedUser;
    persistUserSession(updatedUser);
    return updatedUser;
};

export const updateUserPreferences = async (userId: number, preferences: User['preferences']): Promise<User> => {
    await delay(300);
    const userIndex = findUserIndex(userId);
    const user = users[userIndex];
    
    const updatedUser = { ...user, preferences };
    users[userIndex] = updatedUser;
    persistUserSession(updatedUser);
    return updatedUser;
};

export const requestPasswordReset = async (email: string): Promise<void> => {
    await delay(1000);
    console.log(`SIMULATION: Envoi d'un e-mail de réinitialisation de mot de passe à ${email}`);
    // Dans une vraie application, on vérifierait si l'email existe et on enverrait un vrai email.
    // Pour la simulation, on ne fait rien de plus.
};
