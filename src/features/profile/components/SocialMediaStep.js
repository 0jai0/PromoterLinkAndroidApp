import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { platforms } from '../../home/constants';

const SocialMediaStep = ({ profile, setProfile }) => {
  const togglePlatform = (platform) => {
    const updatedPlatforms = profile.socialMediaPlatforms.includes(platform)
      ? profile.socialMediaPlatforms.filter((p) => p !== platform)
      : [...profile.socialMediaPlatforms, platform];

    setProfile({ ...profile, socialMediaPlatforms: updatedPlatforms });
  };

  return (
    <View className="bg-white p-4 rounded-lg border border-slate-200">
      <Text className="text-lg font-semibold text-slate-800 mb-4">
        Social Media Platforms
      </Text>

      <Text className="text-slate-600 mb-3">Select the platforms you use:</Text>

      {platforms.map((platform) => (
        <TouchableOpacity
          key={platform}
          className={`flex-row items-center p-3 mb-2 rounded-lg border ${
            profile.socialMediaPlatforms.includes(platform)
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300"
          }`}
          onPress={() => togglePlatform(platform)}
        >
          <View
            className={`w-6 h-6 rounded-md mr-3 items-center justify-center ${
              profile.socialMediaPlatforms.includes(platform)
                ? "bg-blue-500"
                : "bg-slate-200"
            }`}
          >
            {profile.socialMediaPlatforms.includes(platform) && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
          <Text className="text-slate-800">{platform}</Text>
        </TouchableOpacity>
      ))}

      {profile.socialMediaPlatforms.length > 0 && (
        <View className="mt-6">
          <Text className="text-lg font-semibold text-slate-800 mb-4">
            Profile Details
          </Text>

          {profile.socialMediaPlatforms.map((platform) => {
            const detail = profile.profileDetails.find(
              (d) => d.platform === platform
            ) || {
              platform,
              profileName: "",
              followers: "",
              profilePicUrl: "",
            };

            return (
              <View
                key={platform}
                className="mb-6 p-3 border border-slate-200 rounded-lg"
              >
                <Text className="font-medium text-slate-800 mb-3">
                  {platform} Profile
                </Text>

                <View className="mb-3">
                  <Text className="text-slate-600 mb-1">Profile Name</Text>
                  <TextInput
                    className="border border-slate-300 rounded-lg px-3 py-2"
                    value={detail.profileName || ""}
                    onChangeText={(text) => {
                      const updatedDetails = profile.profileDetails.filter(
                        (d) => d.platform !== platform
                      );
                      updatedDetails.push({ ...detail, profileName: text });
                      setProfile({
                        ...profile,
                        profileDetails: updatedDetails,
                      });
                    }}
                    placeholder={`Your ${platform} username`}
                  />
                </View>

                <View className="mb-3">
                  <Text className="text-slate-600 mb-1">Followers Count</Text>
                  <TextInput
                    className="border border-slate-300 rounded-lg px-3 py-2"
                    value={detail.followers ? detail.followers.toString() : ""}
                    onChangeText={(text) => {
                      const updatedDetails = profile.profileDetails.filter(
                        (d) => d.platform !== platform
                      );
                      updatedDetails.push({
                        ...detail,
                        followers: text.replace(/[^0-9]/g, ""),
                      });
                      setProfile({
                        ...profile,
                        profileDetails: updatedDetails,
                      });
                    }}
                    placeholder="Number of followers"
                    keyboardType="numeric"
                  />
                </View>

                <View className="mb-3">
                  <Text className="text-slate-600 mb-1">Profile Link</Text>
                  <TextInput
                    className="border border-slate-300 rounded-lg px-3 py-2"
                    value={detail.profilePicUrl || ""}
                    onChangeText={(text) => {
                      const updatedDetails = profile.profileDetails.filter(
                        (d) => d.platform !== platform
                      );
                      updatedDetails.push({ ...detail, profilePicUrl: text });
                      setProfile({
                        ...profile,
                        profileDetails: updatedDetails,
                      });
                    }}
                    placeholder={`https://${platform.toLowerCase()}.com/yourprofile`}
                  />
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default SocialMediaStep;