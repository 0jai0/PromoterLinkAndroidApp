// src/navigation/ProfileNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import profile-related screens
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import UpdateProfileScreen from "../features/profile/screens/UpdateProfile";
import ViewProfile from "../features/profile/screens/ViewProfile";
const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileMain"
      screenOptions={{ 
        headerShown: false,
        animation: "slide_from_right"
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: "Profile" }}
      />
      <Stack.Screen 
        name="UpdateProfile" 
        component={UpdateProfileScreen} 
        options={{ title: "Update Profile" }}
      />

      <Stack.Screen 
        name="ViewProfile" 
        component={ViewProfile} 
        options={{ title: "View Profile" }}
      />

      
    </Stack.Navigator>
  );
}