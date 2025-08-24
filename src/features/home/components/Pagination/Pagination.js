import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Pagination = ({ page, totalPages, user, isAuthenticated, onPageChange, navigation }) => {
  const coinLimitedPages = Math.max(1, 10000);
  const actualMaxPages = Math.min(totalPages, coinLimitedPages);

  return (
    <View className="flex-row justify-center items-center my-6">
      <TouchableOpacity
        className="px-4 py-3 bg-white border border-slate-200 rounded-xl mr-2 flex-row items-center shadow-xs"
        onPress={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        <Ionicons 
          name="chevron-back" 
          size={18} 
          color={page === 1 ? "#94A3B8" : "#64748B"} 
        />
        <Text className={page === 1 ? "text-slate-400 ml-1 text-sm font-medium" : "text-slate-700 ml-1 text-sm font-medium"}>
          Previous
        </Text>
      </TouchableOpacity>
      
      <View className="bg-slate-100 px-4 py-2 rounded-lg mx-3">
        <Text className="text-slate-600 text-sm font-medium">
          Page {page} of {isAuthenticated && user ? actualMaxPages : 1}
        </Text>
      </View>
      
      <TouchableOpacity
        className="px-4 py-3 bg-white border border-slate-200 rounded-xl ml-2 flex-row items-center shadow-xs"
        onPress={() => {
          if (!isAuthenticated || !user) {
            navigation.navigate('Login');
            return;
          }
          if (page < actualMaxPages) {
            onPageChange(page + 1);
          }
        }}
        disabled={!isAuthenticated || !user || page >= actualMaxPages}
      >
        <Text className={
          !isAuthenticated || !user || page >= actualMaxPages 
            ? "text-slate-400 mr-1 text-sm font-medium" 
            : "text-slate-700 mr-1 text-sm font-medium"
        }>
          Next
        </Text>
        <Ionicons 
          name="chevron-forward" 
          size={18} 
          color={!isAuthenticated || !user || page >= actualMaxPages ? "#94A3B8" : "#64748B"} 
        />
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;