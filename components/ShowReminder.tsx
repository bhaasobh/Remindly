import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ReminderDetails from './ReminderDetails'; 
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import config from '@/config';
import { useLogin } from '@/app/auth/LoginContext';

type Reminder = {
  id: string;
  title: string;
  details: string;
  address:{
    name : string, 
    lat: number;
    lng: number;
  } 
  reminderType: 'location' | 'time';
  Time: string;
 
};

type ShowReminderProps = {
  reminder: Reminder | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onSave: (updatedReminder: Reminder) => void;
};

const ShowReminder: React.FC<ShowReminderProps> = ({ reminder, onClose, onDelete, onSave }) => {
  const [isEditing, setIsEditing] = useState(false); 
   const { userId ,refreshReminders} = useLogin(); 


  if (!reminder) {
    return null;
  }

  const handleEdit = () => {
    setIsEditing(true); 
  };

  const handleCloseEdit = () => {
    setIsEditing(false); 
  };

  const modalHeight = reminder.reminderType === 'time' ? 300 : 340; 
  const deleteReminder = async (id: string, reminder: Reminder) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this reminder?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            const url =
              reminder.reminderType === 'location'
                ? `${config.SERVER_API}/location-reminders/${id}`
                : `${config.SERVER_API}/time-reminders/${id}`;
  
            try {
              const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
  
              if (response.ok) {
                Alert.alert('Success', 'Reminder deleted successfully');
                if(reminder.reminderType === 'location')
                  refreshReminders();

                onDelete(id);
              } else {
                console.error('Failed to delete reminder');
              }
            } catch (error) {
              console.error('Error deleting reminder:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  

  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { height: modalHeight }]}>
        <Text style={styles.modalTitle}>Reminder Details</Text>
        
        {isEditing ? (
          <ReminderDetails
            reminder={reminder}
            onClose={handleCloseEdit} 
            onSave={onSave} 
          />
        ) : (
          <>
            <Text style={styles.InfoTitle}>Name:</Text>
            <Text>{reminder.title}</Text>

            {reminder.reminderType === 'location' && (
              <>
                <Text style={styles.InfoTitle}>Address:</Text>
                <Text>{reminder.address.name}</Text>
              </>
            )}

           {reminder.reminderType === 'time' && (
              <>
                 <Text style={styles.InfoTitle}>Date:                 Time:</Text>
                 <Text>{new Date(reminder.Time).toLocaleDateString('en-GB')}     {new Date(reminder.Time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</Text>
              </>
            )}


            <Text style={styles.InfoTitle}>Details:</Text>
            <Text>{reminder.details}</Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={onClose} style={styles.closeButtonContainer}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                <MaterialIcons name="edit" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteReminder(reminder.id, reminder)} style={styles.deleteButton}>
                <FontAwesome name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </>
        )}
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
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DF6316',
    textAlign: 'center',
    position: 'absolute',
    top: 25,
    left: 75,
  },
  InfoTitle: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    top:22,
  },
  closeButtonContainer: {
    padding: 10,
    backgroundColor: '#DF6316',
    borderRadius: 5,
  },
  closeButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 10,
    borderRadius: 5,
    left: 73,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 5,
    left:10,
  },
});

export default ShowReminder;
