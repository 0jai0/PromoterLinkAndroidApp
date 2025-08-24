import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Image,
  SafeAreaView 
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../../auth/useAuth";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useContacts } from "../../home/hooks/useContacts"; // Import the hook
const ProfileScreen = () => {
  const { logoutUser, error } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const { contacts, loading: contactsLoading } = useContacts(user?.id); // Use the hook
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [appVersion, setAppVersion] = useState("1.0.0");

  useEffect(() => {
    // Get app version from app.json via Expo constants
    if (Constants.expoConfig && Constants.expoConfig.version) {
      setAppVersion(Constants.expoConfig.version);
    }
  }, []);


  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            setLoading(true);
            try {
              // Clear any existing notifications logic can go here
              dispatch(logoutUser());
              navigation.replace("Login");
            } catch (error) {
              console.error("Logout error:", error);
            } finally {
              setLoading(false);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // Calculate statistics
  const contactsCount = contacts.length;

  const menuItems = [
    {
      id: "profile",
      title: "View Profile",
      icon: "person-outline",
      onPress: () => navigation.navigate("ViewProfile", { userId: user?.id })
    },
    {
      id: "update",
      title: "Update Profile",
      icon: "create-outline",
      onPress: () => navigation.navigate("UpdateProfile")
    },
    {
      id: "password",
      title: "Change Password",
      icon: "lock-closed-outline",
      onPress: () => navigation.navigate("ChangePassword")
    },
    {
      id: "settings",
      title: "Settings",
      icon: "settings-outline",
      onPress: () => navigation.navigate("Settings")
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: "shield-checkmark-outline",
      onPress: () => navigation.navigate("PrivacyPolicy")
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "help-circle-outline",
      onPress: () => navigation.navigate("HelpSupport")
    },
    {
      id: "logout",
      title: "Logout",
      icon: "log-out-outline",
      color: "#EF4444",
      onPress: handleLogout
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-8 items-center border-b border-slate-200">
          <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4">
            {user?.profilePicture ? (
              <Image
                source={{ uri: user.profilePicture }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <Ionicons name="person" size={40} color="#3B82F6" />
            )}
          </View>
          <Text className="text-2xl font-bold text-slate-800 mb-1">
            {user?.ownerName || "User"}
          </Text>
          <Text className="text-slate-500 text-base">
            {user?.email || "user@example.com"}
          </Text>
          {user?.bio && (
            <Text className="text-slate-600 text-center mt-3 text-sm">
              {user.bio}
            </Text>
          )}
        </View>

        {/* Stats Section */}
        <View className="bg-white px-6 py-4 mt-4 mx-4 rounded-xl border border-slate-200 shadow-xs">
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-lg font-semibold text-slate-800">{contactsCount}</Text>
              <Text className="text-slate-500 text-sm">Contacts</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-semibold text-slate-800">{user.pastPosts.length}</Text>
              <Text className="text-slate-500 text-sm">Promotions</Text>
            </View>
            
          </View>
        </View>

        {/* Menu Items */}
        <View className="mx-4 mt-6 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                className="flex-row items-center px-6 py-4 active:bg-slate-50"
                onPress={item.onPress}
                disabled={loading}
              >
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={item.color || "#64748B"}
                />
                <Text
                  className={`ml-4 text-base flex-1 ${
                    item.color ? "text-red-500" : "text-slate-700"
                  }`}
                >
                  {item.title}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#94A3B8"
                />
              </TouchableOpacity>
              {index < menuItems.length - 1 && (
                <View className="h-px bg-slate-100 ml-16" />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* App Version */}
        <View className="mx-4 mt-6 mb-8">
          <Text className="text-center text-slate-400 text-xs">
            App Version {appVersion}
          </Text>
        </View>
      </ScrollView>

      {loading && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white p-6 rounded-xl items-center">
            <Ionicons name="log-out-outline" size={32} color="#3B82F6" />
            <Text className="text-slate-800 mt-2 font-medium">Logging out...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;