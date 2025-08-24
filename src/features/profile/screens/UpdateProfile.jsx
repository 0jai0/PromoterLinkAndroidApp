import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { updateUser } from "../../auth/authSlice";
import PersonalDetailsStep from "../components/PersonalDetailsStep";
import SocialMediaStep from "../components/SocialMediaStep";
import AudiencePricingStep from "../components/AudiencePricingStep";
import Verification from "../components/Verification";
import PastPostsScreen from "../components/PastPostsScreen";

const UpdateProfileScreen = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [profile, setProfile] = useState({
    ownerName: user?.ownerName || "",
    mobile: user?.mobile || "",
    email: user?.email || "",
    whatsapp: user?.whatsapp || "",
    bio: user?.bio || "",
    socialMediaPlatforms: user?.socialMediaPlatforms || [],
    profileDetails: user?.profileDetails || [],
    adCategories: user?.adCategories || [],
    pageContentCategory: user?.pageContentCategory || [],
    averageAudienceType: user?.averageAudienceType || [],
    averageLocationOfAudience: user?.averageLocationOfAudience || [],
    pricing: user?.pricing || { storyPost: "", feedPost: "", reel: "" },
    pastPosts: user?.pastPosts || [],
    profilePicUrl: user?.profilePicUrl || user?.profilePicture || "", // Changed to match backend
  });

  const handleSaveProfile = async () => {
  try {
    setSaving(true);
    
    // Prepare data for API - match backend field names
    const apiData = {
      ownerName: profile.ownerName,
      mobile: profile.mobile,
      whatsapp: profile.whatsapp,
      socialMediaPlatforms: profile.socialMediaPlatforms || [],
      profileDetails: profile.profileDetails || [],
      adCategories: profile.adCategories || [],
      pageContentCategory: profile.pageContentCategory || [],
      averageAudienceType: profile.averageAudienceType || [],
      averageLocationOfAudience: profile.averageLocationOfAudience || [],
      pricing: {
        storyPost: profile.pricing?.storyPost || "",
        feedPost: profile.pricing?.feedPost || "",
        reel: profile.pricing?.reel || "",
      },
      pastPosts: profile.pastPosts || [],
      profilePicUrl: profile.profilePicUrl || "",
    };
    
    // Use the updateUser thunk
    const result = await dispatch(updateUser({
      userId: user._id, 
      updateData: apiData
    })).unwrap();
    
    const responseData = result.response || result;
    if (responseData.success) {
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } else {
      Alert.alert("Error", responseData.message || "Failed to update profile");
    }
  } catch (error) {
    console.error("Update error details:", error);
    console.error("Error response:", error.response?.data);
    Alert.alert("Error", error.message || "An error occurred while updating your profile");
  } finally {
    setSaving(false);
  }
};

  const steps = [
    {
      title: "Personal Details",
      component: (
        <PersonalDetailsStep profile={profile} setProfile={setProfile} />
      ),
    },
    {
      title: "Social Media",
      component: <SocialMediaStep profile={profile} setProfile={setProfile} />,
    },
    {
      title: "Audience & Pricing",
      component: (
        <AudiencePricingStep profile={profile} setProfile={setProfile} />
      ),
    },
    {
      title: "Verification",
      component: <Verification profileDetails={profile.profileDetails} setProfile={setProfile} userId={user._id} />,
    },
    {
      title: "PastPosts",
      component: <PastPostsScreen profile={profile} setProfile={setProfile} />,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 flex-row items-center border-b border-slate-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Update Profile</Text>
      </View>

      {/* Progress Steps */}
      <View className="bg-white px-4 py-4 mt-2 mx-4 rounded-lg border border-slate-200">
        <View className="flex-row justify-between items-center mb-4">
          {steps.map((step, index) => (
            <View key={index} className="items-center flex-1">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  currentStep >= index ? "bg-blue-500" : "bg-slate-200"
                }`}
              >
                <Text
                  className={`font-bold ${
                    currentStep >= index ? "text-white" : "text-slate-500"
                  }`}
                >
                  {index + 1}
                </Text>
              </View>
              <Text
                className={`text-xs mt-1 ${
                  currentStep === index
                    ? "text-blue-500 font-medium"
                    : "text-slate-500"
                }`}
                numberOfLines={1}
              >
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Form Content */}
      <ScrollView className="flex-1 px-4 mt-4">
        {steps[currentStep].component}
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="bg-white px-4 py-4 border-t border-slate-200">
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg ${
              currentStep === 0 ? "bg-slate-100" : "bg-slate-200"
            }`}
          >
            <Text
              className={`font-medium ${
                currentStep === 0 ? "text-slate-400" : "text-slate-700"
              }`}
            >
              Previous
            </Text>
          </TouchableOpacity>

          {currentStep < steps.length - 1 ? (
            <TouchableOpacity
              onPress={() =>
                setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
              }
              className="px-6 py-3 rounded-lg bg-blue-500"
            >
              <Text className="font-medium text-white">Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSaveProfile}
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-blue-500"
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="font-medium text-white">Save Profile</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UpdateProfileScreen;