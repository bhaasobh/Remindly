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

const Home: React.FC = () => {
  const [boxHeight, setBoxHeight] = useState(BOX_HEIGHT);
  const [icon, setIcon] = useState('^');
  const [toggleUp, setToggleUp] = useState(true);
  const [selectedReminder, setSelectedReminder] = useState<any>(null); 
  const heightAnim = useRef(new Animated.Value(BOX_HEIGHT)).current;
  const [isModalVisible, setModalVisible] = useState(false);

  const [timeReminders, setTimeReminders] = useState<any[]>([]);
  const [locationReminders, setLocationReminders] = useState<any[]>([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const saveReminder = (reminder: any) => {
    if (reminder.reminderType === 'time') {
      setTimeReminders([...timeReminders, reminder]);
    } else {
      setLocationReminders([...locationReminders, reminder]);
    }
    setModalVisible(false); 
  };

  const reminders = [
    { id: 1, name: 'Grocery Store', latitude: 32.080880, longitude: 34.780570, address: '123 Market St', text: 'test test 123 yooooo' },
    { id: 2, name: 'Pharmacy', latitude: 32.082880, longitude: 34.781570, address: '456 Health Ave', text: 'test test 456 yooooo' },
    { id: 3, name: 'Library', latitude: 32.085880, longitude: 34.784570, address: '789 Knowledge Rd', text: 'test test 789 yooooo' },
    { id:4,  name: 'Supermarket',latitude:32.232730, longitude:34.962729, address: 'Tareq Abd el-Hai St 5, Tira',text: 'milk' },
  ];

  const toggleHeight = () => {
    setToggleUp(!toggleUp);
    const newHeight = icon === '^' ? Math.min(boxHeight + 500, MAX_HEIGHT) : Math.max(boxHeight - 500, MIN_HEIGHT);
    setBoxHeight(newHeight);
    setIcon(icon === '^' ? 'v' : '^');

    Animated.timing(heightAnim, {
      toValue: newHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleReminderClick = (reminderId: number) => {
    const reminder = reminders.find((reminder) => reminder.id === reminderId);
    if (reminder) {
      setSelectedReminder(reminder);
    }
  };

  const renderBoxes = () => {
    return reminders.map((reminder) => (
      <TouchableOpacity key={reminder.id} onPress={() => handleReminderClick(reminder.id)}>
        <View style={styles.boxesContainer}>
          <Text style={styles.boxText}>{reminder.name}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <Header />
      <MapComponent reminders={reminders} />
      <Animated.View style={[styles.slideUpBox, { height: heightAnim }]}>
        <View style={styles.handle}>
          <TouchableOpacity onPress={toggleHeight}>
            <Entypo name={toggleUp ? 'arrow-with-circle-up' : 'arrow-with-circle-down'} size={24} color="#DF6316" />
          </TouchableOpacity>
        </View>
        <View style={styles.SlidBoxTitleContainer}>
          <Text style={styles.reminderText}>All Reminders</Text>
          <View style={styles.AddIconPlace}>
            <Entypo
              style={styles.addTasIcons}
              onPress={toggleModal}
              name="add-to-list"
              size={24}
              color="#DF6316"
            />
          </View>
        </View>
        <ScrollView>{renderBoxes()}</ScrollView>
      </Animated.View>
      <AddReminderModal
        modalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        onSaveReminder={saveReminder}
      />
      <Modal visible={selectedReminder !== null} animationType="slide" transparent={true}>
        <ReminderDetails
          reminder={selectedReminder!}
          onClose={() => setSelectedReminder(null)} 
        />
      </Modal>
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
    width: 423,
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    left: -20,
    top: -10,
  },
  addTasIcons: {
    top: -25,
    right: -95,
  },
  boxText: {
    color: '#000',
    fontWeight: 'bold',
  },
  reminderText: {
    fontSize: 22,
    color: '#DF6316',
    right: 245,
    position: 'relative',
  },
  SlidBoxTitleContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: -25,
  },
  AddIconPlace: {
    borderRadius: 2.5,
    right: 110,
    top: -10,
    marginVertical: 10,
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
    top:-66,
    left:295,
    position:'absolute',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#DF6316',
    top:20,
    left:50,
    position:'absolute',
  },
  saveButton: {
    backgroundColor: '#DF6316',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: 220,
    height: 50,
    top:505,
    left:63,
    position:'absolute',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Home;
