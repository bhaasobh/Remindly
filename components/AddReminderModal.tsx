import React ,{ useState, useEffect,useCallback } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useLogin } from '../app/auth/LoginContext'; 
import config from '@/config';

interface AddReminderModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onSaveReminder: (reminder: any) => void;
}

const AddReminderModal: React.FC<AddReminderModalProps> = ({ modalVisible, setModalVisible, onSaveReminder }) => {
  const [reminderType, setReminderType] = useState<'location' | 'time'>('location');
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState('200.00');
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handleSave = () => {
    const newReminder = {
      title,
      reminderType,
      address,
      radius,
      time,
      details,
      latitude,
      longitude,
    };

    console.log('Saved reminder:', newReminder); 
    onSaveReminder(newReminder);
    setModalVisible(false);
    saveReminderToDatabase(newReminder)
  };

  const handleAddressSelect = (data: any, details: any) => {
    if (details) {
      const fullAddress = data.description;
      const lat = details.geometry.location.lat;
      const lng = details.geometry.location.lng;
      setAddress(fullAddress); 
      setLatitude(lat); 
      setLongitude(lng); 
      console.log('Selected Address:', fullAddress, 'Latitude:', lat, 'Longitude:', lng);
    } else {
      console.warn('No details available for the selected place.');
      Alert.alert('Error', 'Unable to fetch address details.');
    }
  };
  const { userId } = useLogin();
  const saveReminderToDatabase = async (reminder: any) => {
    try {
      const url =
        reminder.reminderType === 'location'
          ? `${config.SERVER_API}/users/${userId}/location-reminders`
          : `${config.SERVER_API}/users/${userId}/time-reminders`; 
  
      const body =
        reminder.reminderType === 'location'
          ? {
              title: reminder.title,
              address: {
                name: reminder.address,
                lat: reminder.latitude,
                lng: reminder.longitude,
              },
              details: reminder.details,
            }
          : {
              title: reminder.title,
              address: {
                name: reminder.address,
                lat: reminder.latitude,
                lng: reminder.longitude,
              },
              details: reminder.details,
              time: reminder.time,
            };
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('Reminder saved successfully:', result);
      } else {
        console.error('Failed to save reminder:', result.message || response.statusText);
      }
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };
  
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.closemodal}>X</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Create a new reminder</Text>
          <Text>Reminder Title:</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} />

          <Text>Reminder Type:</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity onPress={() => setReminderType('location')}>
              <Text style={[styles.radioOption, reminderType === 'location' && styles.selectedRadio]}>
                Location-based
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setReminderType('time')}>
              <Text style={[styles.radioOption, reminderType === 'time' && styles.selectedRadio]}>
                Time-based
              </Text>
            </TouchableOpacity>
          </View>

          {reminderType === 'location' && (
            <>
              <Text>Address:</Text>
              <GooglePlacesAutocomplete
                placeholder="Search your address"
                minLength={2}
                fetchDetails={true}
                onPress={handleAddressSelect} 
                query={{
                  key: 'AIzaSyAp2CByzchy61Z_OQxvuTRRwc3mUInW0RE', 
                  language: 'en',
                }}
                styles={{
                  container: { flex: 0, width: '100%' },
                  textInput: styles.input,
                }}
              />
              <Text>Time:</Text>
              <TextInput style={styles.input} value={time} onChangeText={setTime} />
              <Text>Reminder details:</Text>
              <TextInput style={[styles.input, styles.largeInput]} value={details} onChangeText={setDetails} multiline />
            </>
          )}

          {reminderType === 'time' && (
            <>
              <Text>Time:</Text>
              <TextInput style={styles.input} value={time} onChangeText={setTime} />
              <Text>Reminder details:</Text>
              <TextInput style={[styles.input, styles.largeInputForTime]} value={details} onChangeText={setDetails} multiline />
            </>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Add Reminder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 251, 247, 0.33)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 350,
    height: 600,
    justifyContent: 'center',
    borderColor: '#DF6316',
    borderWidth: 2,
  },
  closemodal: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#DF6316',
    position: 'absolute',
    top: -66,
    left: 295,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#DF6316',
    position: 'absolute',
    top: 20,
    left: 50,
  },
  saveButton: {
    backgroundColor: '#DF6316',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    position: 'absolute',
    top: 505,
    left: 100,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DF6316',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    width: '100%',
  },
  largeInput: {
    height: 146,
  },
  largeInputForTime: {
    height: 221.5,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  radioOption: {
    color: '#d1936b',
    fontSize: 16,
  },
  selectedRadio: {
    color: '#DF6316',
    fontWeight: 'bold',
  },
});

export default AddReminderModal;
