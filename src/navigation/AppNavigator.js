import React from "react";
import { useSelector } from "react-redux";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../features/influencers/screen/Profile";

const Stack = createNativeStackNavigator();

// Create a separate PublicProfileScreen component
function PublicProfileScreen({ route }) {
  const { userId } = route.params;
  // You'll need to fetch user data from your API based on userId
  // This could be done with React Query, useEffect, or similar
  return <Profile user={fetchedUser} />;
}

export default function AppNavigator() {
  const {token, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {token ? (
        <Stack.Screen 
          name="Main" 
          component={MainNavigator} 
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator} 
          options={{ headerShown: false }}
        />
      )}
      {/* Public route accessible to everyone */}
      <Stack.Screen 
        name="PublicProfile" 
        component={PublicProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}