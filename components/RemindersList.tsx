import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLogin } from '../app/auth/LoginContext';
import ReminderDetails from './ReminderDetails';  // Import the ReminderDetails component
import config from '@/config';

type Reminder = {
  id: string;
  title: string;
  text: string;
  address: string;
  reminderType: 'location' | 'time';
  reminderTime?: string;
};

const RemindersList: React.FC = () => {
  const { userId } = useLogin();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'location' | 'time'>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

  const fetchReminders = useCallback(async () => {
    try {
      const response = await fetch(`${config.SERVER_API}/users/${userId}/reminders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok) {
        const { locationReminders, timeReminders } = data.reminders || {};

        const transformedLocationReminders = (locationReminders || []).map((reminder: any) => ({
          id: reminder._id?.toString() || '',
          title: reminder.title,
          address: reminder.address.name || `${reminder.address.lat}, ${reminder.address.lng}`,
          reminderType: 'location',
          text: reminder.text,
        }));

        const transformedTimeReminders = (timeReminders || []).map((reminder: any) => ({
          id: reminder._id?.toString() || '',
          title: reminder.title,
          reminderTime: reminder.reminderTime || 'No time set',
          reminderType: 'time',
          text: reminder.text,
        }));

        setReminders([...transformedLocationReminders, ...transformedTimeReminders]);

        if (transformedLocationReminders.length === 0 && transformedTimeReminders.length === 0) {
          Alert.alert('No Reminders Found', 'You have no reminders at the moment.');
        }
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch reminders.');
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      Alert.alert('Error', 'An error occurred while fetching reminders.');
    }
  }, [userId]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const filteredReminders = reminders.filter(
    (reminder) => filterType === 'all' || reminder.reminderType === filterType
  );

  const handleReminderClick = (reminderId: string) => {
    const selectedReminder = reminders.find((reminder) => reminder.id === reminderId);
    if (selectedReminder) {
      setSelectedReminder(selectedReminder); // Set the selected reminder to show in the modal
    }
  };

  const handleCloseModal = () => {
    setSelectedReminder(null);  // Close the modal
  };

  const handleFilterSelect = (type: 'all' | 'location' | 'time') => {
    setFilterType(type);
    setShowFilter(false);  // Close the filter box after selecting an option
  };

  return (
    <View style={styles.container}>
      {/* Filter Button (Positioned Outside the Container) */}
      <TouchableOpacity onPress={() => setShowFilter(!showFilter)} style={styles.filterIcon}>
        <FontAwesome name="filter" size={24} color='#333' />
      </TouchableOpacity>

      {/* Active Filter Text */}
      <Text style={styles.activeFilterText}>
        Active Filter: {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
      </Text>

      {/* Filter Options (Always visible or toggled) */}
      {showFilter && (
        <View style={styles.filterBox}>
          <TouchableOpacity onPress={() => handleFilterSelect('all')}>
            <Text style={[styles.filterText, filterType === 'all' && styles.activeFilter]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilterSelect('location')}>
            <Text style={[styles.filterText, filterType === 'location' && styles.activeFilter]}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilterSelect('time')}>
            <Text style={[styles.filterText, filterType === 'time' && styles.activeFilter]}>Time</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Reminder List */}
      <ScrollView style={styles.reminderList}>
        {filteredReminders.map((reminder) => (
          <TouchableOpacity key={reminder.id} onPress={() => handleReminderClick(reminder.id)}>
            <Text style={styles.reminderItem}>{reminder.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal for Reminder Details */}
      <Modal
        visible={!!selectedReminder}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <ReminderDetails reminder={selectedReminder} onClose={handleCloseModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 30,
  },
  filterIcon: {
    position: 'absolute', // Fixed position outside the reminder list container
    top: 0, 
    left: 10,
    backgroundColor: '#eee',
    padding: 5,
    borderRadius: 5,
    zIndex: 10,
  },
  activeFilterText: {
    fontSize: 18,
    marginTop: -27,
    color: '#333',
    fontWeight: 'bold',
    left: 30,
  },
  filterBox: {
    position: 'absolute',  // Position filter box near the filter icon
    left: 35,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    zIndex: 10,
    top: 32,
  },
  filterText: {
    fontSize: 16,
    color: '#555',
  },
  activeFilter: {
    color: '#DF6316',
    fontWeight: 'bold',
  },
  reminderList: {
    marginTop: 10, 
  },
  reminderItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for the modal
  },
});

export default RemindersList;
