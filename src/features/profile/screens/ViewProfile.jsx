import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Modal,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import WebView from "react-native-webview";

const ViewProfile = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedPlatform, setSelectedPlatform] = useState("Platform");
  const [refreshing, setRefreshing] = useState(false);
  const [alert, setAlert] = useState(null);
  const screenWidth = Dimensions.get("window").width;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const allPastPosts = user?.pastPosts || [];
  const isCurrentUserProfile = user?._id === user?._id;

  const categories = ["Category", ...new Set(allPastPosts.map((post) => post.category))];
  const platforms = ["Platform", ...new Set(allPastPosts.map((post) => post.platform))];

  const filteredPosts = allPastPosts.filter(
    (post) =>
      (selectedCategory === "Category" || post.category === selectedCategory) &&
      (selectedPlatform === "Platform" || post.platform === selectedPlatform)
  );

  const isFormatted = (followers) => {
    return typeof followers === "string" && (followers.includes("k") || followers.includes("M"));
  };

  const formatFollowers = (count) => {
    if (typeof count === "number") {
      if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + "M";
      } else if (count >= 1000) {
        return (count / 1000).toFixed(0) + "K";
      }
    }
    return count;
  };

  const extractYoutubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const isInstagramUrl = (url) => {
    return url.includes('instagram.com') || url.includes('instagr.am');
  };

  const renderPostContent = (post) => {
    if (!post.postLink) {
      return (
        <View className="w-full h-48 bg-slate-100 justify-center items-center rounded-xl">
          <Ionicons name="image-outline" size={40} color="#64748B" />
          <Text className="text-slate-500 mt-2">No content available</Text>
        </View>
      );
    }

    if (post.platform === 'YouTube') {
      const videoId = extractYoutubeId(post.postLink);
      if (videoId) {
        return (
          <View className="w-full" style={{ height: screenWidth * 0.5625 }}>
            <YoutubePlayer
              height={screenWidth * 0.5625}
              play={false}
              videoId={videoId}
            />
          </View>
        );
      } else {
        return (
          <View className="w-full h-48 bg-slate-100 justify-center items-center rounded-xl">
            <Ionicons name="alert-circle-outline" size={40} color="#64748B" />
            <Text className="text-slate-500 mt-2">Invalid YouTube URL</Text>
            <Text className="text-slate-400 text-xs mt-2">{post.postLink}</Text>
          </View>
        );
      }
    } else if (isInstagramUrl(post.postLink)) {
      return (
        <View className="w-full" style={{ height: screenWidth }}>
          <WebView
            source={{ uri: post.postLink }}
            style={{ flex: 1 }}
            allowsFullscreenVideo={true}
            scalesPageToFit={true}
          />
        </View>
      );
    } else {
      // For other platforms, show a link preview
      return (
        <TouchableOpacity 
          className="w-full p-4 bg-slate-100 rounded-xl border border-slate-200"
          onPress={() => Linking.openURL(post.postLink)}
        >
          <Text className="text-blue-500 font-medium" numberOfLines={1}>{post.postLink}</Text>
          <Text className="text-slate-500 text-xs mt-2">Tap to open in browser</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderPostCard = (post, index) => {
    return (
      <Animated.View 
        key={index} 
        className="w-80 mr-4 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200"
        style={{ opacity: fadeAnim }}
      >
        {/* Post header */}
        <View className="flex-row items-center p-3 border-b border-gray-100">
          <View className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-0.5">
            <View className="rounded-full bg-white p-0.5">
              <Image
                source={{ uri: user.profilePicUrl || "https://via.placeholder.com/150" }}
                className="w-6 h-6 rounded-full"
              />
            </View>
          </View>
          <Text className="font-semibold text-sm ml-3 text-gray-800">{user.ownerName}</Text>
          <View className="ml-auto">
            <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
          </View>
        </View>

        {/* Post content */}
        {renderPostContent(post)}

        {/* Post footer */}
        <View className="p-3">
          <Text className="text-xs text-gray-500 mt-1">
            {post.category && `Category: ${post.category} • `}
            {new Date(post.date || Date.now()).toLocaleDateString()}
          </Text>
        </View>
      </Animated.View>
    );
  };

  if (!user) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-600">User not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View 
          className="p-6 pt-12 bg-white rounded-b-3xl shadow-sm border-b border-gray-200"
          style={{ opacity: fadeAnim }}
        >
          <View className="flex-row justify-between items-start mb-6">
            {/* Profile Info */}
            <View className="flex-col items-start">
              <View className="relative">
                <Image
                  source={{ uri: user.profilePicUrl || "https://via.placeholder.com/150" }}
                  className="w-28 h-28 rounded-2xl border-2 border-blue-500"
                />
                <View className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              </View>
              <Text className="text-xl font-bold text-gray-900 mt-4">{user.ownerName}</Text>
              
              <View className="bg-blue-100 px-4 py-2 rounded-full flex-row items-center mt-3">
                <Ionicons name="flash" size={16} color="#3B82F6" />
                <Text className="text-xs text-blue-700 ml-1 font-medium">
                  Promotions: {allPastPosts.length}
                </Text>
              </View>
              
              {user.profileDetails.length > 0 &&
                user.profileDetails.map((profile, index) => (
                  <View key={index} className="mt-2">
                    {profile.platform.toLowerCase() === "instagram" && profile.followers && (
                      <Text className="text-sm text-green-600 font-medium">
                        {isFormatted(profile.followers)
                          ? profile.followers
                          : formatFollowers(profile.followers)}{" "}
                        Followers
                      </Text>
                    )}
                  </View>
                ))}
            </View>

            {/* Categories */}
            <View className="flex-1 ml-6">
              <Text className="text-gray-600 text-sm font-medium mb-2">Categories</Text>
              <View className="flex-row flex-wrap gap-2">
                {categories
                  .filter((category) => category !== "Category")
                  .map((category, index) => (
                    <View
                      key={index}
                      className="bg-gray-100 px-3 py-2 rounded-xl border border-gray-200"
                    >
                      <Text className="text-xs text-gray-700 font-medium">{category}</Text>
                    </View>
                  ))}
              </View>
            </View>
          </View>

          {/* Pricing Cards */}
          <View className="flex-row justify-between mt-2">
            <View className="w-28 h-32 border border-gray-200 bg-white rounded-2xl p-3 items-center justify-center shadow-sm">
              <View className="bg-purple-100 p-1 rounded-full mb-3">
                <View className="bg-white rounded-full p-2">
                  <Ionicons name="play-circle" size={20} color="#7C3AED" />
                </View>
              </View>
              <Text className="text-gray-900 font-semibold text-xs mb-1">Story Post</Text>
              <Text className="text-xs text-gray-500">
                {user.pricing?.storyPost ? `₹${user.pricing.storyPost}` : "Negotiable"}
              </Text>
            </View>

            <View className="w-28 h-32 border border-gray-200 bg-white rounded-2xl p-3 items-center justify-center shadow-sm">
              <View className="bg-blue-100 p-1 rounded-full mb-3">
                <View className="bg-white rounded-full p-2">
                  <Ionicons name="image" size={20} color="#3B82F6" />
                </View>
              </View>
              <Text className="text-gray-900 font-semibold text-xs mb-1">Feed Post</Text>
              <Text className="text-xs text-gray-500">
                {user.pricing?.feedPost ? `₹${user.pricing.feedPost}` : "Negotiable"}
              </Text>
            </View>

            <View className="w-28 h-32 border border-gray-200 bg-white rounded-2xl p-3 items-center justify-center shadow-sm">
              <View className="bg-red-100 p-1 rounded-full mb-3">
                <View className="bg-white rounded-full p-2">
                  <Ionicons name="videocam" size={20} color="#EF4444" />
                </View>
              </View>
              <Text className="text-gray-900 font-semibold text-xs mb-1">Reel</Text>
              <Text className="text-xs text-gray-500">
                {user.pricing?.reel ? `₹${user.pricing.reel}` : "Negotiable"}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Accounts Section */}
        <Animated.View 
          className="p-6 mt-6 bg-white rounded-3xl mx-4 shadow-sm border border-gray-200"
          style={{ opacity: fadeAnim }}
        >
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-xl font-bold text-gray-900">Accounts</Text>
            <TouchableOpacity>
              <Text className="text-blue-600 text-sm font-medium">View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
            {user.profileDetails.map((profile, index) => (
              <View
                key={index}
                className="w-72 mr-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200"
              >
                <View className="flex-row items-center">
                  <View className="relative">
                    <Image
                      source={{
                        uri:
                          profile.platform === "Instagram"
                            ? "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                            : profile.platform === "Facebook"
                            ? "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                            : profile.platform === "Twitter"
                            ? "https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg"
                            : profile.platform === "YouTube"
                            ? "https://cdn-icons-png.flaticon.com/512/174/174883.png"
                            : "https://via.placeholder.com/40",
                      }}
                      className="w-12 h-12 rounded-xl"
                    />
                    <View className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-gray-200">
                      <Ionicons 
                        name="checkmark-circle" 
                        size={16} 
                        color="#10B981" 
                      />
                    </View>
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className="text-gray-900 font-bold" numberOfLines={1}>
                      {profile.profileName}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">{profile.platform}</Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between items-center mt-4">
                  <View className="items-start">
                    <Text className="text-sm text-green-600 font-bold">
                      {isFormatted(profile.followers)
                        ? profile.followers
                        : formatFollowers(profile.followers)}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">Followers</Text>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => Linking.openURL(profile.profilePicUrl)}
                    className="bg-blue-600 px-4 py-2 rounded-full"
                  >
                    <Text className="text-white text-xs font-medium">Visit Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Posts Section */}
        <Animated.View 
          className="p-6 mt-6 bg-white rounded-3xl mx-4 mb-6 shadow-sm border border-gray-200"
          style={{ opacity: fadeAnim }}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-900">Popular Posts</Text>
            
            <View className="flex-row bg-gray-100 rounded-full p-1 border border-gray-200">
              <TouchableOpacity 
                className={`px-3 py-1 rounded-full ${selectedPlatform === "Platform" ? "bg-blue-600" : ""}`}
                onPress={() => setSelectedPlatform("Platform")}
              >
                <Text className={`text-xs ${selectedPlatform === "Platform" ? "text-white" : "text-gray-600"}`}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className={`px-3 py-1 rounded-full ${selectedPlatform === "Instagram" ? "bg-blue-600" : ""}`}
                onPress={() => setSelectedPlatform("Instagram")}
              >
                <Text className={`text-xs ${selectedPlatform === "Instagram" ? "text-white" : "text-gray-600"}`}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className={`px-3 py-1 rounded-full ${selectedPlatform === "YouTube" ? "bg-blue-600" : ""}`}
                onPress={() => setSelectedPlatform("YouTube")}
              >
                <Text className={`text-xs ${selectedPlatform === "YouTube" ? "text-white" : "text-gray-600"}`}>YouTube</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
              {filteredPosts.map((post, index) => renderPostCard(post, index))}
            </ScrollView>
          ) : (
            <View className="py-8 items-center justify-center">
              <Ionicons name="images" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-4 text-center">No posts available for the selected filters.</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Alert Modal */}
      {alert && (
        <Modal transparent visible={true} animationType="fade">
          <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
            <View className="bg-white p-6 rounded-2xl w-full max-w-md border border-gray-200 shadow-lg">
              <Text className="text-lg font-bold text-gray-900 mb-4">{alert.message}</Text>
              <View className="flex-row justify-end space-x-3">
                {alert.onCancel && (
                  <TouchableOpacity
                    onPress={alert.onCancel}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                  >
                    <Text className="text-gray-700">Cancel</Text>
                  </TouchableOpacity>
                )}
                {alert.onConfirm && (
                  <TouchableOpacity
                    onPress={alert.onConfirm}
                    className="px-4 py-2 bg-blue-600 rounded-lg"
                  >
                    <Text className="text-white font-medium">Confirm</Text>
                  </TouchableOpacity>
                )}
                {!alert.onConfirm && !alert.onCancel && (
                  <TouchableOpacity
                    onPress={() => setAlert(null)}
                    className="px-4 py-2 bg-blue-600 rounded-lg"
                  >
                    <Text className="text-white font-medium">OK</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default ViewProfile;