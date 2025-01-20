import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import config from '@/config';
import { useLogin } from '../app/auth/LoginContext';


type Reminder = {
  id: string;
  title: string;
  details: string;
  address:{
    name : string, 
    lat: number;
  lng: number;
  } 
  reminderType: 'location' | 'time';
  Time: string;
 
};

type PlacePrediction = {
  description: string;
  place_id: string;
};

type ReminderDetailsProps = {
  reminder: Reminder | null;
  onClose: () => void;
  onSave: (updatedReminder: Reminder) => void;
};

const ReminderDetails: React.FC<ReminderDetailsProps> = ({ reminder, onClose, onSave }) => {
  if (!reminder) return null;

  const [editableReminder, setEditableReminder] = useState(reminder);
  const [prev_address , setprev_address] = useState('');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const { userId ,refreshReminders } = useLogin();
  
   useEffect(() => {
    console.log("edit reminder \n",editableReminder.address.name);
     setprev_address(editableReminder.address.name);
   
     });
  const handleEditChange = (field: keyof Reminder, value: string) => {
    setEditableReminder((prev) => ({ ...prev, [field]: value }));
  };

  const fetchPlaces = async (text: string) => {
    setQuery(text);

    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${config.GOOGLE_API}&language=en`
      );
      const data = await response.json();

      if (data.status === 'OK') {
        setSuggestions(data.predictions);
      } else {
        console.error('Error fetching places:', data);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const handlePlaceSelect = (place: PlacePrediction) => {
    setQuery(place.description);
    setSuggestions([]);
  
    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${config.GOOGLE_API}`
    )
      .then((response) => response.json())
      .then((data) => {
        const { lat, lng } = data.result.geometry.location;
        console.log("data \n", data.result.geometry);
        console.log("place.description \n", place.description);
        setEditableReminder((prev) => ({
          ...prev,
          address: {
            name: place.description,
            lat,
            lng,
          },
        }));
        console.log('editableReminder \n', editableReminder.address.lat);
      })
      .catch((error) => {
        console.error('Error fetching place details:', error);
      });
  };
  

  const handleSave = async () => {
    if (!editableReminder.title || !editableReminder.details) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const url =
        editableReminder.reminderType === 'location'
          ? `${config.SERVER_API}/location-reminders/${editableReminder.id}`
          : `${config.SERVER_API}/time-reminders/${editableReminder.id}`;
      console.log('url : ',url)
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableReminder),
      });
      console.log('json : \n',JSON.stringify(editableReminder))
      if (response.ok) {
        onSave(editableReminder);
        Alert.alert('Success', 'Reminder updated successfully.');
      refreshReminders ();

        onClose();
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to update reminder.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the reminder.');
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Edit Reminder</Text>

        <Text style={styles.InfoTitle}>Title:</Text>
        <TextInput
          style={styles.input}
          value={editableReminder.title}
          onChangeText={(text) => handleEditChange('title', text)}
        />

        {editableReminder.reminderType === 'location' && (
          <>
            <Text style={styles.InfoTitle}>Current Address:</Text>
            <Text style={styles.currentAddress}>{prev_address?prev_address:editableReminder.address.name}</Text>

            <Text style={styles.InfoTitle}>New Address:</Text>
            <TextInput
              style={styles.input}
              placeholder="Search for a location"
              value={query}
              onChangeText={fetchPlaces}
            />
            {suggestions.length > 0 && (
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionRow}
                    onPress={() => handlePlaceSelect(item)}
                  >
                    <Text style={styles.suggestionText}>{item.description}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </>
        )}

        {editableReminder.reminderType === 'time' && (
          <>
            <Text style={styles.InfoTitle}>Time:</Text>
            <TextInput
              style={styles.input}
              value={editableReminder.Time}
              onChangeText={(text) => handleEditChange('Time', text)}
            />
          </>
        )}

        <Text style={styles.InfoTitle}>Details:</Text>
        <TextInput
          style={styles.input}
          value={editableReminder.details}
          onChangeText={(text) => handleEditChange('details', text)}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <FontAwesome name="save" size={24} color="#fff" />
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    height: 500,
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DF6316',
  },
  InfoTitle: {
    fontWeight: 'bold',
    marginVertical: 5,
  },
  currentAddress: {
    color: '#444',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 10,
  },
  suggestionRow: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16df27',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: '#DF6316',
    fontWeight: 'bold',
  },
});

export default ReminderDetails;
