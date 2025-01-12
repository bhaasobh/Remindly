import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Button } from 'react-native';
import { useLogin } from '../auth/LoginContext';
import { useRouter } from 'expo-router';

// רשימה לדוגמה של תזכורות
const reminders = [
  { id: '1', title: 'Buy milk '},
  { id: '2', title: ' Send an email' },
  { id: '3', title: 'A doctor apointment ' },
];


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

      <Image
        source={{ uri: 'https://i.pravatar.cc/300' }}
        style={styles.profileImage}
      />
      <Text style={styles.userName}>Hi, Bahaa</Text>
      
      <Text style={styles.sectionTitle}>Your reminders</Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={renderReminder}
      />


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
