import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API from "../../../api/config";
import { logo } from "../../../utils/images";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      await API.post("/api/otp/send-otpFP", { 
        userId: email.toLowerCase() 
      });

      setStep(2);
      setSuccess("OTP sent to your email address");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 404) {
        setError("No user found with this email address");
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await API.get("/api/otp/userId", {
        params: {
          userId: email.toLowerCase(),
        },
      });
      
      if (otp === response.data.otpDetails.otp) {
        setStep(3);
        setSuccess("OTP verified successfully");
      } else {
        setError("Invalid OTP. Please try again.");
      }
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("OTP verification failed. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      await API.post("/api/pageowners/forget-password", {
        email: email.toLowerCase(),
        newPassword
      });

      setSuccess("Password has been reset successfully!");
      
      // Show success alert and navigate to login
      Alert.alert(
        "Success", 
        "Password has been reset successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login")
          }
        ]
      );
    } catch (err) {
      setLoading(false);
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-8 bg-white">
          {/* Header with back button */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="absolute top-12 left-6 z-10 p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={24} color="#4B5563" />
          </TouchableOpacity>

          {/* Header with Logo */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 rounded-full items-center justify-center mb-4">
              <Image source={logo} className="w-20 h-20" resizeMode="contain" tintColor="black" />
            </View>
            <Text className="text-3xl font-bold text-gray-800">
              Reset Password
            </Text>
            <Text className="text-lg text-gray-500 mt-2">
              {step === 1 ? "Enter your email to get started" : 
               step === 2 ? "Enter the OTP sent to your email" : 
               "Create your new password"}
            </Text>
          </View>

          {/* Progress Indicators */}
          <View className="flex-row justify-center mb-8">
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                className={`h-2 w-8 rounded-full mx-1 ${i <= step ? "bg-blue-600" : "bg-gray-300"}`}
              />
            ))}
          </View>

          {/* Success Message */}
          {success ? (
            <View className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
              <Text className="text-green-700 text-center">{success}</Text>
            </View>
          ) : null}

          {/* Error Message */}
          {error ? (
            <View className="bg-red-50 p-4 rounded-lg mb-6 border border-red-200">
              <Text className="text-red-700 text-center">{error}</Text>
            </View>
          ) : null}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email
              </Text>
              <TextInput
                className="border border-gray-200 rounded-xl px-5 py-4 bg-gray-50 focus:border-blue-500"
                placeholder="Enter your email address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </Text>
              <TextInput
                className="border border-gray-200 rounded-xl px-5 py-4 bg-gray-50 focus:border-blue-500"
                placeholder="Enter OTP sent to your email"
                value={otp}
                onChangeText={setOtp}
                autoCapitalize="none"
                keyboardType="number-pad"
              />
            </View>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <View>
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  New Password
                </Text>
                <View className="relative">
                  <TextInput
                    className="border border-gray-200 rounded-xl px-5 py-4 bg-gray-50 focus:border-blue-500 pr-12"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-4"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text className="text-gray-500 font-medium">
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </Text>
                <View className="relative">
                  <TextInput
                    className="border border-gray-200 rounded-xl px-5 py-4 bg-gray-50 focus:border-blue-500 pr-12"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-4"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Text className="text-gray-500 font-medium">
                      {showConfirmPassword ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity
            className={`bg-blue-600 rounded-xl py-4 ${loading ? "opacity-80" : ""}`}
            onPress={
              step === 1 ? handleSendOtp : 
              step === 2 ? handleVerifyOtp : 
              handleResetPassword
            }
            disabled={loading || 
              (step === 1 && !email) || 
              (step === 2 && !otp) || 
              (step === 3 && (!newPassword || !confirmPassword))
            }
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                {step === 1 ? "Send OTP" : 
                 step === 2 ? "Verify OTP" : 
                 "Reset Password"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Back to Login Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-blue-600 font-medium">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}