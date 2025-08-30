import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Modal,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { audienceTypeOptions } from '../../home/constants';

const SearchableAudienceTypeSelector = ({ profile, setProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const toggleAudienceType = (type) => {
    const updatedTypes = profile.averageAudienceType.includes(type)
      ? profile.averageAudienceType.filter((t) => t !== type)
      : [...profile.averageAudienceType, type];

    setProfile({ ...profile, averageAudienceType: updatedTypes });
  };

  const filteredAudienceTypes = useMemo(() => {
    if (!searchQuery) return audienceTypeOptions;
    return audienceTypeOptions.filter(type => 
      type.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Show only first 5 audience types initially
  const initialAudienceTypes = audienceTypeOptions.slice(0, 5);
  const remainingCount = audienceTypeOptions.length - initialAudienceTypes.length;

  return (
    <View className="mb-6">
      {/* Initial audience types display */}
      <View className="flex-row flex-wrap mb-4">
        {initialAudienceTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            className={`px-3 py-2 mr-2 mb-2 rounded-full ${
              profile.averageAudienceType.includes(type.value)
                ? "bg-blue-500"
                : "bg-slate-200"
            }`}
            onPress={() => toggleAudienceType(type.value)}
          >
            <Text
              className={
                profile.averageAudienceType.includes(type.value)
                  ? "text-white font-medium"
                  : "text-slate-800"
              }
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* Show more button */}
        {remainingCount > 0 && (
          <TouchableOpacity
            className="px-4 py-2 mr-2 mb-2 rounded-full bg-slate-100 border border-slate-300"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-slate-700">+{remainingCount} more</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal for searching all audience types */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View className="flex-1 bg-gray-800 bg-opacity-60 justify-center items-center p-5">
            <View className="bg-white rounded-xl w-full max-w-md max-h-[80%] p-5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold">Select Audience Types</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#4b5563" />
                </TouchableOpacity>
              </View>

              {/* Search input */}
              <View className="flex-row items-center bg-slate-100 rounded-lg px-3 py-2 mb-4">
                <Ionicons name="search" size={20} color="#64748b" />
                <TextInput
                  className="flex-1 ml-2 text-slate-800"
                  placeholder="Search audience types..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#64748b" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Selected audience types count */}
              <Text className="text-sm text-gray-600 mb-3">
                {profile.averageAudienceType.length} audience types selected
              </Text>

              {/* Audience types list */}
              <ScrollView className="mb-4" showsVerticalScrollIndicator={true}>
                <View className="flex-row flex-wrap">
                  {filteredAudienceTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      className={`px-3 py-2 mr-2 mb-2 rounded-full ${
                        profile.averageAudienceType.includes(type.value)
                          ? "bg-blue-500"
                          : "bg-slate-200"
                      }`}
                      onPress={() => toggleAudienceType(type.value)}
                    >
                      <Text
                        className={
                          profile.averageAudienceType.includes(type.value)
                            ? "text-white font-medium"
                            : "text-slate-800"
                        }
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Done button */}
              <TouchableOpacity
                className="bg-blue-500 rounded-lg py-3 items-center"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white font-semibold">Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SearchableAudienceTypeSelector;