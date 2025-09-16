import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import API from "../../../api/config";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

// Instagram Verification Component
const InstagramVerification = ({ profile, setProfile, userId }) => {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [userExists, setUserExists] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Your other imports...

  const checkUserExists = async () => {
    try {
      const response = await API.get(
        `/api/pageowners/get-by-userid?userId=${userId}`
      );
      const userFound = response.data.success;
      setUserExists(userFound);
      setMessage(
        userFound
          ? "✅ User verified! Check your Instagram DMs - you'll receive a code within 5 hours."
          : "❌ User not found."
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Error checking user");
    }
  };

  const sendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await API.post(`/api/pageowners/store`, {
        userId,
        profileName: profile.profileName,
        profileUrl: profile.link,
      });
      setMessage(
        "✅ OTP sent successfully. Check your Instagram DMs - you'll receive an OTP shortly"
      );
      setOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await API.get(
        `/api/pageowners/get-by-userid?userId=${userId}`
      );

      if (!response.data.success || !response.data.otp) {
        setMessage("No OTP found for this user");
        return;
      }

      if (response.data.otp === otp) {
        await API.put(`/api/pageowners/send-status`, {
          userId,
          status: "verified",
        });

        setVerified(true);
        setMessage(
          "✅ Verification successful! Save and Submit to update your profile"
        );

        setProfile((prevProfile) => ({
          ...prevProfile,
          profileDetails: prevProfile.profileDetails.map((p) =>
            p.platform === "Instagram" && p.profileName === profile.profileName
              ? { ...p, verified: true }
              : p
          ),
        }));
        setModalVisible(false);
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUserExists();
  }, [userId]);

  return (
    <View className="w-full mb-6">
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
              }}
              className="w-6 h-6 mr-2"
            />
            <Text className="text-lg font-semibold text-gray-800">
              Instagram Verification
            </Text>
          </View>
          <Ionicons
            name={verified ? "checkmark-circle" : "information-circle"}
            size={24}
            color={verified ? "#10B981" : "#3B82F6"}
          />
        </View>
        <Text className="text-gray-600 mt-2">
          {verified
            ? `Verified: @${profile.profileName}`
            : "Verify your Instagram account"}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-gray-800 bg-opacity-60 justify-center items-center p-5">
          <View className="bg-white rounded-xl w-full max-w-md p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Instagram Verification
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#4b5563" />
              </TouchableOpacity>
            </View>

            {verified || profile.verified ? (
              <View className="items-center py-4">
                <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                <Text className="text-lg font-semibold text-green-600 mt-2">
                  ✅ Your Instagram is verified!
                </Text>
              </View>
            ) : (
              <ScrollView>
                <Text className="text-gray-600 mb-4">
                  <Text className="text-blue-500 font-bold">STEP 1</Text>:
                  Follow our Instagram profile with the same account (you can
                  unfollow after verification).
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      "https://www.instagram.com/promoterlink_official/?igsh=ejJpbHc0NTJ2endm"
                    )
                  }
                  className="bg-gradient-to-r from-[#405DE6] to-[#833AB4] p-3 rounded-lg mb-4 items-center"
                >
                  <Text className="text-white font-bold">
                    Follow @promoterlink_official
                  </Text>
                </TouchableOpacity>

                <Text className="text-gray-600 mb-4">
                  <Text className="text-blue-500 font-bold">STEP 2</Text>: Click
                  "Send OTP" to receive the verification code in your Instagram
                  DM.
                </Text>

                <Text className="text-gray-600 mb-4">
                  <Text className="text-blue-500 font-bold">STEP 3</Text>: Enter
                  the code to complete verification.
                </Text>

                <Text className="text-gray-600 mb-4">
                  Verify Instagram for your @{profile.profileName}
                </Text>

                {message ? (
                  <Text
                    className={`text-sm mb-4 ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}
                  >
                    {message}
                  </Text>
                ) : null}

                <View className="border border-gray-300 p-3 rounded-xl mb-4">
                  <View className="flex-row mb-3">
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          "https://www.instagram.com/promoterlink_official/?igsh=ejJpbHc0NTJ2endm"
                        )
                      }
                      className="flex-1 bg-black p-2 rounded mr-2 items-center"
                    >
                      <Text className="text-blue-400">Click to Redirect ➜</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={sendOtp}
                      disabled={otpSent || isLoading}
                      className={`flex-1 p-2 rounded items-center ${
                        otpSent || isLoading ? "bg-gray-400" : "bg-blue-500"
                      }`}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text className="text-white">
                          {userExists || otpSent ? "Resend OTP" : "Send OTP"}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row">
                    <TextInput
                      placeholder="Enter OTP"
                      value={otp}
                      onChangeText={setOtp}
                      className="flex-1 border border-gray-300 p-2 rounded mr-2"
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      onPress={verifyOtp}
                      disabled={isLoading}
                      className={`p-2 rounded items-center justify-center ${
                        verified ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: 100 }}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text className="text-white">
                          {verified ? "Verified" : "Verify"}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-blue-500 rounded-lg p-3 items-center mt-4"
            >
              <Text className="text-white font-semibold">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// YouTube Verification Component
const YouTubeVerification = ({ profile, setProfile }) => {
  const [verified, setVerified] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Expo Google Auth (instead of GoogleSignin)
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "446936445912-fogcabgjh9t9ar2e3qap1le4qjudnocp.apps.googleusercontent.com",
    iosClientId:
      "446936445912-fogcabgjh9t9ar2e3qap1le4qjudnocp.apps.googleusercontent.com",
    androidClientId:
      "446936445912-fogcabgjh9t9ar2e3qap1le4qjudnocp.apps.googleusercontent.com",
    webClientId:
      "446936445912-fogcabgjh9t9ar2e3qap1le4qjudnocp.apps.googleusercontent.com",
    scopes: ["https://www.googleapis.com/auth/youtube.readonly"],
  });

  // Handle response
  React.useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.authentication;
      fetchYouTubeData(access_token);
    }
  }, [response]);

  const fetchYouTubeData = async (accessToken) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        "https://www.googleapis.com/youtube/v3/channels",
        {
          params: { part: "snippet,statistics", mine: true },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (res.data.items && res.data.items.length > 0) {
        const channel = res.data.items[0];
        const channelHandle =
          channel.snippet.customUrl || channel.snippet.title;

        if (channelHandle.includes(profile.profileName.replace(/^@/, ""))) {
          const subs = channel.statistics.subscriberCount;
          setSubscriberCount(subs);
          setVerified(true);
          setStatusMessage(
            `✅ Verified: ${profile.profileName} (${formatNumber(subs)} subscribers)`
          );

          setProfile((prev) => ({
            ...prev,
            profileDetails: prev.profileDetails.map((p) =>
              p.platform === "YouTube" && p.profileName === profile.profileName
                ? {
                    ...p,
                    verified: true,
                    followers: subs,
                    accessToken,
                  }
                : p
            ),
          }));
        } else {
          setStatusMessage(
            "❌ This Google account doesn't own the specified YouTube channel"
          );
        }
      } else {
        setStatusMessage("❌ No YouTube channel found for this Google account");
      }
    } catch (e) {
      console.error("YouTube API error:", e);
      setStatusMessage("❌ Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num) =>
    num ? new Intl.NumberFormat("en-US").format(num) : "0";

  return (
    <View className="w-full mb-6">
      {/* Card */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/f/fd/YouTube_full-color_icon_%282024%29.svg",
              }}
              className="w-6 h-6 mr-2"
            />
            <Text className="text-lg font-semibold text-gray-800">
              YouTube Verification
            </Text>
          </View>
          <Ionicons
            name={verified ? "checkmark-circle" : "information-circle"}
            size={24}
            color={verified ? "#10B981" : "#3B82F6"}
          />
        </View>
        <Text className="text-gray-600 mt-2">
          {verified
            ? `Verified: @${profile.profileName}`
            : "Verify your YouTube account"}
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-gray-800 bg-opacity-60 justify-center items-center p-5">
          <View className="bg-white rounded-xl w-full max-w-md p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                YouTube Verification
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#4b5563" />
              </TouchableOpacity>
            </View>

            {verified ? (
              <View className="items-center py-4">
                <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                <Text className="text-lg font-semibold text-green-600 mt-2">
                  ✅ Verified @{profile.profileName}
                </Text>
                {subscriberCount && (
                  <Text className="text-gray-600 mt-2">
                    Subscribers: {formatNumber(subscriberCount)}
                  </Text>
                )}
              </View>
            ) : (
              <View>
                <Text className="text-gray-600 mb-4">
                  Sign in with Google to verify your YouTube channel ownership.
                </Text>

                {statusMessage ? (
                  <Text
                    className={`text-sm mb-4 ${
                      statusMessage.includes("✅")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {statusMessage}
                  </Text>
                ) : null}

                <TouchableOpacity
                  onPress={() => promptAsync()}
                  disabled={!request || isLoading}
                  className={`p-3 rounded-lg items-center mb-4 ${
                    !request || isLoading ? "bg-gray-400" : "bg-red-600"
                  }`}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold">
                      Sign in with Google
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};


// Main Verification Component
const Verification = ({ profileDetails = [], setProfile, userId }) => {
  return (
    <View className="w-full bg-white p-5 rounded-lg border border-gray-200">
      <Text className="text-xl font-bold text-gray-800 mb-4">Verification</Text>

      {profileDetails.length === 0 ? (
        <Text className="text-gray-600">
          No social media accounts to verify.
        </Text>
      ) : (
        profileDetails.map((profile, index) => {
          switch (profile.platform) {
            case "YouTube":
              return (
                <YouTubeVerification
                  key={index}
                  profile={profile}
                  setProfile={setProfile}
                />
              );
            case "Instagram":
              return (
                <InstagramVerification
                  key={index}
                  profile={profile}
                  setProfile={setProfile}
                  userId={userId}
                />
              );
            default:
              return null;
          }
        })
      )}
    </View>
  );
};

export default Verification;
