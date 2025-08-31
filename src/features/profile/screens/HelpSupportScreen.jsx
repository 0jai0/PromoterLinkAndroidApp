// src/features/settings/screens/HelpSupportScreen.js
import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HelpSupportScreen = ({ navigation }) => {
  const openEmail = () => {
    Linking.openURL("mailto:support@promoterlink.com");
  };

  const openWhatsApp = () => {
    Linking.openURL("https://wa.me/9381784160"); // replace with your WhatsApp support number
  };

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
        <Text className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Help & Support
        </Text>
        
        <Text className="text-lg text-gray-600 mb-8 text-center">
          We're here to help you with any issues or questions
        </Text>

        {/* FAQ Section */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Frequently Asked Questions
          </Text>
          
          <View className="bg-gray-50 p-5 rounded-xl mb-5 border border-gray-200">
            <Text className="text-lg font-medium text-gray-800 mb-2">
              Q: How do I reset my password?
            </Text>
            <Text className="text-gray-600">
              You can reset your password from the login screen by clicking on "Forgot Password".
            </Text>
          </View>
          
          <View className="bg-gray-50 p-5 rounded-xl mb-5 border border-gray-200">
            <Text className="text-lg font-medium text-gray-800 mb-2">
              Q: Why am I not receiving notifications?
            </Text>
            <Text className="text-gray-600">
              Please ensure notifications are enabled in your device settings and that you are connected to the internet.
            </Text>
          </View>
          
          <View className="bg-gray-50 p-5 rounded-xl mb-5 border border-gray-200">
            <Text className="text-lg font-medium text-gray-800 mb-2">
              Q: How can I update my profile?
            </Text>
            <Text className="text-gray-600">
              Go to the Profile section in the app, tap "Edit Profile", and update your details.
            </Text>
          </View>
        </View>

        {/* Contact Section */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Contact Us
          </Text>
          
          <Text className="text-gray-600 mb-6">
            Can't find what you're looking for? Reach out to our support team directly.
          </Text>
          
          <TouchableOpacity 
            className="flex-row items-center bg-blue-600 p-5 rounded-xl mb-4"
            onPress={openEmail}
          >
            <Ionicons name="mail-outline" size={22} color="#fff" />
            <Text className="text-white text-lg font-semibold ml-3">
              Email Support
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center bg-green-600 p-5 rounded-xl mb-4"
            onPress={openWhatsApp}
          >
            <Ionicons name="logo-whatsapp" size={22} color="#fff" />
            <Text className="text-white text-lg font-semibold ml-3">
              WhatsApp Support
            </Text>
          </TouchableOpacity>
        </View>

        {/* Response Time */}
        <View className="bg-blue-50 p-5 rounded-xl mb-8 border border-blue-100">
          <Text className="text-blue-800 text-center">
            We aim to respond to all inquiries within 24 hours
          </Text>
        </View>

        {/* Additional Help */}
        <View className="mb-12">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Additional Resources
          </Text>
          
          <View className="bg-gray-50 p-5 rounded-xl mb-4 border border-gray-200">
            <Text className="text-lg font-medium text-gray-800 mb-2">
              User Guides
            </Text>
            <Text className="text-gray-600">
              Check out our comprehensive user guides for detailed instructions on all features.
            </Text>
          </View>
          
          <View className="bg-gray-50 p-5 rounded-xl mb-4 border border-gray-200">
            <Text className="text-lg font-medium text-gray-800 mb-2">
              Video Tutorials
            </Text>
            <Text className="text-gray-600">
              Watch step-by-step video tutorials on our YouTube channel.
            </Text>
          </View>
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

export default HelpSupportScreen;