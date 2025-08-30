import React from 'react';
import { View, Text, TextInput } from 'react-native';

const PersonalDetailsStep = ({ profile, setProfile }) => {
  return (
    <View className="bg-white p-4 rounded-lg border border-slate-200">
      <Text className="text-lg font-semibold text-slate-800 mb-4">
        Personal Information
      </Text>

      <View className="mb-4">
        <Text className="text-slate-600 mb-1">Full Name</Text>
        <TextInput
          className="border border-slate-300 rounded-lg px-4 py-3"
          value={profile.ownerName}
          onChangeText={(text) => setProfile({ ...profile, ownerName: text })}
          placeholder="Enter your name"
        />
      </View>

      <View className="mb-4">
        <Text className="text-slate-600 mb-1">Email</Text>
        <TextInput
          className="border border-slate-300 rounded-lg px-4 py-3 bg-slate-100"
          value={profile.email}
          editable={false}
          placeholder="Your email address"
        />
      </View>

      <View className="mb-4">
        <Text className="text-slate-600 mb-1">Mobile Number</Text>
        <TextInput
          className="border border-slate-300 rounded-lg px-4 py-3"
          value={profile.mobile}
          onChangeText={(text) => setProfile({ ...profile, mobile: text })}
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
        />
      </View>

      <View className="mb-4">
        <Text className="text-slate-600 mb-1">WhatsApp Number</Text>
        <TextInput
          className="border border-slate-300 rounded-lg px-4 py-3"
          value={profile.whatsapp}
          onChangeText={(text) => setProfile({ ...profile, whatsapp: text })}
          placeholder="Enter your WhatsApp number"
          keyboardType="phone-pad"
        />
      </View>

      <View className="mb-4">
        <Text className="text-slate-600 mb-1">Bio</Text>
        <TextInput
          className="border border-slate-300 rounded-lg px-4 py-3 h-24"
          value={profile.bio}
          onChangeText={(text) => setProfile({ ...profile, bio: text })}
          placeholder="Tell us about yourself"
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};

export default PersonalDetailsStep;