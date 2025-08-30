import React, { useState, useEffect } from "react";
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
import useAuth from "../useAuth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import useAlert from "../../../hooks/useAlert";;
import { logo } from "../../../utils/images";
import { getGoogleAuthRequestConfig } from "../../../config/auth";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const { loginUser, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { showAlert, AlertComponent } = useAlert();
  // Use the config
  const [request, response, promptAsync] = Google.useAuthRequest(
    getGoogleAuthRequestConfig()
  );

  const handleLogin = () => {
    if (!email || !password) {
      showAlert({
        type: 'error',
        title: 'Missing Information',
        message: 'Please enter both email and password',
        position: 'top'
      });
      return;
    }
    loginUser({ email, password });
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await promptAsync();
      if (result.type !== "success") {
        setGoogleLoading(false);
        showAlert({
          type: 'warning',
          title: 'Authentication Cancelled',
          message: 'Google sign-in was cancelled',
          position: 'top'
        });
        return;
      }

      // Send the Google credential to your backend
      loginUser({
        credential: result.params.id_token,
        isGoogleAuth: true,
      });
      
    } catch (error) {
      console.error("Google login error:", error);
      showAlert({
        type: 'error',
        title: 'Google Login Failed',
        message: 'An error occurred during Google authentication',
        position: 'top'
      });
      setGoogleLoading(false);
    }
  };

  // Show error from useAuth if any
  useEffect(() => {
    if (error) {
      showAlert({
        type: 'error',
        title: 'Authentication Error',
        message: error,
        position: 'top'
      });
    }
  }, [error]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <AlertComponent />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-8 bg-white">
          {/* Header with Logo */}
          <View className="items-center mb-8">
            <View className="w-32 h-32 rounded-full items-center justify-center mb-4">
              <Image source={logo} className="w-28 h-28" resizeMode="contain" tintColor="black" />
            </View>
            <Text className="text-3xl font-bold text-gray-800">
              Welcome Back
            </Text>
            <Text className="text-lg text-gray-500 mt-2">
              Sign in to continue
            </Text>
          </View>

          {/* Form */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Email
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-5 py-4 bg-gray-50 focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Password
            </Text>
            <View className="relative">
              <TextInput
                className="border border-gray-200 rounded-xl px-5 py-4 bg-gray-50 focus:border-blue-500 pr-12"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
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

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            className="self-end mb-6"
          >
            <Text className="text-blue-600 font-medium">Forgot Password?</Text>
          </TouchableOpacity>

          {/* Error Message */}
          {error && (
            <View className="bg-red-50 p-3 rounded-lg mb-6 border border-red-200">
              <Text className="text-red-700 text-center">{error}</Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            className={`bg-blue-600 rounded-xl py-4 ${loading ? "opacity-80" : ""}`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-500">Or continue with</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Google Login Button */}
          <TouchableOpacity
            className="flex-row items-center justify-center border border-gray-200 rounded-xl py-4 mb-4"
            onPress={handleGoogleLogin}
            disabled={googleLoading || !request}
          >
            {googleLoading ? (
              <ActivityIndicator color="#DB4437" />
            ) : (
              <>
                <Text className="text-blue-500 font-bold text-lg mr-2">G</Text>
                <Text className="text-gray-700 font-medium">
                  Sign in with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text className="text-blue-600 font-medium">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );}
