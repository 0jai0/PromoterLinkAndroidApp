import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { isFormatted, formatFollowers } from "../../utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import {
  badges_01,
  badges_02,
  badges_03,
  badges_04,
  badges_05,
  badges_06,
  badges_07,
  badges_08,
} from "../../../../utils/images";

const UserCard = ({ user, contacts, onSelect, navigation, onAddToList, onChatNow }) => {
  const isAlreadyInContacts = contacts.some(
    (contact) => contact.user?._id === user._id
  );
  const instagramProfile = user.profileDetails?.find(
    (profile) => profile.platform.toLowerCase() === "instagram"
  );

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

  // Generate a colorful gradient based on user name
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
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const [gradientStart, gradientEnd] = getAvatarGradient(user.ownerName || "User");

  return (
    <TouchableOpacity
      className="bg-white border border-slate-100 rounded-2xl p-5 mb-4 shadow-sm"
      onPress={() => onSelect(user)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        {/* User Info */}
        <View className="flex-row items-center flex-1">
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
                background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`
              }}
            >
              <Text className="text-white text-xl font-bold">
                {user.ownerName ? user.ownerName.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>
          )}

          <View className="ml-4 flex-1">
            <Text
              className="text-slate-800 font-bold text-lg"
              numberOfLines={1}
            >
              {user.ownerName}
            </Text>

            {instagramProfile?.followers && (
              <View className="flex-row items-center mt-1">
                <Ionicons name="people" size={14} color="#64748B" />
                <Text className="text-slate-600 ml-1 text-sm">
                  {isFormatted(instagramProfile.followers)
                    ? instagramProfile.followers
                    : formatFollowers(instagramProfile.followers)}{" "}
                  Followers
                </Text>
              </View>
            )}
            
            {user.pastPosts?.length > 0 && (
              <View className="flex-row items-center mt-1">
                <Ionicons name="stats-chart" size={14} color="#64748B" />
                <Text className="text-slate-600 ml-1 text-sm">
                  {user.pastPosts.length} Posts
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Badge */}
        {getBadge(user.pastPosts?.length) && (
          <TouchableOpacity 
            onPress={() => navigation.navigate('BadgeExplanation')}
            className="ml-3"
          >
            <Image
              source={getBadge(user.pastPosts.length)}
              className="w-16 h-16"
              resizeMode="contain" 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between mt-4 space-x-3">
        <TouchableOpacity
          className={`flex-1 px-4 py-3 rounded-xl flex-row mr-5 items-center justify-center ${
            isAlreadyInContacts 
              ? "bg-green-100 border border-green-200" 
              : "bg-slate-100 border border-slate-200"
          }`}
          onPress={() => onAddToList(user)}
        >
          <Ionicons
            name={isAlreadyInContacts ? "checkmark-circle" : "add-circle-outline"}
            size={18}
            color={isAlreadyInContacts ? "#10B981" : "#64748B"}
          />
          <Text
            className={`ml-2 text-sm font-semibold ${
              isAlreadyInContacts ? "text-green-700" : "text-slate-700"
            }`}
          >
            {isAlreadyInContacts ? "Added" : "Add to List"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 px-4 py-3 bg-blue-500 rounded-xl flex-row items-center justify-center shadow-xs"
          onPress={() => onChatNow(user)}
        >
          <Ionicons name="chatbubble-ellipses" size={18} color="white" />
          <Text className="text-white ml-2 text-sm font-semibold">Chat Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;