import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { isFormatted, formatFollowers } from "../../utils/formatters";
import { Ionicons } from "@expo/vector-icons";

const UserCard = ({ user, contacts, onSelect, onAddToList, onChatNow }) => {
  const isAlreadyInContacts = contacts.some(contact => contact.user?._id === user._id);
  const instagramProfile = user.profileDetails?.find(profile => 
    profile.platform.toLowerCase() === "instagram"
  );

  return (
    <TouchableOpacity
      className="bg-white border border-slate-200 rounded-xl p-4 mb-3 shadow-xs"
      onPress={() => onSelect(user)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <Image
          source={{
            uri: user.profilePicUrl || 
                 `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(user.ownerName)}&radius=50&backgroundColor=1a1a1a`
          }}
          className="w-14 h-14 rounded-full border-2 border-blue-100"
        />
        
        <View className="ml-4 flex-1">
          <Text className="text-slate-800 font-semibold text-base" numberOfLines={1}>
            {user.ownerName}
          </Text>
          
          {instagramProfile?.followers && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="people" size={14} color="#64748B" />
              <Text className="text-slate-600 ml-1 text-sm">
                {isFormatted(instagramProfile.followers) 
                  ? instagramProfile.followers 
                  : formatFollowers(instagramProfile.followers)
                } Followers
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          className={`px-4 py-2.5 rounded-lg flex-row items-center ${
            isAlreadyInContacts 
              ? "bg-blue-100" 
              : "bg-slate-100"
          }`}
          onPress={() => onAddToList(user)}
        >
          <Ionicons 
            name={isAlreadyInContacts ? "checkmark-circle" : "add-circle"} 
            size={16} 
            color={isAlreadyInContacts ? "#3B82F6" : "#64748B"} 
          />
          <Text className={`ml-2 text-sm font-medium ${
            isAlreadyInContacts ? "text-blue-700" : "text-slate-700"
          }`}>
            {isAlreadyInContacts ? "In List" : "Add to List"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="px-4 py-2.5 bg-blue-600 rounded-lg flex-row items-center shadow-xs"
          onPress={() => onChatNow(user)}
        >
          <Ionicons name="chatbubble-ellipses" size={16} color="white" />
          <Text className="text-white ml-2 text-sm font-medium">Chat Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;