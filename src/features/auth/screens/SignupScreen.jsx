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
  Image,
  BackHandler
} from "react-native";
import { sendOtp, verifyOtp } from "../otp.api";
import useAuth from "../useAuth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import useAlert from "../../../hooks/useAlert";
import { logo } from "../../../utils/images";
import { getGoogleAuthRequestConfig } from "../../../config/auth";
import { jwtDecode } from "jwt-decode";

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen({ navigation }) {
  const { registerUser, loading: authLoading, error: authError, isAuthenticated } = useAuth();
  const { showAlert, AlertComponent } = useAlert();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpResent, setOtpResent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest(
    getGoogleAuthRequestConfig()
  );

  // Handle Google Signup
  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const result = await promptAsync();
      if (result.type !== "success") {
        setGoogleLoading(false);
        showAlert({
          type: 'warning',
          title: 'Authentication Cancelled',
          message: 'Google sign-up was cancelled',
          position: 'top'
        });
        return;
      }

      // Decode the Google token to get user info
      const decoded = jwtDecode(result.params.id_token);
      const { email, name: ownerName, sub } = decoded;

      // Prepare user data for registration
      const googleUserData = {
        ownerName: ownerName || "Google User",
        email: email,
        password: sub, // Using Google sub as password
        confirmPassword: sub,
        role: formData.role || "influencer", // Use selected role or default
        isGoogleAuth: true,
        googleId: sub
      };

      // Register user with Google data
      await registerUser(googleUserData);
      
    } catch (error) {
      console.error("Google signup error:", error);
      showAlert({
        type: 'error',
        title: 'Google Signup Failed',
        message: 'An error occurred during Google authentication',
        position: 'top'
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle role selection
  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setStep(2);
    setError("");
  };

  // Handle input changes
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  // Handle OTP input change
  const handleOtpChange = (value) => {
    setOtp(value);
    setError("");
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!formData.ownerName || !formData.email) {
      setError("Please enter both name and email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setOtpLoading(true);
    setError("");
    
    try {
      await sendOtp(formData.email);
      setStep(3);
      setOtpResent(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    setError("");
    
    try {
      const result = await verifyOtp(formData.email, otp);
      
      if (result.success) {
        setStep(4);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle final registration
  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    
    try {
      const registrationData = {
        ownerName: formData.ownerName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      await registerUser(registrationData);
      
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    }
  };

  // Redirect to login if registration is successful
  useEffect(() => {
    if (isAuthenticated) {
      Alert.alert(
        "Success", 
        "Account created successfully!",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    }
  }, [isAuthenticated, navigation]);

  // Show auth errors from Redux
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (step > 1) {
        setStep(step - 1);
        setError("");
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior (exit app)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [step]); // Re-run when step changes



  // Render role selection step
  const renderRoleStep = () => (
    <View className="items-center">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Join as a...</Text>
      
      <View className="w-full space-y-4">
        <TouchableOpacity
          onPress={() => handleRoleSelect("brand")}
          className="bg-blue-100 p-6 rounded-xl border-2 border-blue-200 items-center"
        >
          <Text className="text-blue-800 text-lg font-semibold">Brand</Text>
          <Text className="text-blue-600 mt-2 text-center">
            I want to collaborate with creators
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleRoleSelect("creator")}
          className="bg-green-100 p-6 rounded-xl border-2 border-green-200 items-center"
        >
          <Text className="text-green-800 text-lg font-semibold">Creator</Text>
          <Text className="text-green-600 mt-2 text-center">
            I create content and want to work with brands
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render name/email step
  const renderNameEmailStep = () => (
    <View className="w-full space-y-4">
      <Text className="text-xl font-bold text-gray-800 mb-2">
        {formData.role === "brand" ? "Brand Information" : "Creator Information"}
      </Text>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2">
          {formData.role === "brand" ? "Brand Name" : "Full Name"}
        </Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-5 py-4 bg-white"
          placeholder={formData.role === "brand" ? "Enter your brand name" : "Enter your full name"}
          value={formData.ownerName}
          onChangeText={(value) => handleChange("ownerName", value)}
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-5 py-4 bg-white"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(value) => handleChange("email", value)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity
        onPress={handleSendOtp}
        disabled={otpLoading || !formData.email || !formData.ownerName}
        className={`bg-blue-600 rounded-xl py-4 mt-4 ${otpLoading ? "opacity-80" : ""}`}
      >
        {otpLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">Send OTP</Text>
        )}
      </TouchableOpacity>

      {/* Google Signup Option */}
      <View className="mt-4">
        <View className="flex-row items-center my-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500">Or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-center border border-gray-300 rounded-xl py-4"
          onPress={handleGoogleSignup}
          disabled={googleLoading || !request}
        >
          {googleLoading ? (
            <ActivityIndicator color="#DB4437" />
          ) : (
            <>
              <Image 
                source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }} 
                className="w-6 h-6 mr-2" 
              />
              <Text className="text-gray-700 font-medium">
                Sign up with Google
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render OTP verification step
  const renderOtpStep = () => (
    <View className="w-full space-y-4">
      <Text className="text-xl font-bold text-gray-800 mb-2">Verify Your Email</Text>
      <Text className="text-gray-600 mb-4">
        We've sent a 6-digit code to {formData.email}
      </Text>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2">Enter OTP</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-5 py-4 bg-white text-center text-lg"
          placeholder="000000"
          value={otp}
          onChangeText={handleOtpChange}
          keyboardType="numeric"
          maxLength={6}
        />
      </View>

      <TouchableOpacity
        onPress={handleVerifyOtp}
        disabled={otpLoading || !otp}
        className={`bg-blue-600 rounded-xl py-4 ${otpLoading ? "opacity-80" : ""}`}
      >
        {otpLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">Verify OTP</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleSendOtp}
        className="mt-2"
      >
        <Text className="text-blue-600 text-center">Resend OTP</Text>
      </TouchableOpacity>

      {/* Google Signup Option */}
      <View className="mt-6">
        <View className="flex-row items-center my-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500">Or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-center border border-gray-300 rounded-xl py-4"
          onPress={handleGoogleSignup}
          disabled={googleLoading || !request}
        >
          {googleLoading ? (
            <ActivityIndicator color="#DB4437" />
          ) : (
            <>
              <Image 
                source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }} 
                className="w-6 h-6 mr-2" 
              />
              <Text className="text-gray-700 font-medium">
                Sign up with Google
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render password step with actual registration
  const renderPasswordStep = () => (
    <View className="w-full space-y-4">
      <Text className="text-xl font-bold text-gray-800 mb-2">Create Password</Text>
      
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-5 py-4 bg-white"
          placeholder="Create a password (min. 6 characters)"
          value={formData.password}
          onChangeText={(value) => handleChange("password", value)}
          secureTextEntry
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-5 py-4 bg-white"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChangeText={(value) => handleChange("confirmPassword", value)}
          secureTextEntry
        />
      </View>

      {/* Password Error Message */}
      {error && (
        <View className="bg-red-50 p-3 rounded-lg border border-red-200">
          <Text className="text-red-700 text-center">{error}</Text>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleRegister}
        disabled={authLoading}
        className={`bg-blue-600 rounded-xl py-4 ${authLoading ? "opacity-80" : ""}`}
      >
        {authLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Complete Registration
          </Text>
        )}
      </TouchableOpacity>

      {/* Google Signup Option */}
      <View className="mt-4">
        <View className="flex-row items-center my-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500">Or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-center border border-gray-300 rounded-xl py-4"
          onPress={handleGoogleSignup}
          disabled={googleLoading || !request}
        >
          {googleLoading ? (
            <ActivityIndicator color="#DB4437" />
          ) : (
            <>
              <Image 
                source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }} 
                className="w-6 h-6 mr-2" 
              />
              <Text className="text-gray-700 font-medium">
                Sign up with Google
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <AlertComponent />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center">
          {/* Header with Logo */}
          <View className="items-center mb-8">
             <View className="w-32 h-32 rounded-full items-center justify-center mb-4">
                <Image source={logo} className="w-28 h-28" resizeMode="contain" tintColor="black" />
              </View>
            <Text className="text-3xl font-bold text-gray-800">Create Account</Text>
          </View>

          {/* Progress Indicator */}
          {/* <View className="flex-row justify-between mb-8">
            {[1, 2, 3, 4].map((stepNumber) => (
              <View key={stepNumber} className="items-center flex-1">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    step >= stepNumber
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      step >= stepNumber ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {stepNumber}
                  </Text>
                </View>
                <Text
                  className={`text-xs mt-1 ${
                    step >= stepNumber ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {stepNumber === 1 ? "Role" : stepNumber === 2 ? "Details" : stepNumber === 3 ? "OTP" : "Password"}
                </Text>
              </View>
            ))}
          </View> */}

          {/* Error Message */}
          {error ? (
            <View className="bg-red-50 p-3 rounded-lg mb-6 border border-red-200">
              <Text className="text-red-700 text-center">{error}</Text>
            </View>
          ) : null}

          {/* Form Steps */}
          {step === 1 && renderRoleStep()}
          {step === 2 && renderNameEmailStep()}
          {step === 3 && renderOtpStep()}
          {step === 4 && renderPasswordStep()}

          {/* Back Button (show except on first step) */}
          {step > 1 && (
            <TouchableOpacity
              onPress={() => {
                setStep(step - 1);
                setError("");
              }}
              className="mt-6 self-center"
            >
              <Text className="text-blue-600 font-medium">Go Back</Text>
            </TouchableOpacity>
          )}

          {/* Login Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-blue-600 font-medium">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}