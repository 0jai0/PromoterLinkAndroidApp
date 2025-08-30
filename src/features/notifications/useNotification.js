// src/hooks/useNotification.js
import { useState, useEffect } from 'react';
import { notificationApi } from './notification.api';
import { useSelector } from 'react-redux';

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const fetchNotifications = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.getUserNotifications(user._id);
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead({
        userId: user._id,
        notificationId,
      });
      
      // Remove the notification from local state
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Create an array of promises to mark all notifications as read
      const promises = notifications.map(notif => 
        notificationApi.markAsRead({
          userId: user._id,
          notificationId: notif._id,
        })
      );
      
      await Promise.all(promises);
      setNotifications([]); // Clear all notifications
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const isMessageNotification = (notification) => {
    return notification.subject && 
           (notification.subject.includes('Message') || 
            notification.subject.includes('Chat') ||
            notification.message.includes('message') ||
            notification.message.includes('chat'));
  };

  // Extract user ID from message notification
  const extractUserIdFromMessage = (notification) => {
  const message = notification.message || '';
  
  // Method 1: Using a delimiter pattern like |userId:XXXXX|
  const userIdMatch = message.match(/\|userId:(\w+)\|/);
  if (userIdMatch) return userIdMatch[1];
  
  // Method 2: Looking for a 24-character MongoDB ID (fallback)
  const mongoIdMatch = message.match(/\b[0-9a-fA-F]{24}\b/);
  if (mongoIdMatch) return mongoIdMatch[0];
  
  return null;
};

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user?._id]);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    isMessageNotification,
    extractUserIdFromMessage
  };
};