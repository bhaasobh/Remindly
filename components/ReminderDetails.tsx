import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import config from "@/config";

interface Reminder {
  id: string;
  title: string;
  details: string;
  address: string | { name: string; lat: number; lng: number };
  reminderType: "location" | "time";
  Time?: string;
}

type ReminderDetailsProps = {
  reminder: Reminder | null;
  onClose: () => void;
  onSave: (updatedReminder: Reminder) => void;
};

const ReminderDetails: React.FC<ReminderDetailsProps> = ({ reminder, onClose, onSave }) => {
  if (!reminder) {
    return null;
  }

  const [editableReminder, setEditableReminder] = useState(reminder);

  const handleEditChange = (field: keyof Reminder, value: string) => {
    setEditableReminder((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (editableReminder) {
      try {
        const url =
          editableReminder.reminderType === "location"
            ? `${config.SERVER_API}/location-reminders/${editableReminder.id}`
            : `${config.SERVER_API}/time-reminders/${editableReminder.id}`;

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editableReminder),
        });

        const data = await response.json();

        if (response.ok) {
          onSave(editableReminder);
          Alert.alert("Success", "Reminder updated successfully.");
        } else {
          Alert.alert("Error", data.message || "Failed to update reminder.");
        }
      } catch (error) {
        console.error("Error updating reminder:", error);
        Alert.alert("Error", "An error occurred while updating the reminder.");
      }
    }
  };

  const parsedDate = editableReminder.Time ? new Date(editableReminder.Time) : null;
  const formattedTime =
    parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleString() : "No time specified";

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Reminder Details</Text>

        <Text style={styles.InfoTitle}>Title:</Text>
        <TextInput
          style={styles.input}
          value={editableReminder.title}
          onChangeText={(text) => handleEditChange("title", text)}
        />

        {editableReminder.reminderType === "location" && (
          <>
            <Text style={styles.InfoTitle}>Address:</Text>
            {typeof editableReminder.address === "string" ? (
              <Text>{editableReminder.address}</Text>
            ) : (
              <>
                <Text>{editableReminder.address.name}</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) =>
                    handleEditChange("address", {
                      ...(editableReminder.address as any),
                      name: text,
                    })
                  }
                />
              </>
            )}
          </>
        )}

        {editableReminder.reminderType === "time" && (
          <>
            <Text style={styles.InfoTitle}>Time:</Text>
            <TextInput
              style={styles.input}
              value={formattedTime}
              onChangeText={(text) => handleEditChange("Time", text)}
            />
          </>
        )}

        <Text style={styles.InfoTitle}>Details:</Text>
        <TextInput
          style={styles.input}
          value={editableReminder.details}
          onChangeText={(text) => handleEditChange("details", text)}
        />

        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <FontAwesome name="save" size={24} color="#DF6316" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
    height: 450,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#DF6316",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    color: "#DF6316",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  InfoTitle: {
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});

export default ReminderDetails;
