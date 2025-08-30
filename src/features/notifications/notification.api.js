// src/api/notification.api.js
import API from '../../api/config';

export const notificationApi = {
  // Store FCM token
  storeToken: (data) => API.post('/api/notifications/token/store', data),
  
  // Get user token
  getToken: (userId) => API.get(`/api/notifications/token/${userId}`),
  
  // Send notification
  sendNotification: (data) => API.post('/api/notifications/send', data),
  
  // Get user notifications
  getUserNotifications: (userId) => API.get(`/api/notifications/${userId}`),
  
  // Mark notification as read
  markAsRead: (data) => API.put('/api/notifications/read', data),
};