import { enableScreens } from "react-native-screens";
enableScreens();

import { NavigationContainer } from "@react-navigation/native";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { store, persistor } from "./src/store/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "./src/utils/notifications";
import { storeUserToken } from "./src/utils/tokenService";
import AsyncStorage from "@react-native-async-storage/async-storage";

function MainApp() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

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

  return (
    <NavigationContainer>
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
