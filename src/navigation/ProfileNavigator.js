// src/navigation/ProfileNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import profile-related screens
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import UpdateProfileScreen from "../features/profile/screens/UpdateProfile";
import ViewProfile from "../features/profile/screens/ViewProfile";
import ForgotPasswordScreen from "../features/auth/screens/ForgotPasswordScreen";
import PrivacyPolicyScreen from "../features/profile/screens/PrivacyPolicyScreen";
import HelpSupportScreen from "../features/profile/screens/HelpSupportScreen";
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

      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{ title: "Forgot Password" }}
      />

      <Stack.Screen 
        name="PrivacyPolicy" 
        component={PrivacyPolicyScreen} 
        options={{ title: "Privacy Policy" }}
      />

      <Stack.Screen 
        name="HelpSupport" 
        component={HelpSupportScreen} 
        options={{ title: "Help Support" }}
      />

      
    </Stack.Navigator>
  );
}