import { useState, useEffect } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

interface Reminder {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

const MapComponent = ({ reminders }: { reminders: Reminder[] }) => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 32.806482,
    longitude: 35.151898,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

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
      }
    })();
  }, []);

  const openNavigationApp = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => alert('Unable to open maps'));
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
            onCalloutPress={() => openNavigationApp(reminder.latitude, reminder.longitude)}
          />
        ))}
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
