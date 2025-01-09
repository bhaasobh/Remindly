// ReminderDetails.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type ReminderDetailsProps = {
  reminder: {
    name: string;
    address: string;
    text: string;
  };
  onClose: () => void;
};

const ReminderDetails: React.FC<ReminderDetailsProps> = ({ reminder, onClose }) => {
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Reminder Details</Text>
        <Text>Name: {reminder.name}</Text>
        <Text>Address: {reminder.address}</Text>
        <Text>Details: {reminder.text}</Text>
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
