import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';
import { useLogin } from '../auth/LoginContext';
import config from '../../config';

export default function ProfileScreen() {
  const { userId } = useLogin(); // שימוש בקונטקסט כדי לקבל userId
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    gender: '', // נוסיף gender לפרופיל
  });
  const [loading, setLoading] = useState(true); // מצב טעינה

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${config.SERVER_API}/users/${userId}`);
        const data = await response.json();


        if (response.ok) {
          // עיבוד נתונים לייצוג מחרוזות בלבד
          setUserData({
            firstName: data.username || '',
            lastName: data.lastName || '',
            email: data.email || '',
            address: data.address?.name || '', // שימוש ב-name של address
            gender: data.gender || '', // נוסיף gender
          });
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch user data.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'An error occurred while fetching user data.');
      } finally {
        setLoading(false); // עצירת מצב הטעינה
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DF6316" />
        <Text>Loading your profile...</Text>
      </View>
    );
  }

  // קביעת תמונת פרופיל לפי מגדר
  const profileImageUri =
    userData.gender === 'male'
      ? 'https://randomuser.me/api/portraits/men/1.jpg' // תמונה לגבר
      : userData.gender === 'female'
      ? 'https://randomuser.me/api/portraits/women/1.jpg' // תמונה לאישה
      : 'https://via.placeholder.com/100'; // תמונת ברירת מחדל

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
        <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
        <Text style={styles.profileName}>{`${userData.firstName} ${userData.lastName}`}</Text>
        <Text style={styles.profileLocation}>{userData.address}</Text>
      </View>

      {/* טופס */}
      <View style={styles.form}>
        <Text>Your Name</Text>
        <TextInput style={styles.input} value={userData.firstName} />
        <Text>Last Name</Text>
        <TextInput style={styles.input} value={userData.lastName} />
        <Text>Your Email</Text>
        <TextInput style={styles.input} value={userData.email} />
        <Text>Your Address</Text>
        <TextInput style={styles.input} value={userData.address} />
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
    backgroundColor: '#DF6316',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
