import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Button } from 'react-native';
import { useLogin } from '../auth/LoginContext';
import { useRouter } from 'expo-router';

// רשימה לדוגמה של תזכורות
const reminders = [
  { id: '1', title: 'לקנות חלב' },
  { id: '2', title: 'לשלוח מייל' },
  { id: '3', title: 'תור לרופא' },
];

export default function ProfileScreen() {
  const { setIsLoginComplete } = useLogin();
  const router = useRouter();

  const handleLogout = () => {
    setIsLoginComplete(false);
    router.replace('../pages/login');  // ניתוב למסך התחברות
  };

  const renderReminder = ({ item }: { item: { title: string } }) => (
    <View style={styles.reminderItem}>
      <Text style={styles.reminderText}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/300' }}
        style={styles.profileImage}
      />
      <Text style={styles.userName}>שלום, יוסי כהן</Text>
      
      <Text style={styles.sectionTitle}>התזכורות שלך</Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={renderReminder}
      />

      <View style={styles.logoutContainer}>
        <Button title="התנתק" color="#ff5c5c" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
    marginTop : 70
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  reminderItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  reminderText: {
    fontSize: 16,
  },
  logoutContainer: {
    marginTop: 30,
  },
});
