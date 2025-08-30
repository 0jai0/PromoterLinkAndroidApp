import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Linking,
  Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from "react-native-youtube-iframe";
import { WebView } from 'react-native-webview';

// Platform options configuration
const platformOptions = [
  {
    value: 'Instagram',
    label: 'Instagram',
    dimensions: { width: 1080, height: 1080 },
    aspectRatio: 1,
    icon: '📷',
    type: 'social'
  },
  {
    value: 'Facebook',
    label: 'Facebook',
    dimensions: { width: 1200, height: 630 },
    aspectRatio: 1200/630,
    icon: '👍',
    type: 'social'
  },
  {
    value: 'Twitter',
    label: 'Twitter',
    dimensions: { width: 1200, height: 675 },
    aspectRatio: 16/9,
    icon: '🐦',
    type: 'social'
  },
  {
    value: 'YouTube',
    label: 'YouTube',
    dimensions: { width: 1280, height: 720 },
    aspectRatio: 16/9,
    icon: '▶️',
    type: 'video'
  },
  {
    value: 'WhatsApp',
    label: 'WhatsApp',
    dimensions: { width: 1280, height: 720 },
    aspectRatio: 16/9,
    icon: '💬',
    type: 'social'
  },
  {
    value: 'TikTok',
    label: 'TikTok',
    dimensions: { width: 1080, height: 1920 },
    aspectRatio: 9/16,
    icon: '🎵',
    type: 'video'
  },
  {
    value: 'LinkedIn',
    label: 'LinkedIn',
    dimensions: { width: 1200, height: 627 },
    aspectRatio: 1200/627,
    icon: '💼',
    type: 'social'
  },
  {
    value: 'Pinterest',
    label: 'Pinterest',
    dimensions: { width: 1000, height: 1500 },
    aspectRatio: 2/3,
    icon: '📌',
    type: 'social'
  }
];

// Sample ad categories
const adCategoryOptions = [
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Beauty', label: 'Beauty' },
  { value: 'Lifestyle', label: 'Lifestyle' },
  { value: 'Food', label: 'Food' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Fitness', label: 'Fitness' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Gaming', label: 'Gaming' },
  { value: 'Parenting', label: 'Parenting' },
  { value: 'Education', label: 'Education' },
];

