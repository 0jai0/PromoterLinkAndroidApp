import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ActivityIndicator,BackHandler, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { ArrowLeft, MoreVertical, Users, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import API from '../../api/config';
import { useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
// Components
import ContactList from '../components/ContactList';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';

// Socket
import { initSocket, disconnectSocket, sendMessageSocket } from '../socket/socket';

const ChatScreen = () => {
  const { user } = useSelector((state) => state.auth);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true; // Prevent default behavior
        }
        return false; // Allow default behavior (exit app)
      }
    );

    return () => backHandler.remove();
  }, [navigation]); // Add navigation to dependency array

  useEffect(() => {
  if (!route.params?.userId) return;

  (async () => {
    const updatedContacts = await fetchContacts();
    setIsSidebarOpen(false);

    const contactToOpen = updatedContacts.find(c => c.id === route.params.userId);
    // console.log("sfsgv", contactToOpen);
    setActiveContact(contactToOpen);
    if (contactToOpen) {
      
      // console.log("Opening chat with:", contactToOpen.ownerName);
      loadConversation(contactToOpen);
    }
  })();
}, [route.params?.userId]);

  // Setup socket
  useEffect(() => {
    if (!user?._id) return;

    const socket = initSocket(
      user?._id,
      handleIncomingMessage,
      () => setIsConnected(true),
      () => setIsConnected(false),
      () => setIsConnected(false)
    );

    return () => disconnectSocket();
  }, [user?._id]);

  const handleIncomingMessage = (messageData) => {
    const newMessage = {
      _id: messageData._id || Date.now().toString(),
      content: messageData.content,
      sender: messageData.sender,
      receiver: messageData.receiver,
      timestamp: messageData.timestamp || new Date().toISOString(),
      status: messageData.status || "sent",
      messageStatus: messageData.messageStatus || "unread"
    };
    if (activeContact && 
        (newMessage.sender === activeContact?.id || newMessage.receiver === activeContact?.id)) {
          console.log("donr");
      setMessages(prev => [...prev, newMessage]);
    }

    if (newMessage.sender !== user._id) {
      setContacts(prev =>
        prev.map(contact =>
          contact.user._id === newMessage.sender
            ? { ...contact, hasUnread: contact.user._id !== activeContact?.user._id }
            : contact
        )
      );
    }
  };

  const handleSendMessage = (text) => {
    if (!text.trim() || !activeContact) return;

    const newMessage = {
      _id: `temp-${Date.now()}`,
      sender: user._id,
      receiver: activeContact.id,
      content: text,
      timestamp: new Date().toISOString(),
      status: "sent",
      messageStatus: "unread"
    };

    setMessages((prev) => [...prev, newMessage]);

    sendMessageSocket(newMessage, (ack) => {
      console.log("1");
      if (ack?.status === "ok") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === newMessage._id
              ? { ...msg, status: "sent", _id: ack.message?._id || msg._id }
              : msg
          )
        );
        console.log("2");
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === newMessage._id ? { ...msg, status: "failed" } : msg
          )
        );
      }
    });
  };

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
        return validContacts;
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const loadConversation = async (contact) => {
    if (!contact?.id || !user?._id) return;
    console.log("Loading conversation:", user._id, contact.id);

    try {
      setIsLoading(true);
      console.log("kjhjhk",contact);
      setActiveContact(contact);

      const response = await API.get(
        `/api/messages/conversation/${user._id}/${contact.id}`
      );
      setMessages(response.data.conversation || []);

      // Clear unread
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, hasUnread: false } : c))
      );
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {!isConnected && (
        <View className="bg-amber-500 py-2 px-4">
          <Text className="text-white text-center text-sm">Connecting to chat service...</Text>
        </View>
      )}

      {/* Header */}
      <View className="flex-row items-center justify-between p-5 bg-white border-b border-gray-200 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="p-2 mr-2 rounded-full bg-gray-100"
          >
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          
          {activeContact ? (
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={() => setIsSidebarOpen(true)}
            >
              <Image
                source={{
                  uri: activeContact.profilePicUrl || 
                    `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(activeContact.ownerName)}`,
                }}
                className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200"
              />
              <View>
                <Text className="text-gray-900 font-bold text-lg">{activeContact.ownerName}</Text>
                <Text className="text-gray-500 text-xs">
                  {activeContact.isOnline ? "Online" : "Offline"}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <Text className="text-gray-900 text-xl font-bold">Messages</Text>
          )}
        </View>
        
        <TouchableOpacity 
          onPress={() => setIsSidebarOpen(true)}
          className="p-2 rounded-full bg-gray-100"
        >
          <Users size={22} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Sidebar Modal */}
      {/* Sidebar Modal */}
<Modal 
  visible={isSidebarOpen} 
  animationType="slide"
  presentationStyle="pageSheet"
  onRequestClose={() => setIsSidebarOpen(false)} // 👈 handle system back
>
  <View className="flex-1 bg-white">
    <ContactList
      contacts={contacts}
      onSelectContact={(contact) => {
        loadConversation(contact);
        setIsSidebarOpen(false);
      }}
      onRemoveContact={() => {}}
      activeContactId={activeContact?._id}
      onBack={() => setIsSidebarOpen(false)} // 👈 close modal instead of navigation
    />
  </View>
</Modal>


      {/* Chat Content */}
      <View className="flex-1">
        {activeContact ? (
          <>
            {/* Messages */}
            <ChatWindow 
              messages={messages} 
              currentUser={user} 
              isExpired={false}
              onUpgrade={() => {}}
              isLoading={isLoading}
            />

            {/* Input */}
            <MessageInput 
              onSend={handleSendMessage} 
              isExpired={false}
              isLoading={isLoading}
              isConnected={isConnected}
            />
          </>
        ) : (
          <View className="flex-1 items-center justify-center p-6 bg-gray-50">
            {isLoading ? (
              <View className="items-center">
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text className="text-gray-500 mt-4">Loading conversations...</Text>
              </View>
            ) : (
              <View className="bg-white p-8 rounded-2xl shadow-sm items-center w-full max-w-xs">
                <View className="bg-indigo-100 p-5 rounded-full mb-5">
                  <Users size={36} color="#4f46e5" />
                </View>
                <Text className="text-gray-900 text-lg font-medium mb-2 text-center">
                  Select a conversation
                </Text>
                <Text className="text-gray-500 text-center mb-6">
                  Choose a contact from your list to start chatting
                </Text>
                <TouchableOpacity
                  onPress={() => setIsSidebarOpen(true)}
                  className="bg-indigo-600 px-6 py-3 rounded-full"
                >
                  <Text className="text-white font-medium">View Contacts</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default ChatScreen;