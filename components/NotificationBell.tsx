import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { getNotifications, markAsRead } from '../services/notificationService';
import { Notification } from '../types';

const NotificationBell: React.FC = () => {
    const { currentUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (currentUser) {
            const fetchNotifications = async () => {
                const userNotifications = await getNotifications(currentUser);
                setNotifications(userNotifications);
            };
            fetchNotifications();
        }
    }, [currentUser]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleToggle = async () => {
        setIsOpen(prev => !prev);
        if (!isOpen && unreadCount > 0) {
            // Mark as read after a short delay to allow panel to open
            setTimeout(async () => {
                const updatedNotifications = await markAsRead();
                setNotifications(updatedNotifications);
            }, 1000);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className="relative p-2 rounded-full text-alaiz-cream/80 hover:text-alaiz-gold hover:bg-alaiz-gray transition-colors"
                aria-label={`Notifications (${unreadCount} non lues)`}
            >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-alaiz-black text-xs"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-alaiz-dark rounded-md shadow-lg z-20 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                    <div className="p-3 font-bold border-b border-alaiz-gold/20">Notifications</div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(notif => (
                                <Link
                                    key={notif.id}
                                    to={notif.link}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-start gap-3 p-3 hover:bg-alaiz-gray transition-colors"
                                >
                                    {!notif.read && <div className="w-2 h-2 mt-1.5 rounded-full bg-alaiz-gold flex-shrink-0"></div>}
                                    <div className={notif.read ? 'pl-5' : ''}>
                                        <p className="text-sm text-alaiz-cream/90">{notif.text}</p>
                                        <p className="text-xs text-alaiz-cream/60 mt-1">{new Date(notif.date).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="p-4 text-center text-sm text-alaiz-cream/70">Aucune notification pour le moment.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;