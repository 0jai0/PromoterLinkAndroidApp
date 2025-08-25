import React, { useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Alert } from './Alert';

const ChatWindow = ({ messages, currentUser, isExpired, onUpgrade }) => {
  const flatListRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender === currentUser._id;
    
    return (
      <View className={`flex-row mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        <View
          className={`max-w-[80%] rounded-lg p-3 ${
            isCurrentUser
              ? 'bg-gradient-to-r from-[#1FFFE0] to-[#249BCA] rounded-br-none'
              : 'bg-gray-700 rounded-bl-none'
          }`}
        >
          <Text className={isCurrentUser ? 'text-black' : 'text-white'}>
            {item.content}
          </Text>
          <Text
            className={`text-xs mt-1 ${
              isCurrentUser ? 'text-gray-800' : 'text-gray-300'
            }`}
          >
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (isExpired) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-[#121212]">
        <View className="bg-[#1a1a1a] rounded-xl p-6 items-center max-w-md">
          <Text className="text-white text-lg font-bold mb-2 text-center">
            Conversation Expired
          </Text>
          <Text className="text-gray-400 text-center mb-6">
            This conversation has expired. Spend 1 LinkCoin to renew it for 7 more days.
          </Text>
          <TouchableOpacity
            onPress={onUpgrade}
            className="bg-gradient-to-r from-[#1FFFE0] to-[#249BCA] px-6 py-3 rounded-full"
          >
            <Text className="text-black font-bold">Renew Conversation</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#121212] p-4">
      {messages.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-400">No messages yet. Start the conversation!</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
};

export default ChatWindow;