import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const PersonalDetailsStep = ({ profile, setProfile }) => {
  const [loading, setLoading] = useState(false);

  const uploadImageToCloudinary = async (uri) => {
    setLoading(true);
    const formData = new FormData();
    
    // Extract file name and type from URI
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('file', {
      uri,
      name: filename,
      type,
    });
    formData.append('upload_preset', 'influencerlink');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/djazdvcrn/image/upload',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Uploaded Image URL:', data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uploadedImageUrl = await uploadImageToCloudinary(result.assets[0].uri);
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePicUrl: uploadedImageUrl,
        }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera permissions to make this work!');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uploadedImageUrl = await uploadImageToCloudinary(result.assets[0].uri);
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePicUrl: uploadedImageUrl,
        }));
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  return (
    <View className="bg-white p-4 rounded-lg border border-slate-200">
      <Text className="text-lg font-semibold text-slate-800 mb-4">
        Personal Information
      </Text>

      {/* Profile Image Upload Section */}
      <View className="items-center mb-6">
        <View className="relative mb-3">
          <View className="w-32 h-32 rounded-full border-2 border-blue-500 overflow-hidden bg-blue-100">
            {loading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#3B82F6" />
              </View>
            ) : profile.profilePicUrl ? (
              <Image
                source={{ uri: profile.profilePicUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Ionicons name="person" size={48} color="#9CA3AF" />
              </View>
            )}
          </View>
          
          {!loading && (
            <TouchableOpacity
              onPress={pickImage}
              className="absolute -bottom-2 -right-2 bg-blue-500 w-10 h-10 rounded-full items-center justify-center border-2 border-white"
            >
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-slate-600 text-sm mb-2">
          {loading ? 'Uploading...' : 'Update Profile Picture'}
        </Text>

        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={pickImage}
            disabled={loading}
            className={`px-4 py-2 rounded-lg flex-row items-center ${
              loading ? 'bg-gray-400' : 'bg-slate-800'
            }`}
          >
            <Ionicons name="image" size={16} color="white" />
            <Text className="text-white ml-2 text-sm">Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={takePhoto}
            disabled={loading}
            className={`px-4 py-2 rounded-lg flex-row items-center ${
              loading ? 'bg-gray-400' : 'bg-blue-600'
            }`}
          >
            <Ionicons name="camera" size={16} color="white" />
            <Text className="text-white ml-2 text-sm">Camera</Text>
          </TouchableOpacity>
        </View>
      </View>

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