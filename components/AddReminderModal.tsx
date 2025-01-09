import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface AddReminderModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onSaveReminder: (reminder: any) => void; 
}

const AddReminderModal: React.FC<AddReminderModalProps> = ({ modalVisible, setModalVisible, onSaveReminder }) => {
  const [reminderType, setReminderType] = useState<'location' | 'time'>('location');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('');
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');

  const handleSave = () => {
    const newReminder = {
      title,
      reminderType,
      location,
      radius,
      time,
      details,
    };
 
    //this to see if the details were saved here remind me to remove it 
    console.log('Saved reminder:', newReminder); 
    onSaveReminder(newReminder); 
    setModalVisible(false); 
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
              <Text>Location:</Text>
              <TextInput style={styles.input} value={location} onChangeText={setLocation} />
              <Text>Radius:</Text>
              <TextInput style={styles.input} value={radius} onChangeText={setRadius} keyboardType="numeric" />
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
    left: 63,
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
    height: 80,
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
