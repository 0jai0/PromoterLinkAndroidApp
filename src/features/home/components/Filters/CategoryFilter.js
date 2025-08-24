import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { adCategoryOptions } from "../../constants";
import { Ionicons } from "@expo/vector-icons";

const CategoryFilter = ({ selectedAdCategories, onCategoryChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCategoryToggle = (categoryValue) => {
    const newCategories = selectedAdCategories.includes(categoryValue)
      ? selectedAdCategories.filter(c => c !== categoryValue)
      : [...selectedAdCategories, categoryValue];
    
    onCategoryChange(newCategories);
  };

  const getSelectedLabels = () => {
    if (selectedAdCategories.length === 0) return "All Categories";
    if (selectedAdCategories.length === 1) {
      const category = adCategoryOptions.find(opt => opt.value === selectedAdCategories[0]);
      return category?.label || "1 selected";
    }
    return `${selectedAdCategories.length} categories selected`;
  };

  return (
    <View className="relative flex-1 mr-3">
      <TouchableOpacity
        className="px-4 py-3 bg-white rounded-xl flex-row items-center justify-between border border-slate-200 shadow-xs"
        onPress={() => setShowDropdown(!showDropdown)}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <Ionicons name="pricetag-outline" size={18} color="#64748B" />
          <Text className="text-slate-700 ml-2 text-sm font-medium">
            {getSelectedLabels()}
          </Text>
        </View>
        <Ionicons 
          name={showDropdown ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="#64748B" 
        />
      </TouchableOpacity>

      {showDropdown && (
        <View className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg z-10 max-h-60 shadow-lg">
          <ScrollView 
            className="max-h-52"
            showsVerticalScrollIndicator={false}
          >
            {adCategoryOptions.map((category) => (
              <TouchableOpacity
                key={category.value}
                className="flex-row items-center p-3 border-b border-slate-100 active:bg-slate-50"
                onPress={() => handleCategoryToggle(category.value)}
                activeOpacity={0.7}
              >
                <View className={`w-5 h-5 border-2 rounded mr-3 justify-center items-center ${
                  selectedAdCategories.includes(category.value) 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-slate-300'
                }`}>
                  {selectedAdCategories.includes(category.value) && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text className="text-slate-800 text-sm">{category.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default CategoryFilter;