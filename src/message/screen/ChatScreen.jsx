import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  FlatList, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useSelector } from 'react-redux';
import { Send, Trash2, ArrowLeft, MoreVertical, User, Clock, AlertCircle } from 'lucide-react-native';
import API from '../../api/config';
import { useNavigation } from '@react-navigation/native';
import { io } from "socket.io-client";   // ✅ socket.io-client instead of react-native-websocket

// ContactList Component with unread indicators
const ContactList = ({ contacts, onSelectContact, onRemoveContact, activeContactId }) => {
  const handleRemove = (contactId, contactName) => {
    Alert.alert(
      "Remove Contact",
      `Are you sure you want to remove ${contactName} from your contacts?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: () => onRemoveContact(contactId), style: "destructive" }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-900">
      <Text className="text-white text-xl font-bold p-4 border-b border-gray-800">Contacts</Text>
      <View className="flex-1">
        {contacts.length === 0 ? (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-gray-400 text-center">No contacts yet. Start connecting with people!</Text>
          </View>
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`flex-row items-center p-4 border-b border-gray-800 ${
                  activeContactId === item.id ? 'bg-gray-800' : ''
                }`}
                onPress={() => onSelectContact(item)}
                onLongPress={() => handleRemove(item.user._id, item.ownerName)}
              >
                <View className="relative">
                  <Image
                    source={{
                      uri: item.profilePicUrl || 
                           `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.ownerName)}`
                    }}
                    className="w-12 h-12 rounded-full"
                  />
                  {item.isOnline && (
                    <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                  )}
                  {item.hasUnread && (
                    <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full justify-center items-center">
                      <Text className="text-white text-xs font-bold">!</Text>
                    </View>
                  )}
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-white font-medium">{item.ownerName}</Text>
                  <Text className="text-gray-400 text-sm">
                    {item.isOnline ? 'Online' : 'Offline'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemove(item.user._id, item.ownerName)}
                  className="p-2"
                >
                  <Trash2 size={20} color="#ef4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

// ChatWindow Component
const ChatWindow = ({ messages, currentUser, isExpired, onUpgrade, isLoading }) => {
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
              ? 'bg-blue-500 rounded-br-none'
              : 'bg-gray-700 rounded-bl-none'
          }`}
        >
          <Text className="text-white">
            {item.content}
          </Text>
          <View className="flex-row items-center justify-end mt-1">
            <Text
              className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-300'}`}
            >
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {isCurrentUser && (
              <Text className="text-xs ml-2 text-blue-100">
                {item.status === 'sending' ? 'Sending...' : 
                 item.status === 'failed' ? 'Failed' : 
                 item.messageStatus === 'read' ? 'Read' : 'Sent'}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (isExpired) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-gray-900">
        <View className="bg-gray-800 rounded-xl p-6 items-center max-w-md">
          <AlertCircle size={48} color="#f59e0b" className="mb-4" />
          <Text className="text-white text-lg font-bold mb-2 text-center">
            Conversation Expired
          </Text>
          <Text className="text-gray-400 text-center mb-6">
            This conversation has expired. Spend 1 LinkCoin to renew it for 7 more days.
          </Text>
          <TouchableOpacity
            onPress={onUpgrade}
            disabled={isLoading}
            className="bg-amber-500 px-6 py-3 rounded-full flex-row items-center"
          >
            {isLoading && <ActivityIndicator color="white" className="mr-2" />}
            <Text className="text-white font-bold">Renew Conversation</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900 p-4">
      {messages.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-400">No messages yet. Start the conversation!</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => `${item._id || index}-${item.timestamp}`}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
};

// MessageInput Component
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
      <View className="bg-gray-800 p-4 border-t border-gray-700">
        <View className="flex-row items-center justify-center bg-gray-700 rounded-full px-4 py-3">
          <Clock size={20} color="#6b7280" />
          <Text className="text-gray-400 ml-2">Conversation expired</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="bg-gray-800 p-4 border-t border-gray-700"
    >
      {!isConnected && (
        <View className="bg-amber-500/20 p-2 rounded-lg mb-2">
          <Text className="text-amber-300 text-xs text-center">
            Connection issues. Messages may be delayed.
          </Text>
        </View>
      )}
      <View className="flex-row items-center">
        <TextInput
          className="flex-1 bg-gray-700 text-white rounded-full px-4 py-3 mr-2"
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
          className={`p-3 rounded-full ${
            message.trim() && !isLoading && isConnected ? 'bg-blue-500' : 'bg-gray-600'
          }`}
        >
          <Send size={24} color={message.trim() && !isLoading && isConnected ? 'white' : '#9ca3af'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Main Chat Component
const ChatScreen = () => {
  const { user } = useSelector((state) => state.auth);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const navigation = useNavigation();

  // ✅ Connect socket.io
  const connectSocket = useCallback(() => {
    if (!user?._id) return;

    const socket = io("https://influencerlink-446936445912.asia-south1.run.app", {
      transports: ["websocket"],
      query: { userId: user._id }
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
      socket.emit("join", user._id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket.on("receive_message", (data) => {
      // console.log("Message received:", data);
      handleIncomingMessage(data);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
      setIsConnected(false);
    });
  }, [user]);

  useEffect(() => {
    connectSocket();
    fetchContacts();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [connectSocket]);

  // Incoming message handler
  const handleIncomingMessage = (messageData) => {
    // Normalize message object (make sure it has _id and timestamp)
  const newMessage = {
    _id: messageData._id || Date.now().toString(), // fallback if backend didn’t send _id
    content: messageData.content,
    sender: messageData.sender,
    receiver: messageData.receiver,
    timestamp: messageData.timestamp || new Date().toISOString(),
    status: messageData.status || "received",
  };

  if (activeContact && newMessage.sender === activeContact.user._id) {
    setMessages(prev => [...prev, newMessage]);
  }

  setContacts(prev =>
    prev.map(contact =>
      contact.user._id === newMessage.sender
        ? { ...contact, hasUnread: contact.user._id !== activeContact?.user._id }
        : contact
    )
  );
};

  // Send Message
  const handleSendMessage = (text) => {
    if (!text.trim()) return;

  const newMessage = {
    sender: user._id,
    receiver: activeContact.user._id,
    content: text,
    timestamp: new Date().toISOString(),
    status: "sent",
    messageStatus: "unread",
  };

  setMessages((prev) => [...prev, newMessage]);

  // emit to server
  socketRef.current.emit("send_message", newMessage, (ack) => {
    // console.log("Server ACK:", ack);
  });
};

  // Fetch Contacts
  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(`/api/collection/users/${user._id}`);
      if (response.data.collections) {
        const validContacts = response.data.collections
          .filter(item => item.user && typeof item.user === 'object')
          .map(item => ({
            ...item,
            id: item.user._id,
            ownerName: item.user?.ownerName,
            profilePicUrl: item.user?.profilePicUrl,
            isOnline: item.user?.isOnline,
            hasUnread: item.unreadCount > 0
          }));
        setContacts(validContacts);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load Conversation
  const loadConversation = async (contact) => {
    try {
      setIsLoading(true);
      setActiveContact(contact);

      const response = await API.get(`/api/messages/conversation/${user._id}/${contact.user._id}`);
      if (response.data.conversation) {
        setMessages(response.data.conversation);
      } else {
        setMessages([]);
      }

      // reset unread
      setContacts(prev =>
        prev.map(c => c.user._id === contact.user._id ? { ...c, hasUnread: false } : c)
      );
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      {!isConnected && (
        <View className="bg-amber-500 p-2">
          <Text className="text-white text-center">Connecting...</Text>
        </View>
      )}

      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Messages</Text>
        </View>
        <TouchableOpacity onPress={() => setIsSidebarOpen(true)}>
          <MoreVertical size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Sidebar Modal */}
      <Modal visible={isSidebarOpen} animationType="slide">
        <View className="flex-1 bg-gray-900">
          <View className="flex-row items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
            <Text className="text-white text-xl font-bold">Contacts</Text>
            <TouchableOpacity onPress={() => setIsSidebarOpen(false)}>
              <Text className="text-blue-400 text-lg">Done</Text>
            </TouchableOpacity>
          </View>
          <ContactList
            contacts={contacts}
            onSelectContact={(contact) => {
              loadConversation(contact);
              setIsSidebarOpen(false);
            }}
            onRemoveContact={() => {}}
            activeContactId={activeContact?.id}
          />
        </View>
      </Modal>

      {/* Main Content */}
      <View className="flex-1">
        {activeContact ? (
          <>
            {/* Chat Header */}
            <View className="flex-row items-center bg-gray-800 py-3 px-4 border-b border-gray-700">
              <Image
                source={{
                  uri: activeContact.profilePicUrl || 
                       `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeContact.ownerName)}`
                }}
                className="w-10 h-10 rounded-full mr-3"
              />
              <View className="flex-1">
                <Text className="text-white font-bold">{activeContact.ownerName}</Text>
                <Text className="text-gray-400 text-sm">
                  {activeContact.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>

            {/* Chat Messages */}
            <ChatWindow 
              messages={messages} 
              currentUser={user} 
              isExpired={activeContact?.isExpired} 
              onUpgrade={() => {}}
              isLoading={isLoading}
            />

            {/* Message Input */}
            <MessageInput 
              onSend={handleSendMessage} 
              isExpired={activeContact?.isExpired}
              isLoading={isLoading}
              isConnected={isConnected}
            />
          </>
        ) : (
          <View className="flex-1 justify-center items-center p-4 bg-gray-900">
            <View className="w-24 h-24 mb-6 rounded-full bg-blue-500/10 justify-center items-center">
              <User size={40} color="#3b82f6" />
            </View>
            <Text className="text-white text-xl font-medium mb-2 text-center">
              {contacts.length > 0 ? 'Select a conversation' : 'No conversations'}
            </Text>
            <Text className="text-gray-400 text-center mb-6">
              {contacts.length > 0 
                ? 'Choose a contact from the sidebar to start chatting' 
                : 'You don\'t have any contacts yet'}
            </Text>
          </View>
        )}
      </View>

      {isLoading && (
        <View className="absolute inset-0 justify-center items-center bg-black/50">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      )}
    </View>
  );
};

export default ChatScreen;
