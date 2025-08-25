import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Trash2 } from 'lucide-react-native';

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
    <View className="flex-1 bg-[#151515]">
      <Text className="text-white text-xl font-bold p-4 border-b border-gray-800">Contacts</Text>
      <View className="flex-1">
        {contacts.length === 0 ? (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-gray-400 text-center">No contacts yet. Start connecting with people!</Text>
          </View>
        ) : (
          contacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              className={`flex-row items-center p-4 border-b border-gray-800 ${
                activeContactId === contact.id ? 'bg-[#1a1a1a]' : ''
              }`}
              onPress={() => onSelectContact(contact)}
              onLongPress={() => handleRemove(contact.user._id, contact.ownerName)}
            >
              <View className="relative">
                <Image
                  source={{
                    uri: contact.profilePicUrl || 
                         `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(contact.ownerName)}&radius=50&backgroundColor=1a1a1a`
                  }}
                  className="w-12 h-12 rounded-full"
                  defaultSource={require('./assets/default-avatar.png')}
                />
                {contact.isOnline && (
                  <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#151515]" />
                )}
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-white font-medium">{contact.ownerName}</Text>
                <Text className="text-gray-400 text-sm">
                  {contact.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemove(contact.user._id, contact.ownerName)}
                className="p-2"
              >
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

export default ContactList;