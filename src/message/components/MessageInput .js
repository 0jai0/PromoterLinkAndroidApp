import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, Image, ScrollView, BackHandler, Alert } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
import ContactList from '../components/ContactList';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import Navbar from './Navbar';
import { ArrowRight, X, MessageSquare } from 'lucide-react-native';
import CustomAlert from './Alert';
import { useNavigation } from '@react-navigation/native';

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const userId = user?._id;
  const socketRef = useRef(null);
  const [alert, setAlert] = useState(null);
  const isLoadingRef = useRef(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.EXPO_PUBLIC_SERVER_API);
    }

    const backAction = () => {
      if (isSidebarOpen) {
        setIsSidebarOpen(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isSidebarOpen]);

  // Fetch contacts function and other logic would be similar to web version
  // but adapted for React Native API calls

  const fetchContacts = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_API}/api/collection/users/${userId}`);
      const data = await response.json();

      if (data.collections) {
        const validContacts = data.collections.filter(
          item => item.user && typeof item.user === 'object'
        ).map(item => ({
          ...item,
          id: item.user._id,
          ownerName: item.user?.ownerName,
          profilePicUrl: item.user?.profilePicUrl,
          isOnline: item.user?.isOnline
        }));
        setContacts(validContacts);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      Alert.alert("Error", "Failed to load contacts");
    }
  }, [userId]);

  // Other functions (loadConversation, handleSendMessage, etc.) would be similar
  // but adapted for React Native

  return (
    <View className="flex-1 bg-[#121212]">
      <Navbar />
      
      {alert && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={alert.onClose}
          onConfirm={alert.onConfirm}
          onCancel={alert.onCancel}
        />
      )}

      <View className="flex-1 flex-row">
        {/* Sidebar Toggle Button */}
        {!isSidebarOpen && (
          <TouchableOpacity
            onPress={() => setIsSidebarOpen(true)}
            className="absolute bottom-24 left-4 bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] p-3 rounded-full z-50 shadow-lg"
          >
            <ArrowRight size={24} color="black" />
          </TouchableOpacity>
        )}

        {/* Contact List Sidebar */}
        {isSidebarOpen && (
          <View className="absolute inset-0 z-40 bg-black bg-opacity-75">
            <View className="w-4/5 h-full bg-[#151515]">
              <View className="pt-12 px-4">
                <TouchableOpacity
                  onPress={() => setIsSidebarOpen(false)}
                  className="absolute top-4 right-4 z-50"
                >
                  <X size={24} color="white" />
                </TouchableOpacity>
                <ContactList
                  contacts={contacts}
                  onSelectContact={(contact) => {
                    loadConversation(contact);
                    setIsSidebarOpen(false);
                  }}
                  onRemoveContact={handleRemoveFromList}
                  activeContactId={activeContact?._id}
                />
              </View>
            </View>
          </View>
        )}

        {/* Main Chat Area */}
        <View className="flex-1">
          {activeContact ? (
            <>
              {/* Chat Header */}
              <View className="flex-row items-center bg-[#121212] py-3 px-4 border-b border-gray-800">
                <Image
                  source={{
                    uri: activeContact.profilePicUrl || 
                         `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(activeContact.ownerName)}&radius=50&backgroundColor=1a1a1a`
                  }}
                  className="w-10 h-10 rounded-full mr-3"
                  defaultSource={require('../assets/default-avatar.png')}
                />
                <Text className="text-white font-bold text-lg">
                  {activeContact.ownerName}
                </Text>
              </View>

              {/* Chat Messages */}
              <View className="flex-1">
                <ChatWindow 
                  messages={messages} 
                  currentUser={user} 
                  isExpired={activeContact?.isExpired} 
                  onUpgrade={handleUpgrade} 
                />
              </View>

              {/* Message Input */}
              <MessageInput 
                onSend={handleSendMessage} 
                isExpired={activeContact?.isExpired} 
              />
            </>
          ) : (
            <View className="flex-1 justify-center items-center p-4">
              <View className="w-24 h-24 mb-6 rounded-full bg-[#59FFA7]/10 justify-center items-center">
                <MessageSquare size={40} color="#1FFFE0" />
              </View>
              <Text className="text-white text-xl font-medium mb-2">
                No conversation selected
              </Text>
              <Text className="text-gray-400 text-center mb-6">
                Choose a contact from the sidebar to start chatting
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                className="bg-gradient-to-r from-[#1FFFE0] to-[#249BCA] px-6 py-3 rounded-full"
              >
                <Text className="text-black font-bold">New Message</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Chat;