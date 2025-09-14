import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { logov1 } from "../../../../utils/images";
import { Ionicons } from "@expo/vector-icons";

const Header = ({ user, navigation }) => {
  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user) return 0;
    
    let completedFields = 0;
    const totalFields = 18; // Total fields we're checking
    
    // Basic info fields
    if (user.ownerName) completedFields++;
    if (user.profilePicUrl) completedFields++;
    if (user.mobile) completedFields++;
    if (user.whatsapp) completedFields++;
    if (user.role) completedFields++;
    
    // Social media platforms
    if (user.socialMediaPlatforms && user.socialMediaPlatforms.length > 0) completedFields++;
    
    // Profile details (count as 5 fields)
    if (user.profileDetails && user.profileDetails.length > 0) {
      // Check if at least one profile detail is filled
      const hasProfileDetails = user.profileDetails.some(profile => 
        profile.platform || profile.profileName || profile.followers > 0
      );
      if (hasProfileDetails) completedFields += 5;
    }
    
    // Categories and audience info
    if (user.adCategories && user.adCategories.length > 0) completedFields++;
    if (user.pageContentCategory && user.pageContentCategory.length > 0) completedFields++;
    if (user.averageAudienceType && user.averageAudienceType.length > 0) completedFields++;
    if (user.averageLocationOfAudience && user.averageLocationOfAudience.length > 0) completedFields++;
    
    // Pricing info (count as 3 fields)
    if (user.pricing) {
      if (user.pricing.storyPost) completedFields++;
      if (user.pricing.feedPost) completedFields++;
      if (user.pricing.reel) completedFields++;
    }
    
    // Past posts
    if (user.pastPosts && user.pastPosts.length > 0) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const completionPercentage = calculateProfileCompletion();

  // Navigate to UpdateProfile screen correctly
  const navigateToUpdateProfile = () => {
    // Since UpdateProfile is nested inside ProfileNavigator, we need to navigate to Profile first
    // then navigate to UpdateProfile within that navigator
    navigation.navigate("Profile", { 
      screen: "UpdateProfile" 
    });
  };

  return (
    <View className="mb-5 pt-2">
      <View className="flex-row justify-between items-center">
        {/* Logo and app name on the left */}
        <View className="flex-row items-center">
          <View className="w-9 h-9 pl-24 rounded-xl items-center justify-center shadow-xs">
            <Image source={logov1} className="w-52 h-52" resizeMode="contain" />
          </View>

        </View>

        {/* Messenger icon on the right */}
        <TouchableOpacity
          className="relative"
          onPress={() => navigation.navigate("Messaging")}
        >
          <View className="w-10 h-10 bg-slate-100 rounded-lg items-center justify-center border border-slate-200">
            <Ionicons name="chatbubble-ellipses" size={22} color="#3B82F6" />
          </View>
          {/* Notification badge */}
          <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center border border-white">
            <Text className="text-white text-xs font-bold">3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Welcome message below logo and app name */}
      <View className="flex-row items-center mt-2 ml-12">
        <Ionicons name="hand-left" size={16} color="#64748B" />
        <Text className="text-slate-600 text-sm ml-2">
          Welcome back,{" "}
          <Text className="text-slate-800 font-medium">
            {user?.ownerName || user?.email}
          </Text>
        </Text>
      </View>

      {/* Profile completion indicator */}
      {completionPercentage < 100 && (
        <View className="mt-3 ml-12">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-slate-600 text-xs font-medium">
              Profile Completion
            </Text>
            <Text className="text-slate-600 text-xs font-medium">
              {completionPercentage}%
            </Text>
          </View>
          <View className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <View 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            />
          </View>
          <TouchableOpacity 
            onPress={navigateToUpdateProfile}
            className="mt-1"
          >
            <Text className="text-blue-500 text-xs font-medium">
              Complete your profile →
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Header;