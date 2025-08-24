// src/components/layout/AppLayout.js
import React from 'react';
import { View } from 'react-native';
import BottomTabs from './BottomTab';

const AppLayout = ({ children, showTabs = true }) => {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1">
        {children}
      </View>
      {showTabs && <BottomTabs />}
    </View>
  );
};

export default AppLayout;