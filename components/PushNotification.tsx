import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

const PushNotification = ({ title, message }: { title: string; message: string }) => {
  
  const triggerNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: message,
      },
      trigger: null, 
    });
  };

  return (
    <View style={styles.notificationContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
  },
  message: {
    color: 'white',
  },
});

export default PushNotification;
