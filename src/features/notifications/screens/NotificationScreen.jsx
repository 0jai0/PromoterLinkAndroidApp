// src/screens/NotificationScreen.js
import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useNotification } from '../useNotification';
import { Ionicons } from '@expo/vector-icons';
import AppLayout from '../../../components/layout/AppLayout';
import Header from '../../home/components/Header/Header';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    isMessageNotification,
    extractUserIdFromMessage,
  } = useNotification();

  const onRefresh = () => {
    fetchNotifications();
  };

  const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMilliseconds = now - date;
  const diffInSeconds = diffInMilliseconds / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    const minutes = Math.floor(diffInMinutes);
    return `${minutes}m ago`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    const remainingMinutes = Math.floor(diffInMinutes % 60);
    
    if (remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}m ago`;
    } else {
      return `${hours}h ago`;
    }
  } else if (diffInDays < 7) {
    const days = Math.floor(diffInDays);
    const remainingHours = Math.floor(diffInHours % 24);
    
    if (remainingHours > 0) {
      return `${days}d ${remainingHours}h ago`;
    } else {
      return `${days}d ago`;
    }
  } else {
    // For older than a week, show the actual date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

  const handleNotificationPress = (notification) => {
    // Mark as read first
    markAsRead(notification._id);
    
    // Check if it's a message notification and navigate to messages
    if (isMessageNotification(notification)) {
      const userId = extractUserIdFromMessage(notification);
      
      if (userId) {
        // Navigate to chat with the specific user
        console.log("kjhvhjk",userId);
        navigation.navigate('Messaging', { 
          userId: userId
        });
      } else {
        // Navigate to general messages screen
        navigation.navigate('Messaging');
      }
    } else if (notification.mediaLink) {
      // Handle other types of notifications with media links
      // You can add more specific navigation logic here
      navigation.navigate('WebView', { url: notification.mediaLink });
    }
    // Add more conditions for other notification types as needed
  };

  return (
    <AppLayout>
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="flex-1 p-4">
          {/* Header */}
          <Header 
            user={user} 
            navigation={navigation} 
            title="Notifications"
            showBackButton={true}
          />

          {/* Actions */}
          {notifications.length > 0 && (
            <View className="flex-row justify-end mb-4">
              <TouchableOpacity
                onPress={markAllAsRead}
                className="px-4 py-2 bg-blue-100 rounded-lg flex-row items-center"
              >
                <Ionicons name="checkmark-done" size={16} color="#3B82F6" />
                <Text className="text-blue-600 ml-2 text-sm font-medium">
                  Mark all as read
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View className="bg-red-50 p-4 rounded-xl mb-4 border border-red-100">
              <View className="flex-row items-center mb-2">
                <Ionicons name="warning" size={20} color="#EF4444" />
                <Text className="text-red-800 ml-2 font-medium">
                  Error Loading Notifications
                </Text>
              </View>
              <Text className="text-red-700 mb-4 text-sm">{error}</Text>
              <TouchableOpacity
                onPress={fetchNotifications}
                className="bg-red-600 py-3 px-4 rounded-xl flex-row justify-center items-center shadow-xs"
              >
                <Ionicons name="refresh" size={16} color="white" />
                <Text className="text-white ml-2 font-medium">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Notifications List */}
          <ScrollView
            className="flex-1"
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={onRefresh}
                colors={["#3B82F6"]}
                tintColor="#3B82F6"
              />
            }
          >
            {notifications.length === 0 ? (
              <View className="py-12 items-center bg-white rounded-xl p-6 mt-2 border border-slate-200 shadow-xs">
                <View className="bg-slate-100 p-4 rounded-full mb-4">
                  <Ionicons name="notifications-off" size={36} color="#64748B" />
                </View>
                <Text className="text-slate-800 mt-4 text-lg font-medium">
                  No notifications
                </Text>
                <Text className="text-slate-500 text-center mt-2 text-sm">
                  You're all caught up! New notifications will appear here.
                </Text>
              </View>
            ) : (
              <View className="space-y-3">
                {notifications.map((notification) => (
                  <TouchableOpacity
                    key={notification._id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs"
                    onPress={() => handleNotificationPress(notification)}
                  >
                    <View className="flex-row items-start">
                      <View className={`p-2 rounded-full mr-3 ${
                        isMessageNotification(notification) 
                          ? "bg-blue-100" 
                          : "bg-green-100"
                      }`}>
                        <Ionicons 
                          name={isMessageNotification(notification) ? "chatbubble" : "notifications"} 
                          size={20} 
                          color={isMessageNotification(notification) ? "#3B82F6" : "#10B981"} 
                        />
                      </View>
                      
                      <View className="flex-1">
                        <Text className="text-slate-800 font-semibold text-base">
                          {notification.subject}
                        </Text>
                        <Text className="text-slate-600 mt-1 text-sm">
                          {notification.message}
                        </Text>
                        
                        {notification.mediaLink && (
                          <View className="mt-2 bg-slate-50 p-2 rounded-lg">
                            <Text className="text-blue-500 text-xs" numberOfLines={1}>
                              {notification.mediaLink}
                            </Text>
                          </View>
                        )}
                        
                        <View className="flex-row justify-between items-center mt-3">
                          <Text className="text-slate-400 text-xs">
                            {formatTime(notification.time)}
                          </Text>
                          <TouchableOpacity
                            onPress={() => markAsRead(notification._id)}
                            className="p-1"
                          >
                            <Ionicons name="close" size={16} color="#94A3B8" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </AppLayout>
  );
};

export default NotificationScreen;