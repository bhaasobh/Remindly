import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import config from '../config';

const SignupComponent = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState(''); // State to store the selected address

  const handleRegister = async () => {
    try {
      const response = await fetch(config.SERVER_API+'/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          address,
        }),
      });
      console.log(response);
      console.log("jhas");
      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Registration successful!');
        onClose(); // Close the modal
      } else {
        Alert.alert('Error', data.message || 'Registration failed!');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred during registration.');
    }
  };

  const handleAddressSelect = (data: any, details: any) => {
    if (details) {
      const fullAddress = data.description;
      setAddress(fullAddress); // Set the selected address
      console.log('Selected Address:', fullAddress);
    } else {
      console.warn('No details available for the selected place.');
      Alert.alert('Error', 'Unable to fetch address details.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Sign Up</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername} // Update username state
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword} // Update password state
          />

          <Text style={styles.label}>Address</Text>
          <GooglePlacesAutocomplete
            placeholder="Search your address"
            minLength={2}
            fetchDetails={true}
            onPress={handleAddressSelect} // Handle address selection
            query={{
              key: 'AIzaSyAp2CByzchy61Z_OQxvuTRRwc3mUInW0RE', // Replace with your API key
              language: 'en',
            }}
            styles={{
              textInput: {
                height: 40,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                paddingHorizontal: 10,
                backgroundColor: '#f9f9f9',
                marginBottom: 20,
              },
            }}
          />

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonSignIn]}
              onPress={handleRegister}>
              <Text style={styles.textStyle}>Sign Up</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    height : '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonSignIn: {
    backgroundColor: '#4CAF50',
  },
  buttonClose: {
    backgroundColor: '#f44336',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SignupComponent;
