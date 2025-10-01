import { Notification, User } from '../types';

// Simule une base de données de notifications
let notifications: Notification[] = [];
let hasGenerated = false;

// Simule la latence du réseau
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const generateInitialNotifications = (user: User): Notification[] => {
    const notifs: Notification[] = [
        { id: 1, text: "Bienvenue sur A Laiz Prod ! Explorez nos fonctionnalités.", link: "/label", date: new Date().toISOString(), read: false },
        { id: 2, text: "Nouvel article de blog : 'Les secrets d'un bon mix'", link: "/blog/1", date: new Date(Date.now() - 86400000).toISOString(), read: false },
        { id: 3, text: "Événement à venir : Concert 'Jazz & Racines' ce mois-ci.", link: "/contact#calendrier", date: new Date(Date.now() - 2 * 86400000).toISOString(), read: true },
    ];
    if (user.role === 'Élève') {
        notifs.push({
            id: 4,
            text: "Conseil du jour : pensez à bien vous échauffer la voix avant de chanter !",
            link: "/blog/4",
            date: new Date().toISOString(),
            read: false
        });
    }
    return notifs;
};


export const getNotifications = async (user: User): Promise<Notification[]> => {
    await delay(300);
    if (!hasGenerated) {
        notifications = generateInitialNotifications(user);
        hasGenerated = true;
    }
    return notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const markAsRead = async (): Promise<Notification[]> => {
    await delay(100);
    notifications = notifications.map(n => ({ ...n, read: true }));
    return notifications;
};