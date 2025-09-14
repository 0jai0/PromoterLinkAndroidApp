import { enableScreens } from "react-native-screens";
enableScreens();

import { NavigationContainer } from "@react-navigation/native";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { store, persistor } from "./src/store/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { useEffect, useRef } from "react";
import { registerForPushNotificationsAsync } from "./src/utils/notifications";
import { storeUserToken } from "./src/utils/tokenService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";

function MainApp() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigationRef = useRef();

  const linking = {
    prefixes: [
      'PromoterLink://',
      'https://PromoterLink.com',
      'https://*.PromoterLink.com'
    ],
    config: {
      screens: {
        PublicProfile: 'PublicProfile',
      },
    },
  };

  useEffect(() => {
    const setupNotifications = async () => {
      if (!isAuthenticated || !user?._id) return;

      const token = await registerForPushNotificationsAsync();
      if (!token) return;

      const storedToken = await AsyncStorage.getItem(`fcmToken_${user._id}`);

      if (storedToken !== token) {
        await storeUserToken(user._id, token);
        await AsyncStorage.setItem(`fcmToken_${user._id}`, token);
        console.log("📌 Token stored for first time:", token);
      } else {
        console.log("✅ Token already stored, skipping...");
      }
    };

    setupNotifications();
  }, [isAuthenticated, user?._id]);

  useEffect(() => {
    const handleDeepLink = (event) => {
  const url = event.url;
  console.log('Deep link received:', url);
  
  // Handle different URL formats
  let userId = null;
  
  // Format 1: https://promoterlink.com/PublicProfile/userId123
  const regex1 = /\/PublicProfile\/([^\/]+)/;
  const match1 = url.match(regex1);
  
  // Format 2: PromoterLink://PublicProfile?userId=userId123
  const regex2 = /PromoterLink:\/\/PublicProfile\?userId=([^&]+)/;
  const match2 = url.match(regex2);
  
  // Format 3: https://promoterlink.com/profile?userId=userId123
  const urlObj = new URL(url);
  const queryParamUserId = urlObj.searchParams.get('userId');
  
  if (match1 && match1[1]) {
    userId = decodeURIComponent(match1[1]);
    console.log('Extracted userId from path:', userId);
  } else if (match2 && match2[1]) {
    userId = decodeURIComponent(match2[1]);
    console.log('Extracted userId from deep link:', userId);
  } else if (queryParamUserId) {
    userId = decodeURIComponent(queryParamUserId);
    console.log('Extracted userId from query param:', userId);
  }
  
  if (userId && navigationRef.current) {
    console.log('Navigating to profile for user:', userId);
    
    // Check if we're already on the PublicProfile screen to avoid duplicate navigation
    const currentRoute = navigationRef.current.getCurrentRoute();
    if (currentRoute && currentRoute.name === 'PublicProfile' && 
        currentRoute.params && currentRoute.params.userId === userId) {
      console.log('Already on the same profile, skipping navigation');
      return;
    }
    
    // Navigate to the PublicProfile screen
    navigationRef.current.navigate('PublicProfile', { userId });
  } else {
    console.log('No valid userId found in URL');
  }
};

    // Add event listener for deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Check if app was opened with a deep link
    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('App opened with deep link:', url);
        handleDeepLink({ url });
      }
    });

    return () => {
      // Clean up event listener
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer 
      linking={linking}
      ref={navigationRef}
    >
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainApp />
      </PersistGate>
    </Provider>
  );
}