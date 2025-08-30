import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Modal } from "react-native";
import { isFormatted, formatFollowers } from "../../utils/formatters";

const Profile = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <Modal visible={!!user} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-[#202020] rounded-lg p-6 w-11/12 max-h-4/5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-white text-2xl">×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView>
            <View className="items-center mb-6">
              <Image
                source={{ uri: user.profilePicUrl }}
                className="w-24 h-24 rounded-full border-2 border-[#1FFFE0]"
                defaultSource={require('./default-avatar.png')}
              />
              <Text className="text-white text-xl font-bold mt-2">
                {user.ownerName}
              </Text>
            </View>
            
            <View className="space-y-4">
              {user.profileDetails?.map((profile, index) => (
                <View key={index} className="border border-gray-700 rounded-lg p-3">
                  <Text className="text-[#1FFFE0] font-semibold">
                    {profile.platform}
                  </Text>
                  <Text className="text-white">
                    Followers: {isFormatted(profile.followers) 
                      ? profile.followers 
                      : formatFollowers(profile.followers)
                    }
                  </Text>
                  <Text className="text-gray-400">{profile.bio}</Text>
                </View>
              ))}
              
              {user.adCategories?.length > 0 && (
                <View>
                  <Text className="text-white font-semibold mb-2">Ad Categories:</Text>
                  <View className="flex-row flex-wrap">
                    {user.adCategories.map((category, index) => (
                      <Text key={index} className="text-[#1FFFE0] mr-2 mb-1">
                        #{category}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default Profile;