import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert } from 'react-native';
import config from '@/config';
import { useLogin } from '../app/auth/LoginContext';

interface Reminder {
  name: string;
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  address: string;
  text: string;
  reminderType: 'location' | 'time';
  Time: string;
}

const TimeReminderComponent: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const { userId } = useLogin();
  const triggeredReminders = new Set<string>();

  const fetchReminders = useCallback(async () => {
    try {
      const response = await fetch(config.SERVER_API + '/users/' + userId + '/reminders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        const timeReminders = data.reminders.timeReminders || [];
        setReminders(timeReminders);
        checkReminders(timeReminders);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch reminders.');
      }
    } catch (error) {
      console.error('Error fetching time reminders:', error);
      Alert.alert('Error', 'An error occurred while fetching time reminders.');
    }
  }, [userId]);

  const checkReminders = (reminders: Reminder[]) => {
    const currentTime = new Date();

    reminders.forEach(reminder => {
      const reminderTime = new Date(reminder.Time);
      if (isNaN(reminderTime.getTime())) {
        console.error('Invalid reminder time:', reminder.Time);
        return;
      }

      const timeDifference = reminderTime.getTime() - currentTime.getTime();
      const oneHourInMillis = 60 * 60 * 1000;

      if (timeDifference > 0 && timeDifference <= oneHourInMillis) {
        const isSameDay = currentTime.toDateString() === reminderTime.toDateString();

        if (isSameDay && !triggeredReminders.has(reminder.title)) {
          Alert.alert('Reminder Alert', `Your reminder "${reminder.title}" is in 1 hour!`);
          triggeredReminders.add(reminder.title); // Mark reminder as triggered
        }
      }
    });
    console.log(triggeredReminders);

  };

  useEffect(() => {
    fetchReminders();

    const interval = setInterval(() => {
      fetchReminders(); 
    }, 60000); 

    return () => clearInterval(interval);
  }, [fetchReminders]);

  return (
    <View>
      <Text>Time Reminders Component</Text>
    </View>
  );
};

export default TimeReminderComponent;
