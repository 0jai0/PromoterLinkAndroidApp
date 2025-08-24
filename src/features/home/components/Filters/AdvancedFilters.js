import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { platforms, audienceTypeOptions } from "../../constants";
import { Ionicons } from "@expo/vector-icons";

const AdvancedFilters = ({
  showMoreFilters,
  setShowMoreFilters,
  selectedPlatforms,
  setSelectedPlatforms,
  selectedAudienceTypes,
  setSelectedAudienceTypes,
  selectedLocations,
  setSelectedLocations,
  minFollowers,
  setMinFollowers,
  maxFollowers,
  setMaxFollowers
}) => {
  const [showPlatformsDropdown, setShowPlatformsDropdown] = useState(false);
  const [showAudienceTypesDropdown, setShowAudienceTypesDropdown] = useState(false);
  const [showLocationsDropdown, setShowLocationsDropdown] = useState(false);
  const [locations] = useState(["USA", "UK", "Canada", "Australia", "India"]);

  const handleCheckboxChange = (value, type) => {
    const updateState = (stateSetter, currentState) => {
      const updated = currentState.includes(value)
        ? currentState.filter(c => c !== value)
        : [...currentState, value];
      stateSetter(updated);
    };

    switch (type) {
      case "platform":
        updateState(setSelectedPlatforms, selectedPlatforms);
        break;
      case "audienceType":
        updateState(setSelectedAudienceTypes, selectedAudienceTypes);
        break;
      case "location":
        updateState(setSelectedLocations, selectedLocations);
        break;
      default:
        break;
    }
  };

  if (!showMoreFilters) return null;

  return (
    <View className="bg-white border border-slate-200 rounded-xl p-5 mb-4 shadow-xs">
      <Text className="text-lg text-slate-800 font-semibold mb-4">Advanced Filters</Text>
      
      <View className="space-y-4">
        {/* Platforms Dropdown */}
        <View className="relative">
          <TouchableOpacity
            className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex-row justify-between items-center"
            onPress={() => setShowPlatformsDropdown(!showPlatformsDropdown)}
          >
            <Text className="text-slate-700 font-medium">Platforms</Text>
            <Ionicons 
              name={showPlatformsDropdown ? "chevron-up" : "chevron-down"} 
              size={18} 
              color="#64748B" 
            />
          </TouchableOpacity>
          
          {showPlatformsDropdown && (
            <View className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg mt-1 z-10 max-h-40 shadow-md">
              <ScrollView>
                {platforms.map(platform => (
                  <TouchableOpacity
                    key={platform}
                    className="flex-row items-center p-3 border-b border-slate-100"
                    onPress={() => handleCheckboxChange(platform, 'platform')}
                  >
                    <View className={`w-5 h-5 border rounded mr-3 justify-center items-center ${
                      selectedPlatforms.includes(platform) 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-slate-300'
                    }`}>
                      {selectedPlatforms.includes(platform) && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>
                    <Text className="text-slate-800">{platform}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Audience Type Dropdown */}
        <View className="relative">
          <TouchableOpacity
            className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex-row justify-between items-center"
            onPress={() => setShowAudienceTypesDropdown(!showAudienceTypesDropdown)}
          >
            <Text className="text-slate-700 font-medium">Audience Type</Text>
            <Ionicons 
              name={showAudienceTypesDropdown ? "chevron-up" : "chevron-down"} 
              size={18} 
              color="#64748B" 
            />
          </TouchableOpacity>
          
          {showAudienceTypesDropdown && (
            <View className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg mt-1 z-10 max-h-40 shadow-md">
              <ScrollView>
                {audienceTypeOptions.map(type => (
                  <TouchableOpacity
                    key={type.value}
                    className="flex-row items-center p-3 border-b border-slate-100"
                    onPress={() => handleCheckboxChange(type.value, 'audienceType')}
                  >
                    <View className={`w-5 h-5 border rounded mr-3 justify-center items-center ${
                      selectedAudienceTypes.includes(type.value) 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-slate-300'
                    }`}>
                      {selectedAudienceTypes.includes(type.value) && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>
                    <Text className="text-slate-800">{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Audience Location Dropdown */}
        <View className="relative">
          <TouchableOpacity
            className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex-row justify-between items-center"
            onPress={() => setShowLocationsDropdown(!showLocationsDropdown)}
          >
            <Text className="text-slate-700 font-medium">Audience Location</Text>
            <Ionicons 
              name={showLocationsDropdown ? "chevron-up" : "chevron-down"} 
              size={18} 
              color="#64748B" 
            />
          </TouchableOpacity>
          
          {showLocationsDropdown && (
            <View className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg mt-1 z-10 max-h-40 shadow-md">
              <ScrollView>
                {locations.map(location => (
                  <TouchableOpacity
                    key={location}
                    className="flex-row items-center p-3 border-b border-slate-100"
                    onPress={() => handleCheckboxChange(location, 'location')}
                  >
                    <View className={`w-5 h-5 border rounded mr-3 justify-center items-center ${
                      selectedLocations.includes(location) 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-slate-300'
                    }`}>
                      {selectedLocations.includes(location) && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>
                    <Text className="text-slate-800">{location}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Followers Range */}
        <View>
          <Text className="text-slate-700 text-sm mb-2 font-medium">Followers Range</Text>
          <View className="flex-row items-center space-x-2">
            <TextInput
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-lg"
              placeholder="Min"
              placeholderTextColor="#94A3B8"
              value={minFollowers}
              onChangeText={setMinFollowers}
              keyboardType="numeric"
            />
            <Text className="text-slate-500">to</Text>
            <TextInput
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-lg"
              placeholder="Max"
              placeholderTextColor="#94A3B8"
              value={maxFollowers}
              onChangeText={setMaxFollowers}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Apply Button */}
        <TouchableOpacity
          className="bg-blue-600 py-3.5 rounded-xl items-center shadow-xs"
          onPress={() => setShowMoreFilters(false)}
        >
          <Text className="text-white font-semibold">Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdvancedFilters;