import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import DateTimePicker from "@react-native-community/datetimepicker";
import config from "@/config";
import { useLogin } from "@/app/auth/LoginContext";

interface AddReminderModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onSaveReminder: (newReminder: any) => void;
}

const AddReminderModal: React.FC<AddReminderModalProps> = ({
  modalVisible,
  setModalVisible,
  onSaveReminder,
}) => {
  const { userId, refreshReminders } = useLogin();
  const [reminderType, setReminderType] = useState<"location" | "time">(
    "location"
  );
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState("200.00");
  const [Time, setTime] = useState("");
  const [date, setDate] = useState(new Date());
  const [details, setDetails] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID is not available. Please log in again.");
      return;
    }

    if (reminderType === "location" && (latitude === null || longitude === null)) {
      Alert.alert("Error", "Please select a valid location.");
      return;
    }

    const newReminder = {
      title,
      address: reminderType === "location" ? { name: address, lat: latitude, lng: longitude } : address,
      radius,
      Time: reminderType === "time" ? date.toISOString() : undefined,
      details,
    };

    try {
      const apiUrl = `${config.SERVER_API}/users/${userId}/${
        reminderType === "location" ? "location-reminders" : "time-reminders"
      }`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReminder),
      });

      if (response.ok) {
        const result = await response.json();
        const savedReminder = {
          ...newReminder,
          id: result.reminder._id, // Backend-provided ID
        };

        refreshReminders(); // Trigger global refresh
        onSaveReminder(savedReminder); // Add the saved reminder locally
        setModalVisible(false); // Close the modal
        Alert.alert("Success", "Reminder added successfully!");
      } else {
        const error = await response.json();
        console.error("Error saving reminder:", error);
        Alert.alert("Error", "Failed to add reminder. Please try again.");
      }
    } catch (error) {
      console.error("Error saving reminder:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  const handleAddressSelect = (data: any, details: any) => {
    if (details?.geometry?.location) {
      const fullAddress = data.description || "";
      const lat = details.geometry.location.lat;
      const lng = details.geometry.location.lng;

      setAddress(fullAddress);
      setLatitude(lat);
      setLongitude(lng);
    } else {
      Alert.alert("Error", "Unable to fetch address details. Please try again.");
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
            <TouchableOpacity onPress={() => setReminderType("location")}>
              <Text style={[styles.radioOption, reminderType === "location" && styles.selectedRadio]}>
                Location-based
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setReminderType("time")}>
              <Text style={[styles.radioOption, reminderType === "time" && styles.selectedRadio]}>
                Time-based
              </Text>
            </TouchableOpacity>
          </View>

          {reminderType === "location" && (
            <>
              <Text>Address:</Text>
              <GooglePlacesAutocomplete
                placeholder="Search your address"
                minLength={2}
                fetchDetails={true}
                onPress={handleAddressSelect}
                query={{
                  key: config.GOOGLE_API,
                  language: "en",
                }}
                styles={{
                  container: { flex: 0, width: "100%" },
                  textInput: styles.input,
                }}
              />
              <Text>Reminder details:</Text>
              <TextInput
                style={[styles.input, styles.largeInput]}
                value={details}
                onChangeText={setDetails}
                multiline
              />
            </>
          )}

          {reminderType === "time" && (
            <>
              <Text>Date:</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.input}>{date.toDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="calendar"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    setDate(selectedDate || date);
                  }}
                />
              )}
              <Text>Time:</Text>
              <TextInput style={styles.input} value={Time} onChangeText={setTime} />
              <Text>Reminder details:</Text>
              <TextInput
                style={[styles.input, styles.largeInput]}
                value={details}
                onChangeText={setDetails}
                multiline
              />
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 251, 247, 0.33)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 350,
    height: 600,
    justifyContent: "center",
    borderColor: "#DF6316",
    borderWidth: 2,
  },
  closemodal: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#DF6316",
    position: "absolute",
    top: -56,
    left: 295,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#DF6316",
    position: "absolute",
    top: 25,
    left: 50,
  },
  saveButton: {
    backgroundColor: "#DF6316",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    position: "absolute",
    top: 505,
    left: 105,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DF6316",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    width: "100%",
  },
  largeInput: {
    height: 201.5,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  radioOption: {
    color: "#d1936b",
    fontSize: 16,
  },
  selectedRadio: {
    color: "#DF6316",
    fontWeight: "bold",
  },
});

export default AddReminderModal;
