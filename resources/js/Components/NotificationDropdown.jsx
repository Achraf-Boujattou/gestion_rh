import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);

    // Configure axios defaults
    useEffect(() => {
        // Add CSRF token to all requests
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (token) {
            axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
        }
        
        // Set base URL
        axios.defaults.baseURL = window.location.origin;
        axios.defaults.withCredentials = true;
    }, []);

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            setError(null);
            const response = await axios.get('/notifications');
            if (response.data && response.data.notifications) {
                setNotifications(response.data.notifications.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('Impossible de charger les notifications');
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get('/notifications/unread-count');
            if (response.data && typeof response.data.count === 'number') {
                setUnreadCount(response.data.count);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.post(`/notifications/${notificationId}/mark-as-read`);
            await fetchNotifications();
            await fetchUnreadCount();
        } catch (error) {
            console.error('Error marking notification as read:', error);
            setError('Impossible de marquer comme lu');
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/notifications/mark-all-as-read');
            await fetchNotifications();
            await fetchUnreadCount();
        } catch (error) {
            console.error('Error marking all as read:', error);
            setError('Impossible de tout marquer comme lu');
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchNotifications();
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-gray-600 hover:text-gray-700 focus:outline-none"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Tout marquer comme lu
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {error && (
                            <div className="p-4 text-center text-red-600 bg-red-50">
                                {error}
                            </div>
                        )}
                        {!error && notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                                        !notification.read ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">{notification.title}</h4>
                                        <span className="text-xs text-gray-500">
                                            {format(new Date(notification.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                {!error && 'Aucune notification'}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 