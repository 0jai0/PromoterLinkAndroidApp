import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  FlatList, 
  Alert, 
  BackHandler 
} from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons'; // Add this import

const ContactList = ({ 
  contacts, 
  onSelectContact, 
  onRemoveContact, 
  activeContactId, 
  onBack
}) => {
  // Handle hardware back button
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (onBack) {
          onBack();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [onBack]);

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

  const ContactItem = ({ item }) => {
    const contactId = item.user?._id || item.id;
    const contactName = item.ownerName || item.user?.ownerName || 'Unknown';
    const profilePicUrl = item.profilePicUrl || item.user?.profilePicUrl;
    
    return (
      <TouchableOpacity
        className={`flex-row items-center p-5 border-b border-gray-100 ${
          activeContactId === contactId ? 'bg-indigo-50' : 'bg-white'
        }`}
        onPress={() => onSelectContact(item)}
      >
        <View className="relative">
          <Image
            source={{
              uri: profilePicUrl || 
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(contactName)}`
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
            <Text className="text-gray-900 font-semibold text-base" numberOfLines={1}>
              {contactName}
            </Text>
            <Text className={`text-xs ${item.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
              {item.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
            {item.lastSeen || 'Last seen recently'}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => handleRemove(contactId, contactName)}
          className="p-2 ml-2"
        >
          <MoreVertical size={20} color="#9ca3af" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with back button */}
      <View className="bg-white px-6 py-5 border-b border-gray-100 shadow-sm flex-row items-center">
        <TouchableOpacity 
          onPress={onBack}
          className="mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-gray-900 text-2xl font-bold">Contacts</Text>
          <Text className="text-gray-500 mt-1">
            {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
          </Text>
        </View>
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
            keyExtractor={(item) => item.user?._id || item.id}
            renderItem={({ item }) => <ContactItem item={item} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default ContactList;