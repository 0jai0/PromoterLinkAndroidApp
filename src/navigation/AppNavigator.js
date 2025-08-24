import React from "react";
import { useSelector } from "react-redux";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { View, ActivityIndicator } from "react-native";

export default function AppNavigator() {
  const { token, isLoading } = useSelector((state) => state.auth);
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Just return navigators (no NavigationContainer here)
  return token ? <MainNavigator /> : <AuthNavigator />;
}
