import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import SearchableCategorySelector from './SearchableCategorySelector';
import SearchableAudienceTypeSelector from './SearchableAudienceTypeSelector';

const AudiencePricingStep = ({ profile, setProfile }) => {
  return (
    <View className="bg-white p-4 rounded-lg border border-slate-200">
      <Text className="text-lg font-semibold text-slate-800 mb-4">
        Audience & Pricing
      </Text>

      <View className="mb-6">
        <Text className="text-slate-800 font-medium mb-3">
          Ad Categories You Work With
        </Text>
        <SearchableCategorySelector profile={profile} setProfile={setProfile} />
      </View>

      <View className="mb-6">
        <Text className="text-slate-800 font-medium mb-3">
          Your Audience Type
        </Text>
        <SearchableAudienceTypeSelector profile={profile} setProfile={setProfile} />
      </View>

      <View className="mb-6">
        <Text className="text-slate-800 font-medium mb-3">Pricing (₹)</Text>

        <View className="mb-3">
          <Text className="text-slate-600 mb-1">Story Post</Text>
          <TextInput
            className="border border-slate-300 rounded-lg px-3 py-2"
            value={profile.pricing.storyPost}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                pricing: { ...profile.pricing, storyPost: text },
              })
            }
            placeholder="Price for story post"
            keyboardType="numeric"
          />
        </View>

        <View className="mb-3">
          <Text className="text-slate-600 mb-1">Feed Post</Text>
          <TextInput
            className="border border-slate-300 rounded-lg px-3 py-2"
            value={profile.pricing.feedPost}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                pricing: { ...profile.pricing, feedPost: text },
              })
            }
            placeholder="Price for feed post"
            keyboardType="numeric"
          />
        </View>

        <View className="mb-3">
          <Text className="text-slate-600 mb-1">Reel</Text>
          <TextInput
            className="border border-slate-300 rounded-lg px-3 py-2"
            value={profile.pricing.reel}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                pricing: { ...profile.pricing, reel: text },
              })
            }
            placeholder="Price for reel"
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
};

export default AudiencePricingStep;