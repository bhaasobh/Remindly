import { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import config from '@/config';
import PushNotification from './PushNotification'; 

interface Reminder {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  text: string;
}

const MapComponent = ({ reminders: initialReminders }: { reminders: Reminder[] }) => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 32.806482,
    longitude: 35.151898,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);

  const GOOGLE_MAPS_API_KEY = config.GOOGLE_API;
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      }
    })();    const data = require('../assets/reminders.json'); 
    setReminders(data);

  }, []);

  useEffect(() => {
    
  }, []);

  const isWithinRadius = (reminderLat: number, reminderLong: number) => {
    if (userLocation) {
      const distance = getDistance(
        { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude },
        { latitude: reminderLat, longitude: reminderLong }
      );
      return distance <= 200; 
    }
    return false;
  };

  const getDistance = (location1: { latitude: number; longitude: number }, location2: { latitude: number; longitude: number }) => {
    const toRadians = (degree: number) => degree * (Math.PI / 180);
    const lat1 = location1.latitude;
    const lon1 = location1.longitude;
    const lat2 = location2.latitude;
    const lon2 = location2.longitude;

    const R = 6371; 
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; 

    return distance;
  };

  useEffect(() => {
    reminders.forEach((reminder) => {
      if (isWithinRadius(reminder.latitude, reminder.longitude)) {
        Alert.alert('Reminder', `You are near ${reminder.name}`);
        <PushNotification title="Reminder" message={`You are near ${reminder.name}`} />;
      }
    });
  }, [userLocation, reminders]);

  const handleMarkerPress = (latitude: number, longitude: number) => {
    setDestination({ latitude, longitude });
  };

  return (
    <View style={styles.MapContainer}>
      <MapView style={styles.map} region={mapRegion}>
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            pinColor="red"
            title="Your Location"
          />
        )}
        {reminders.map((reminder) => (
          <View key={reminder.id}>
            <Marker
              coordinate={{ latitude: reminder.latitude, longitude: reminder.longitude }}
              pinColor="blue"
              title={reminder.name}
              onPress={() => handleMarkerPress(reminder.latitude, reminder.longitude)}
            />
            <Circle
              center={{ latitude: reminder.latitude, longitude: reminder.longitude }}
              radius={200}
              strokeWidth={2}
              strokeColor="rgba(76, 76, 251, 0.5)"
              fillColor="rgba(101, 165, 255, 0.2)"
            />
          </View>
        ))}

        {destination && userLocation && (
          <MapViewDirections
            origin={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            destination={destination}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="blue"
          />
        )}
      </MapView>
    </View>
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  MapContainer: {
    flex: 1,
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
