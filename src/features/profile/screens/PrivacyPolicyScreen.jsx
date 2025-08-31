// src/features/settings/screens/PrivacyPolicyScreen.js
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <View className="flex-1 bg-white">
      {/* Header with back button */}
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        className="absolute top-12 left-6 z-10 p-2 rounded-full"
      >
        <Ionicons name="arrow-back" size={24} color="#4B5563" />
      </TouchableOpacity>

      <ScrollView
        className="flex-1 px-6 pt-16"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Privacy Policy
        </Text>

        <Text className="text-lg text-gray-600 mb-8 text-center">
          Welcome to Promoter Link! Your privacy is very important to us.
        </Text>

        <View className="bg-blue-50 p-5 rounded-xl mb-8 border border-blue-100">
          <Text className="text-blue-800 text-center">
            Last updated: August 2025
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            1. Information We Collect
          </Text>
          <Text className="text-gray-600 leading-6">
            • Personal details such as name, email, and contact number{"\n"}
            • Device information and usage data{"\n"}
            • Notification tokens for push notifications
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            2. How We Use Your Information
          </Text>
          <Text className="text-gray-600 leading-6">
            • To provide and improve our services{"\n"}
            • To send important updates, notifications, and promotional content{"\n"}
            • To ensure security and prevent fraudulent activity
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            3. Data Security
          </Text>
          <Text className="text-gray-600 leading-6">
            We use appropriate security measures to protect your personal
            information. However, no method of transmission over the Internet is
            100% secure.
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            4. Sharing of Information
          </Text>
          <Text className="text-gray-600 leading-6">
            We do not sell or rent your personal data to third parties. We may
            share limited data with trusted partners only to provide necessary
            services.
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            5. Your Rights
          </Text>
          <Text className="text-gray-600 leading-6">
            You may request access, correction, or deletion of your personal
            information at any time by contacting us.
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            6. Changes to This Policy
          </Text>
          <Text className="text-gray-600 leading-6">
            We may update this Privacy Policy from time to time. Updates will be
            posted in the app and become effective immediately.
          </Text>
        </View>

        <View className="mb-12">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            7. Contact Us
          </Text>
          <Text className="text-gray-600 leading-6">
            If you have any questions about this Privacy Policy, please contact us
            at:{" "}
            <Text className="text-blue-600">support@promoterlink.com</Text>
          </Text>
        </View>

        <View className="pb-8">
          <Text className="text-center text-gray-500 text-sm">
            © 2025 Promoter Link. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;