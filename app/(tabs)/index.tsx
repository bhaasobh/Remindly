import React, { useRef, useState } from 'react';

import { View,Text,StyleSheet,Animated,TouchableOpacity,Dimensions,ScrollView,} from 'react-native';

import { ReminderCard } from '@/components/ReminderCard';
import Entypo from '@expo/vector-icons/Entypo';
import MapComponent from '@/components/MapComponent';
import Header from '../Header';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const BOX_HEIGHT = 300;
const MAX_HEIGHT = SCREEN_HEIGHT * 0.8;
const MIN_HEIGHT = 300;
const boxesNumber = 4; 

const Home: React.FC = () => {
  const [boxHeight, setBoxHeight] = useState(BOX_HEIGHT);
  const [icon, setIcon] = useState('^');

  const [ToggleUp , setToggleUp] = useState(true);

  const heightAnim = useRef(new Animated.Value(BOX_HEIGHT)).current;

  const toggleHeight = () => {
    setToggleUp(!ToggleUp);
    if (icon === '^') {
      const newHeight = boxHeight < MAX_HEIGHT ? boxHeight + 500 : MAX_HEIGHT;
      setBoxHeight(newHeight);
      setIcon('v');

      Animated.timing(heightAnim, {
        toValue: newHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      const newHeight = boxHeight > MIN_HEIGHT ? boxHeight - 500 : MIN_HEIGHT;
      setBoxHeight(newHeight);
      setIcon('^');

      Animated.timing(heightAnim, {
        toValue: newHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const renderBoxes = () => {
    return Array.from({ length: boxesNumber }, (_, index) => (
      <View key={index} style={styles.box}>
        {/* <Text style={styles.boxText}>Box {index + 1}</Text> */}
        <ReminderCard CardName={'Reminder '+ (index+1)}></ReminderCard>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
        <Header /> 
     <MapComponent/>
      <Animated.View
        style={[
          styles.slideUpBox,
          {
            height: heightAnim,
          },
        ]}
      >
        <TouchableOpacity onPress={toggleHeight}>
          
          {ToggleUp?<Entypo name="arrow-with-circle-up" size={24} color="#DF6316" />:<Entypo name="arrow-with-circle-down" size={24} color="#DF6316" />}
        </TouchableOpacity>
        <View style={styles.SlidBoxTitleContainer}>
         <Text style={styles.reminderText}>All Remainders </Text> 
        <Entypo style={styles.addTasIcons} name="add-to-list" size={24} color="#DF6316" />
        </View>
        <ScrollView contentContainerStyle={styles.boxesContainer}>
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
    padding: 20,
    elevation: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    paddingBottom:50,
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: '#DF6316',
    borderRadius: 2.5,
    alignSelf: 'center',
    left: 0,
    marginVertical: 10,
  },
  boxesContainer: {
    marginTop: -10,
    width: 360,
    alignItems: 'center',
  },
  box: {
    width: 380,
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
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
    left:-95,
    position: 'relative',
  },
  SlidBoxTitleContainer:{
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    marginTop:10,
    marginBottom:-10
  }
});

export default Home;
