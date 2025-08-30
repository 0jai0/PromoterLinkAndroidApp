import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Send, Clock, WifiOff, AlertCircle } from 'lucide-react-native';

const MessageInput = ({ onSend, isExpired, isLoading, isConnected }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isExpired && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  if (isExpired) {
    return (
      <View className="bg-white p-5 border-t border-gray-200 shadow-md">
        <View className="flex-row items-center justify-center bg-amber-50 rounded-xl px-5 py-4 border border-amber-200">
          <Clock size={22} color="#f59e0b" />
          <Text className="text-amber-800 ml-3 font-medium">Conversation expired</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="bg-white p-5 border-t border-gray-200 shadow-md"
    >
      {!isConnected && (
        <View className="bg-amber-50 p-3 rounded-lg mb-3 flex-row items-center border border-amber-200">
          <WifiOff size={18} color="#f59e0b" />
          <Text className="text-amber-800 ml-2 text-sm">
            Connection issues. Messages may be delayed.
          </Text>
        </View>
      )}
      
      <View className="flex-row items-center">
        <TextInput
          className="flex-1 bg-gray-100 text-gray-900 rounded-full px-5 py-4 mr-3 text-base"
          placeholder="Type a message..."
          placeholderTextColor="#9ca3af"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSend}
          multiline
          maxLength={500}
          editable={!isLoading && isConnected}
        />
        
        <TouchableOpacity
          onPress={handleSend}
          disabled={!message.trim() || isLoading || !isConnected}
          className={`p-4 rounded-full shadow-sm ${
            message.trim() && !isLoading && isConnected 
              ? 'bg-indigo-600' 
              : 'bg-gray-300'
          }`}
        >
          <Send 
            size={22} 
            color={message.trim() && !isLoading && isConnected ? 'white' : '#9ca3af'} 
          />
        </TouchableOpacity>
      </View>
      
      <View className="flex-row justify-end mt-2">
        <Text className="text-gray-400 text-xs">
          {message.length}/500
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageInput;