import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dummy contact data
const contacts = [
  { id: '1', name: 'Alice Johnson', phone: '+1234567890' },
  { id: '2', name: 'Bob Smith', phone: '+1987654321' },
  { id: '3', name: 'Charlie Brown', phone: '+1122334455' },
  { id: '4', name: 'Diana Prince', phone: '+1223344556' },
  { id: '5', name: 'Ethan Hunt', phone: '+1445566778' },
];

const ContactCard = ({ contact, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(contact)}>
    <Ionicons name="person-circle-outline" size={40} color="#4B5563" />
    <View style={styles.textContainer}>
      <Text style={styles.name}>{contact.name}</Text>
      <Text style={styles.phone}>{contact.phone}</Text>
    </View>
  </TouchableOpacity>
);

const ContactList = () => {
  const handlePress = (contact) => {
    console.log('Contact pressed:', contact.name);
    // Here you could navigate to a contact detail screen
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContactCard contact={item} onPress={handlePress} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default ContactList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  textContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  phone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});
