import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MapComponent from "@/components/MapComponent";
import Header from "@/components/Header";
import AddReminderModal from "@/components/AddReminderModal";
import TimeReminderComponent from "@/components/TimeReminderComponent";
import RemindersList from "@/components/RemindersList";
import { useLogin } from "@/app/auth/LoginContext";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const BOX_HEIGHT = 300;
const MAX_HEIGHT = SCREEN_HEIGHT * 0.8;
const MIN_HEIGHT = 300;

interface Reminder {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  address: string;
  details: string;
  reminderType: "location" | "time";
}

const Home: React.FC = () => {
  const { reminders, setReminders } = useLogin();
  const [boxHeight, setBoxHeight] = useState(BOX_HEIGHT);
  const [toggleUp, setToggleUp] = useState(true);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const heightAnim = useRef(new Animated.Value(BOX_HEIGHT)).current;
  const [isModalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "location" | "time">("all");

  const handleSaveReminder = (newReminder: any) => {
    setReminders([...reminders, newReminder]);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleHeight = () => {
    const newHeight = toggleUp
      ? Math.min(boxHeight + 500, MAX_HEIGHT)
      : Math.max(boxHeight - 500, MIN_HEIGHT);

    setBoxHeight(newHeight);
    setToggleUp(!toggleUp);

    Animated.timing(heightAnim, {
      toValue: newHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Header />
      <MapComponent />
      <Animated.View style={[styles.slideUpBox, { height: heightAnim }]}>
        <View style={styles.handle}>
          <TouchableOpacity onPress={toggleHeight}>
            <Entypo
              name={toggleUp ? "arrow-with-circle-up" : "arrow-with-circle-down"}
              size={24}
              color="#DF6316"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.slideBoxTitleContainer}>
          <Text style={styles.reminderText}>All Reminders</Text>
          <TouchableOpacity style={styles.addIconPlace} onPress={toggleModal}>
            <Entypo name="add-to-list" size={24} color="#DF6316" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <RemindersList />
        </ScrollView>
      </Animated.View>
      <AddReminderModal
        modalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        onSaveReminder={handleSaveReminder}
      />
      {selectedReminder && (
        <Modal visible={true} animationType="slide" transparent={true}>
          {/* You can add your ReminderDetails component here */}
        </Modal>
      )}
      <TimeReminderComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slideUpBox: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    elevation: 0,
    justifyContent: "center",
    overflow: "hidden",
    paddingBottom: 50,
    width: "100%",
  },
  handle: {
    borderRadius: 2.5,
    alignSelf: "center",
    marginVertical: 10,
  },
  reminderText: {
    fontSize: 22,
    color: "#DF6316",
    marginBottom: 22,
  },
  slideBoxTitleContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: -25,
  },
  addIconPlace: {
    borderRadius: 2.5,
    left: -10,
    top: -8,
    position: "relative",
  },
});

export default Home;
