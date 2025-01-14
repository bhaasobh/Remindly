import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, ScrollView, Modal } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MapComponent from '@/components/MapComponent';
import Header from '../../components/Header';
import AddReminderModal from '@/components/AddReminderModal'; 
import ReminderDetails from '@/components/ReminderDetails';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const BOX_HEIGHT = 300;
const MAX_HEIGHT = SCREEN_HEIGHT * 0.8;
const MIN_HEIGHT = 300;

interface Reminder {
  name: string;  
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  address: string;
  text: string;
  reminderType: 'location' | 'time'; 

}

const Home: React.FC = () => {
  const [locationReminders, setLocationReminders] = useState<Reminder[]>([]);
  const [boxHeight, setBoxHeight] = useState(BOX_HEIGHT);
  const [toggleUp, setToggleUp] = useState(true);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const heightAnim = useRef(new Animated.Value(BOX_HEIGHT)).current;
  const [isModalVisible, setModalVisible] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const saveReminder = (reminder: Reminder) => {
    setLocationReminders([...locationReminders, reminder]);
    setModalVisible(false);
  };

  const toggleHeight = () => {
    const newHeight = toggleUp ? Math.min(boxHeight + 500, MAX_HEIGHT) : Math.max(boxHeight - 500, MIN_HEIGHT);
    setBoxHeight(newHeight);
    setToggleUp(!toggleUp);

    Animated.timing(heightAnim, {
      toValue: newHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleReminderClick = (reminderId: string) => {
    const reminder = locationReminders.find((reminder) => reminder.id === reminderId);
    if (reminder) {
      setSelectedReminder(reminder);
    }
  };

  const renderBoxes = () => {
    return locationReminders.map((reminder) => (
      <TouchableOpacity key={reminder.id} onPress={() => handleReminderClick(reminder.id)}>
        <View style={styles.boxesContainer}>
          <Text style={styles.boxText}>{reminder.title}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <Header />
      <MapComponent reminders={locationReminders} />
      <Animated.View style={[styles.slideUpBox, { height: heightAnim }]}>
        <View style={styles.handle}>
          <TouchableOpacity onPress={toggleHeight}>
            <Entypo name={toggleUp ? 'arrow-with-circle-up' : 'arrow-with-circle-down'} size={24} color="#DF6316" />
          </TouchableOpacity>
        </View>
        <View style={styles.SlidBoxTitleContainer}>
          <Text style={styles.reminderText}>All Reminders</Text>
          <TouchableOpacity style={styles.AddIconPlace}  onPress={toggleModal}
          >
            <Entypo
              style={styles.addTasIcons}
              name="add-to-list"
              onPress={toggleModal}
              size={24}
              color="#DF6316"
            />
          </TouchableOpacity>
        </View>
        <ScrollView>{renderBoxes()}</ScrollView>
      </Animated.View>
      <AddReminderModal
        modalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        onSaveReminder={saveReminder}
      />
      {selectedReminder && (
        <Modal visible={true} animationType="slide" transparent={true}>
          <ReminderDetails
            reminder={selectedReminder}
            onClose={() => setSelectedReminder(null)}
          />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideUpBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    elevation: 0,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingBottom: 50,
    width: '100%',
  },
  handle: {
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  boxesContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: 50,
    left:10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  addTasIcons: {
    top: 0,
    right: 0,
    paddingBottom:15,
  },
  boxText: {
    color: '#000',
    fontWeight: 'bold',
  },
  reminderText: {
    fontSize: 22,
    color: '#DF6316',
    marginRight: 'auto',
    paddingBottom:15,

  },
  SlidBoxTitleContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: -25,
  },
  AddIconPlace: {
    borderRadius: 2.5,
    
  },
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
    top: -66,
    left: 295,
    position: 'absolute',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#DF6316',
    top: 20,
    left: 50,
    position: 'absolute',
  },
  saveButton: {
    backgroundColor: '#DF6316',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: 220,
    height: 50,
    top: 505,
    left: 63,
    position: 'absolute',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Home;
