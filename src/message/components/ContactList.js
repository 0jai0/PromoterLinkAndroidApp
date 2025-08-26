import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { Trash2, MoreVertical } from 'lucide-react-native';

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

  const ContactItem = ({ item }) => (
    <TouchableOpacity
      className={`flex-row items-center p-5 border-b border-gray-100 ${
        activeContactId === item.id ? 'bg-indigo-50' : 'bg-white'
      }`}
      onPress={() => onSelectContact(item)}
    >
      <View className="relative">
        <Image
          source={{
            uri: item.profilePicUrl || 
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.ownerName)}`
          }}
          className="w-14 h-14 rounded-full border-2 border-gray-200"
        />
        {item.isOnline && (
          <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        )}
        {item.hasUnread && (
          <View className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full justify-center items-center border-2 border-white">
            <Text className="text-white text-xs font-bold">!</Text>
          </View>
        )}
      </View>
      
      <View className="ml-4 flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-900 font-semibold text-base">{item.ownerName}</Text>
          <Text className={`text-xs ${item.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
            {item.isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
        <Text className="text-gray-500 text-sm mt-1">
          Last seen recently
        </Text>
      </View>
      
      <TouchableOpacity
        onPress={() => handleRemove(item.user._id, item.ownerName)}
        className="p-2 ml-2"
      >
        <MoreVertical size={20} color="#9ca3af" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 py-5 border-b border-gray-100 shadow-sm">
        <Text className="text-gray-900 text-2xl font-bold">Contacts</Text>
        <Text className="text-gray-500 mt-1">
          {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
        </Text>
      </View>
      
      <View className="flex-1">
        {contacts.length === 0 ? (
          <View className="flex-1 justify-center items-center p-6">
            <View className="bg-white p-8 rounded-2xl shadow-sm items-center w-full max-w-xs">
              <Text className="text-gray-900 text-lg font-medium mb-2 text-center">
                No contacts yet
              </Text>
              <Text className="text-gray-500 text-center">
                Start connecting with people to see them here!
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ContactItem item={item} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default ContactList;