import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { logo } from "../../../../utils/images";
import { Ionicons } from "@expo/vector-icons";

const Header = ({ user, navigation }) => {
  return (
    <View className="mb-5 pt-2">
      <View className="flex-row justify-between items-center">
        {/* Logo and app name on the left */}
        <View className="flex-row items-center">
          <View className="w-9 h-9 rounded-xl bg-gray-300 items-center justify-center shadow-xs">
            <Image source={logo} className="w-7 h-7" resizeMode="contain" />
          </View>
          <Text className="text-2xl font-bold text-slate-800 ml-3">
            PromoterLink
          </Text>
        </View>

        {/* Messenger icon on the right */}
        <TouchableOpacity
          className="relative"
          onPress={() => navigation.navigate("Messaging")} // ✅ works now
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
    </View>
  );
};

export default Header;
