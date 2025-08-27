import React, { useRef, useEffect, useCallback, memo } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AlertCircle, Check, CheckCheck, Clock, AlertTriangle } from 'lucide-react-native';

// Memoize the message item to prevent unnecessary re-renders
const MessageItem = memo(({ item, currentUserId }) => {
  // For your data structure, check if status is "sent" to determine alignment
//   console.log(item.sender, currentUserId);
  const isCurrentUser = !(item.status !== "sent")

  return (
    <View className={`flex-row mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <View
        className={`max-w-[80%] rounded-2xl p-4 ${
          isCurrentUser 
            ? 'bg-indigo-600 rounded-br-md' 
            : 'bg-gray-100 rounded-bl-md'
        }`}
      >
        <Text className={isCurrentUser ? 'text-white' : 'text-gray-800'}>
          {item.content}
        </Text>
        
        <View className="flex-row items-center justify-end mt-2">
          <Text className={`text-xs ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          
          {isCurrentUser && (
            <View className="ml-2">
              {item.status === 'sending' ? (
                <Clock size={14} color={isCurrentUser ? "#a5b4fc" : "#6b7280"} />
              ) : item.status === 'failed' ? (
                <AlertTriangle size={14} color="#ef4444" />
              ) : item.messageStatus === 'read' ? (
                <CheckCheck size={14} color={isCurrentUser ? "#a5b4fc" : "#6b7280"} />
              ) : (
                <Check size={14} color={isCurrentUser ? "#a5b4fc" : "#6b7280"} />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
});

// Create a unique key for each message
const getMessageKey = (item, index) => {
  return item._id ? `${item._id}-${item.timestamp}` : `msg-${index}-${Date.now()}`;
};

const ChatWindow = ({ messages, currentUser, isExpired, onUpgrade, isLoading }) => {
  const flatListRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  // Memoize the renderItem function
  const renderItem = useCallback(({ item }) => (
    <MessageItem item={item} currentUserId={currentUser._id} />
  ), [currentUser._id]);

  // Memoize the key extractor
  const keyExtractor = useCallback((item, index) => getMessageKey(item, index), []);

  if (isExpired) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-gray-50">
        <View className="bg-white rounded-2xl p-8 items-center shadow-lg max-w-md w-full">
          <View className="bg-amber-100 p-4 rounded-full mb-5">
            <AlertCircle size={48} color="#f59e0b" />
          </View>
          <Text className="text-gray-900 text-xl font-bold mb-3 text-center">
            Conversation Expired
          </Text>
          <Text className="text-gray-600 text-center mb-6 leading-5">
            This conversation has expired. Spend 1 LinkCoin to renew it and continue chatting.
          </Text>
          <TouchableOpacity
            onPress={onUpgrade}
            disabled={isLoading}
            className="bg-indigo-600 px-8 py-4 rounded-full flex-row items-center w-full justify-center shadow-md"
          >
            {isLoading && <ActivityIndicator color="white" className="mr-2" />}
            <Text className="text-white font-bold text-lg">
              {isLoading ? 'Processing...' : 'Renew Conversation'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {messages.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <View className="bg-white p-6 rounded-2xl shadow-sm items-center">
            <Text className="text-gray-500 text-lg mb-2">No messages yet</Text>
            <Text className="text-gray-400 text-center">
              Start the conversation by sending a message!
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
        />
      )}
    </View>
  );
};

export default ChatWindow;