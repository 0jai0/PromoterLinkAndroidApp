import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  Share 
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../../auth/useAuth";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useContacts } from "../../home/hooks/useContacts"; // Import the hook
import {
  badges_01,
  badges_02,
  badges_03,
  badges_04,
  badges_05,
  badges_06,
  badges_07,
  badges_08,
} from "../../../utils/images";
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
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Stay Logged In",
        style: "cancel",
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
        style: "destructive",
      },
    ]);
  };

  const handleShareProfile = async () => {
  try {
    // Encode user data for URL
    const encodedName = encodeURIComponent(user?.ownerName || "User");
    const encodedId = encodeURIComponent(user?._id);
    
    // Create universal link (if you have a web version)
    const universalLink = `https://promoterlink.com/PublicProfile?userId=${encodedId}&name=${encodedName}`;
    
    // Create deep link as fallback
    const deepLink = `promoterlink://PublicProfile?userId=${encodedId}&name=${encodedName}`;
    //console.log(deepLink);
    // Create message with both links
    const message = `Check out ${user?.ownerName || "my"} profile on PromoterLink!\n\n${universalLink}\n\nOr open in app: ${deepLink}`;
    
    const result = await Share.share({
      message,
      title: 'Share Profile',
      url: deepLink // Some platforms may use this
    });
  } catch (error) {
    Alert.alert('Error', 'Failed to share profile');
    console.error('Error sharing profile:', error);
  }
};
  
  const getBadge = (count) => {
    if (count >= 500) return badges_08;
    if (count >= 250) return badges_07;
    if (count >= 150) return badges_06;
    if (count >= 100) return badges_05;
    if (count >= 50) return badges_04;
    if (count >= 25) return badges_03;
    if (count >= 10) return badges_02;
    if (count >= 1) return badges_01;
    return null;
  };

  // Calculate statistics
  const contactsCount = contacts.length;

  const menuItems = [
    {
      id: "profile",
      title: "View Profile",
      icon: "person-outline",
      onPress: () => navigation.navigate("ViewProfile", { userId: user?.id }),
    },
    {
      id: "update",
      title: "Update Profile",
      icon: "create-outline",
      onPress: () => navigation.navigate("UpdateProfile"),
    },
    {
      id: "Promoter Badges",
      title: "Promoter Badges",
      icon: "ribbon-outline",
      onPress: () => navigation.navigate("BadgeExplanation"),
    },
    {
    id: "share",
    title: "Share My Profile",
    icon: "share-social-outline",
    onPress: () => handleShareProfile()
  },
    {
      id: "password",
      title: "Change Password",
      icon: "lock-closed-outline",
      onPress: () => navigation.navigate("ForgotPassword"),
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: "shield-checkmark-outline",
      onPress: () => navigation.navigate("PrivacyPolicy"),
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "help-circle-outline",
      onPress: () => navigation.navigate("HelpSupport"),
    },
    {
      id: "logout",
      title: "Logout",
      icon: "log-out-outline",
      color: "#EF4444",
      onPress: handleLogout,
    },
  ];

  const getAvatarGradient = (name) => {
    const colors = [
      ["#FF9A8B", "#FF6A88"], // Coral
      ["#93E9BE", "#65C7F7"], // Mint to blue
      ["#FFCDA5", "#FF6B6B"], // Peach to coral
      ["#A3C9F1", "#6A93F8"], // Light blue to blue
      ["#D4AFEE", "#9D50DD"], // Lavender to purple
      ["#FFD26F", "#FF965B"], // Yellow to orange
      ["#89F7FE", "#66A6FF"], // Sky blue to blue
      ["#81FBB8", "#28C76F"], // Light green to green
    ];

    // Simple hash function to get consistent color based on name
    const hash = name.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  const [gradientStart, gradientEnd] = getAvatarGradient(
    user.ownerName || "User"
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-8 items-center border-b border-slate-200">
          <View className="flex-row mt-5 items-center flex-1">
            {user.profilePicUrl ? (
              <Image
                source={{ uri: user.profilePicUrl }}
                className="w-16 h-16 rounded-full border-2 border-white shadow-sm"
              />
            ) : (
              <View
                className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                style={{
                  backgroundColor: gradientStart,
                  background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
                }}
              >
                <Text className="text-white text-xl font-bold">
                  {user.ownerName
                    ? user.ownerName.charAt(0).toUpperCase()
                    : "U"}
                </Text>
              </View>
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
        <View className="bg-white px-6 py-1 mt-4 mx-4 rounded-xl border border-slate-200 shadow-xs">
          <View className="flex-row justify-around items-center">
            {/* Contacts */}
            <View className="items-center">
              <Text className="text-lg font-semibold text-slate-800">
                {contactsCount}
              </Text>
              <Text className="text-slate-500 text-sm">Contacts</Text>
            </View>
            {/* Right: Badge */}
            {getBadge(user.pastPosts.length) && (
              <TouchableOpacity
                onPress={() => navigation.navigate("BadgeExplanation")}
              >
                <Image
                  source={getBadge(user.pastPosts.length)}
                  className="w-28 h-28" // adjusted size for better balance
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            {/* Promotions + Badge */}
            <View className="flex-row items-center">
              {/* Left: Promotions count */}
              <View className="items-center mr-4">
                <Text className="text-lg font-semibold text-slate-800">
                  {user.pastPosts.length}
                </Text>
                <Text className="text-slate-500 text-sm">Promotions</Text>
              </View>
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
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
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
            <Text className="text-slate-800 mt-2 font-medium">
              Logging out...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