const PastPostsScreen = ({ profile, setProfile }) => {
  const [expandedPost, setExpandedPost] = useState(null);
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [addingNewPost, setAddingNewPost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostPlatform, setNewPostPlatform] = useState('');
  const screenWidth = Dimensions.get('window').width;
 const pastPosts = profile?.pastPosts || [];
  // Start adding a new post (first step - select platform)
  const startAddingPost = () => {
    setAddingNewPost(true);
    setNewPostPlatform('');
  };
  const onRefresh = async () => {
    setRefreshing(true);
    // Add your refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Cancel adding new post
  const cancelAddPost = () => {
    setAddingNewPost(false);
    setNewPostPlatform('');
  };

  // Add a new empty post after platform is selected
  const addPastPost = () => {
    if (!newPostPlatform) return;
    if (typeof setProfile !== 'function') {
      console.error('setProfile is not a function');
      return;
    }
    setProfile({
      ...profile,
      pastPosts: [
        { 
          category: "", 
          postLink: "", 
          platform: newPostPlatform,
        },
        ...profile.pastPosts,
      ],
    });
    setExpandedPost(0);
    setAddingNewPost(false);
    setNewPostPlatform('');
  };

  // Handle changes to post fields
  const handlePastPostChange = (index, field, value) => {
    if (typeof setProfile !== 'function') {
      console.error('setProfile is not a function');
      return;
    }
    const updatedPosts = [...profile.pastPosts];
    updatedPosts[index] = { 
      ...updatedPosts[index], 
      [field]: value,
    };
    setProfile({ ...profile, pastPosts: updatedPosts });
  };

  // Extract YouTube video ID from URL
  const extractYoutubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Check if URL is an Instagram post
  const isInstagramUrl = (url) => {
    return url.includes('instagram.com/p/') || url.includes('instagram.com/reel/');
  };

  // Remove post
  const removePost = (index) => {
    Alert.alert(
      "Remove Post",
      "Are you sure you want to remove this post?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Remove", 
          onPress: () => {
            const updatedPosts = profile.pastPosts.filter((_, i) => i !== index);
            setProfile({ ...profile, pastPosts: updatedPosts });
            if (expandedPost === index) setExpandedPost(null);
          }
        }
      ]
    );
  };

  // Toggle post expansion
  const toggleExpandPost = (index) => {
    setExpandedPost(expandedPost === index ? null : index);
  };

  // Get platform icon
  const getPlatformIcon = (platform) => {
    const foundPlatform = platformOptions.find(p => p.value === platform);
    return foundPlatform ? foundPlatform.icon : '🌐';
  };

  // Get platform aspect ratio
  const getPlatformAspectRatio = (platform) => {
    const foundPlatform = platformOptions.find(p => p.value === platform);
    return foundPlatform ? foundPlatform.aspectRatio : 1;
  };

  // Get platform type (social or video)
  const getPlatformType = (platform) => {
    const foundPlatform = platformOptions.find(p => p.value === platform);
    return foundPlatform ? foundPlatform.type : 'social';
  };

  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set([
    ...adCategoryOptions.map(opt => opt.value),
    ...profile.pastPosts.map(post => post.category).filter(Boolean)
  ])];

  // Filter posts based on selected filters
  const filteredPosts = profile.pastPosts.filter(post => {
    const platformMatch = filterPlatform === 'all' || post.platform === filterPlatform;
    const categoryMatch = !filterCategory || post.category.toLowerCase().includes(filterCategory.toLowerCase());
    return platformMatch && categoryMatch;
  });

  // Render appropriate content based on platform and URL
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

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="p-4 flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-slate-900">Past Posts</Text>
        </View>
        
        {/* Search and Filters Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-slate-800">Your Content</Text>
            <TouchableOpacity 
              onPress={startAddingPost}
              className="px-4 py-2 bg-blue-600 rounded-xl flex-row items-center shadow-xs"
            >
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white ml-2 font-medium">Add Post</Text>
            </TouchableOpacity>
          </View>
          
          {/* Platform Filter */}
          <View className="mb-3">
            <Text className="text-sm text-slate-600 mb-2 font-medium">
              Filter by Platform
            </Text>
            <View className="bg-white border border-slate-200 rounded-xl shadow-xs">
              <Picker
                selectedValue={filterPlatform}
                onValueChange={(value) => setFilterPlatform(value)}
                style={{ color: 'slate-900' }}
              >
                <Picker.Item label="All Platforms" value="all" />
                {platformOptions.map(platform => (
                  <Picker.Item 
                    key={platform.value} 
                    label={platform.label} 
                    value={platform.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          {/* Category Filter */}
          <View className="mb-4">
            <Text className="text-sm text-slate-600 mb-2 font-medium">
              Filter by Category
            </Text>
            <View className="bg-white border border-slate-200 rounded-xl shadow-xs">
              <Picker
                selectedValue={filterCategory}
                onValueChange={(value) => setFilterCategory(value)}
                style={{ color: 'slate-900' }}
              >
                <Picker.Item label="All Categories" value="" />
                {uniqueCategories.map(category => (
                  <Picker.Item 
                    key={category} 
                    label={category} 
                    value={category} 
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        
        {/* Add New Post Modal */}
        <Modal
          visible={addingNewPost}
          transparent={true}
          animationType="slide"
        >
          <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
            <View className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
              <Text className="text-lg font-bold text-slate-900 mb-4">Add New Post</Text>
              
              <View className="space-y-4">
                <View>
                  <Text className="text-sm text-slate-600 mb-2 font-medium">
                    Select Platform
                  </Text>
                  <View className="bg-white border border-slate-200 rounded-xl">
                    <Picker
                      selectedValue={newPostPlatform}
                      onValueChange={(value) => setNewPostPlatform(value)}
                      style={{ color: 'slate-900' }}
                    >
                      <Picker.Item label="Select a platform" value="" />
                      {platformOptions.map(platform => (
                        <Picker.Item 
                          key={platform.value} 
                          label={platform.label} 
                          value={platform.value} 
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
                
                <View className="flex-row justify-end space-x-3">
                  <TouchableOpacity
                    onPress={cancelAddPost}
                    className="px-4 py-2 bg-slate-200 rounded-xl"
                  >
                    <Text className="text-slate-700 font-medium">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={addPastPost}
                    disabled={!newPostPlatform}
                    className={`px-4 py-2 rounded-xl ${!newPostPlatform ? 'bg-blue-400' : 'bg-blue-600'}`}
                  >
                    <Text className="text-white font-medium">Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        
        {filteredPosts.length === 0 ? (
          <View className="py-8 items-center bg-white rounded-xl p-6 mt-2 border border-slate-200 shadow-xs">
            <View className="bg-slate-100 p-4 rounded-full mb-4">
              <Ionicons name="document-outline" size={36} color="#64748B" />
            </View>
            <Text className="text-slate-800 mt-4 text-lg font-medium">No posts found</Text>
            <Text className="text-slate-500 text-center mt-2 text-sm">
              Try adjusting your filters or add a new post
            </Text>
          </View>
        ) : (
          <ScrollView 
            className="flex-1"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#3B82F6"]}
                tintColor="#3B82F6"
              />
            }
          >
            <View className="space-y-3 mb-4">
              {filteredPosts.map((post, index) => (
                <View key={index} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                  <TouchableOpacity 
                    className="flex-row items-center justify-between p-4"
                    onPress={() => toggleExpandPost(index)}
                  >
                    <View className="flex-row items-center space-x-3 flex-1">
                      <Text className="text-xl">{getPlatformIcon(post.platform)}</Text>
                      <View className="flex-1">
                        <Text className="font-semibold text-slate-900" numberOfLines={1}>
                          {post.category || "Untitled Post"}
                        </Text>
                        <Text className="text-sm text-slate-500" numberOfLines={1}>
                          {post.platform}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      {post.postLink && (
                        <TouchableOpacity 
                          onPress={() => Linking.openURL(post.postLink)}
                          className="mr-3 p-2 bg-slate-100 rounded-lg"
                        >
                          <Ionicons name="open-outline" size={16} color="#3B82F6" />
                        </TouchableOpacity>
                      )}
                      <Ionicons 
                        name={expandedPost === index ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#64748B" 
                      />
                    </View>
                  </TouchableOpacity>
                  
                  {expandedPost === index && (
                    <View className="p-4 border-t border-slate-100">
                      <View className="flex-col">
                        {/* Post Preview */}
                        <View className="mb-4">
                          {renderPostContent(post)}
                        </View>
                        
                        {/* Post Details */}
                        <View className="space-y-4">
                          <View>
                            <Text className="text-sm text-slate-600 mb-2 font-medium">
                              Category
                            </Text>
                            <View className="bg-white border border-slate-200 rounded-xl">
                              <Picker
                                selectedValue={post.category}
                                onValueChange={(value) => handlePastPostChange(index, "category", value)}
                                style={{ color: 'slate-900' }}
                              >
                                <Picker.Item label="Select a category" value="" />
                                {adCategoryOptions.map(option => (
                                  <Picker.Item 
                                    key={option.value} 
                                    label={option.label} 
                                    value={option.value} 
                                  />
                                ))}
                              </Picker>
                            </View>
                          </View>
                          
                          <View>
                            <Text className="text-sm text-slate-600 mb-2 font-medium">
                              Platform
                            </Text>
                            <View className="bg-white border border-slate-200 rounded-xl">
                              <Picker
                                selectedValue={post.platform}
                                onValueChange={(value) => handlePastPostChange(index, "platform", value)}
                                style={{ color: 'slate-900' }}
                              >
                                {platformOptions.map(platform => (
                                  <Picker.Item 
                                    key={platform.value} 
                                    label={platform.label} 
                                    value={platform.value} 
                                  />
                                ))}
                              </Picker>
                            </View>
                          </View>
                          
                          <View>
                            <Text className="text-sm text-slate-600 mb-2 font-medium">
                              Post URL
                            </Text>
                            <TextInput
                              value={post.postLink}
                              onChangeText={(text) => handlePastPostChange(index, "postLink", text)}
                              placeholder="Enter post URL"
                              className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm"
                              placeholderTextColor="#94a3b8"
                            />
                          </View>
                          
                          <TouchableOpacity 
                            onPress={() => removePost(index)}
                            className="w-full px-4 py-3 bg-red-600 rounded-xl flex-row justify-center items-center"
                          >
                            <Ionicons name="trash-outline" size={18} color="white" />
                            <Text className="text-white font-medium ml-2">Remove Post</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PastPostsScreen;