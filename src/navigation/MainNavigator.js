// src/navigation/MainNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import screens
import HomeScreen from "../features/home/screens/HomeScreen";
import ProfileNavigator from "./ProfileNavigator";
import ViewProfile from "../features/profile/screens/ViewProfile";
import ChatScreen from "../message/screen/ChatScreen";
const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileNavigator}/>
      <Stack.Screen name="ViewProfile" component={ViewProfile} />
      <Stack.Screen name="Messaging" component={ChatScreen} />
    </Stack.Navigator>
  );
}