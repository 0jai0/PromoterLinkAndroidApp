import React from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <View className="flex-row items-center bg-white rounded-xl px-4 border border-slate-200 shadow-xs">
      <Ionicons name="search" size={20} color="#64748B" />
      <TextInput
        className="flex-1 text-slate-800 py-3 ml-2 text-base"
        placeholder="Search influencers by name, category..."
        placeholderTextColor="#94A3B8"
        value={searchTerm}
        onChangeText={onSearch}
        clearButtonMode="while-editing"
      />
    </View>
  );
};

export default SearchBar;