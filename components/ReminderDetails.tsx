import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Reminder = {
  id: string;
  title: string;
  details: string;
  address: string;
  reminderType: 'location' | 'time';
  Time: string;
};

type ReminderDetailsProps = {
  reminder: Reminder | null;
  onClose: () => void;
};

const ReminderDetails: React.FC<ReminderDetailsProps> = ({ reminder, onClose }) => {
  // If reminder is null, return nothing or a fallback UI
  if (!reminder) {
    return null; // Or you can return a message like "No reminder selected"
  }
  
  const parsedDate = reminder.Time ? new Date(reminder.Time) : null;
  const formattedTime = parsedDate && !isNaN(parsedDate.getTime())
    ? `${parsedDate.toLocaleDateString()} ${parsedDate.toLocaleTimeString()}`
    : 'No time specified';

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Reminder Details</Text>
        <Text style={styles.InfoTitle}>Name: {reminder.title}</Text>
        {reminder.reminderType === 'location' && (
          <>
            <Text style={styles.InfoTitle}>Address:</Text>
            <Text>{reminder.address}</Text>
          </>
        )}
        {reminder.reminderType === 'time' && (
          <>
            <Text style={styles.InfoTitle}>Time:</Text>
            <Text>{formattedTime}</Text>
          </>
        )}
        <Text  style={styles.InfoTitle}>Details:</Text>
        <Text> {reminder.details}</Text>
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
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    height: 280,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#DF6316',
    left: 53,
    top: -14,
  },
  closeButton: {
    marginTop: 20,
    color: '#DF6316',
    fontSize: 16,
    fontWeight: 'bold',
    left: 105,
    top: 10,
  },
  InfoTitle: {
    fontWeight: 'bold',
  },
});

export default ReminderDetails;
