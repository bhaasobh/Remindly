import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [firstName, setFirstName] = useState('David');
  const [lastName, setLastName] = useState('Smith');
  const [email, setEmail] = useState('davidsmith@pro');
  const [address, setAddress] = useState('123 Main St, Kyiv, Ukraine');

  const handleNext = () => {
    // פעולה לביצוע בלחיצה על הכפתור
    console.log('Next clicked!');
  };

  return (
    <View style={styles.container}>
      {/* כותרת עליונה */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Entypo name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity>
          <Feather name="more-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* חלק עליון - רקע צבעוני */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>David Smith</Text>
        <Text style={styles.profileLocation}>Kyiv, Ukraine</Text>
      </View>

      {/* טופס */}
      <View style={styles.form}>
        <Text>Your Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
        <Text>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />
        <Text>Your Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <Text>Your Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#DF6316',
    padding: 15,
    paddingTop: 40,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#DF6316', // רקע צבעוני
    paddingVertical: 65,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileLocation: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  form: {
    margin: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});
