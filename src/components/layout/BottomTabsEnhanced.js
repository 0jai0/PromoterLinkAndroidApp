// src/components/layout/BottomTabsEnhanced.js
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const BottomTabsEnhanced = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get badge counts from Redux store
  const { unreadCount } = useSelector(state => state.notifications);
  const { unreadMessages } = useSelector(state => state.messaging);

  const tabs = [
    {
      name: 'Home',
      iconName: 'home',
      routeName: 'Home',
      badge: null,
    },
    {
      name: 'Notifications',
      iconName: 'notifications',
      routeName: 'Notifications',
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      name: 'Profile',
      iconName: 'person',
      routeName: 'Profile',
      badge: null,
    },
  ];

  const isActive = (tabRouteName) => {
    return route.name === tabRouteName;
  };

  return (
    <View className="flex-row justify-around items-center bg-white border-t border-gray-200 h-16">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          className="flex items-center justify-center w-16 h-16"
          onPress={() => navigation.navigate(tab.routeName)}
        >
          <View className="relative">
            <Ionicons
              name={isActive(tab.routeName) ? tab.iconName : `${tab.iconName}-outline`}
              size={24}
              color={isActive(tab.routeName) ? '#6366f1' : '#9ca3af'}
            />
            {tab.badge && (
              <View className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
                <Text className="text-white text-xs font-bold">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </Text>
              </View>
            )}
          </View>
          <Text
            className={`text-xs mt-1 ${
              isActive(tab.routeName) ? 'text-indigo-600 font-medium' : 'text-gray-500'
            }`}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomTabsEnhanced;