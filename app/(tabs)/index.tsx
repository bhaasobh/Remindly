import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { ReminderCard } from '@/components/ReminderCard';
import Entypo from '@expo/vector-icons/Entypo';
import MapComponent from '@/components/MapComponent';
import Header from '../Header';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const BOX_HEIGHT = 300;
const MAX_HEIGHT = SCREEN_HEIGHT * 0.8;
const MIN_HEIGHT = 300;

const Home: React.FC = () => {
  const [boxHeight, setBoxHeight] = useState(BOX_HEIGHT);
  const [icon, setIcon] = useState('^');
  const [toggleUp, setToggleUp] = useState(true);
  const heightAnim = useRef(new Animated.Value(BOX_HEIGHT)).current;

  const reminders = [
    { id: 1, name: 'Grocery Store', latitude: 32.080880, longitude: 34.780570, address: '123 Market St' },
    { id: 2, name: 'Pharmacy', latitude: 32.082880, longitude: 34.781570, address: '456 Health Ave' },
    { id: 3, name: 'Library', latitude: 32.085880, longitude: 34.784570, address: '789 Knowledge Rd' },
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

  const renderBoxes = () => {
    return reminders.map((reminder) => (
      <TouchableOpacity key={reminder.id} onPress={() => console.log(`Reminder selected: ${reminder.name}`)}>
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
        <View  style={styles.handle}>
        <TouchableOpacity onPress={toggleHeight}>
          <Entypo name={toggleUp ? 'arrow-with-circle-up' : 'arrow-with-circle-down'} size={24} color="#DF6316" />
        </TouchableOpacity>
        </View>
        <View style={styles.SlidBoxTitleContainer}>
          <Text style={styles.reminderText}>All Reminders</Text>
          <View  style={styles.AddIconPlace}>
          <Entypo style={styles.addTasIcons} name="add-to-list" size={24} color="#DF6316" />
          </View>
        </View>
        <ScrollView>
          {renderBoxes()}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    paddingBottom:50,
    width:'100%',
    
  },
  handle: {    
    borderRadius: 2.5,
    alignSelf: 'center',
    left: 0,
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
    left:-20,
    top:-10,
  },
  addTasIcons:{
    top:-25,
    right:-95,    
  },
  boxText: {
    color: '#000',
    fontWeight: 'bold',
  },
  reminderText: {
    fontSize: 22,
    color: '#DF6316',
    right:245,
    position: 'relative',
  },
  SlidBoxTitleContainer:{
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    marginTop:10,
    marginBottom:-25
  },
  AddIconPlace: {    
    borderRadius: 2.5,
    right: 110,
    top: -10,
    marginVertical: 10,
  },
});

export default Home;
