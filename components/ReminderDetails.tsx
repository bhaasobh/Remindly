import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Reminder {
  id: string;
  title: string;
  address: {
    name: string;
    lat: number;
    lng: number;
  };
  details: string;
}

type ReminderDetailsProps = {
  reminder: Reminder | null;
  onClose: () => void;
};

const ReminderDetails: React.FC<ReminderDetailsProps> = ({ reminder, onClose }) => {
  // If reminder is null, return nothing or a fallback UI
  if (!reminder) {
    return null; // Or you can return a message like "No reminder selected"
  }

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Reminder Details</Text>
        <Text>Name: {reminder.title}</Text>
        <Text>Address: {reminder.address.name}</Text>
        <Text>Details: {reminder.title}</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#DF6316',
  },
  closeButton: {
    marginTop: 20,
    color: '#DF6316',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReminderDetails;
