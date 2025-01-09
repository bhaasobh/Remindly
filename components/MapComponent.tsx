import { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { Reminder } from '../models/ReminderModel';
import config from '@/config';

const MapComponent = ({ reminders }: { reminders: Reminder[] }) => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 32.806482,
    longitude: 35.151898,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(
    null
  );

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
    })();
  }, []);

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
          <Marker
            key={reminder.id}
            coordinate={{ latitude: reminder.latitude, longitude: reminder.longitude }}
            pinColor="blue"
            title={reminder.name}
            onPress={() => handleMarkerPress(reminder.latitude, reminder.longitude)}
          />
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
