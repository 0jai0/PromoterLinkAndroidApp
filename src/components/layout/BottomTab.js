// src/components/layout/BottomTabs.js
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BottomTabs = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    {
      name: 'Home',
      iconName: 'home',
      routeName: 'Home',
    },
    {
      name: 'Notifications',
      iconName: 'notifications',
      routeName: 'Notifications',
    },
    {
      name: 'Profile',
      iconName: 'person',
      routeName: 'Profile',
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
          <Ionicons
            name={isActive(tab.routeName) ? tab.iconName : `${tab.iconName}-outline`}
            size={24}
            color={isActive(tab.routeName) ? '#6366f1' : '#9ca3af'}
          />
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

export default BottomTabs;