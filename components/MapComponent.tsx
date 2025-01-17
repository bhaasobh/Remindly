import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { useLogin } from "../app/auth/LoginContext";

const MapComponent = () => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 32.806482,
    longitude: 35.151898,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const { reminders, fetchReminders, refreshKey } = useLogin(); // Access refreshKey from context
  const [mapKey, setMapKey] = useState(0);
  const [refresh, setrefresh] = useState(false); 
  if(refresh)
  {
    console.log("set refreshingg");
    setrefresh(false);
    fetchReminders();
  }
  // Fetch user location on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        Alert.alert("Permission Denied", "Location permission is required to use this feature.");
      }
    })();
  }, []);

 
    
  // Fetch reminders when refreshKey changes
  useEffect(() => {
    console.log("fetching from the map component");
    setMapKey(mapKey+1);
    setrefresh(true);
    fetchReminders();
  }, [fetchReminders, refreshKey]); // Triggered when refreshKey changes

  return (
    <View style={styles.MapContainer}>
      <MapView   style={styles.map} region={mapRegion}>
        {/* User's current location */}
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

        {/* Render reminders */}
        {reminders.map((reminder, index) => (
          reminder.lat !== undefined &&
          reminder.lng !== undefined && (
            <React.Fragment key={reminder.id || index}>
              <Marker
                coordinate={{ latitude: reminder.lat, longitude: reminder.lng }}
                pinColor="blue"
                title={reminder.title}
              />
              <Circle
                center={{ latitude: reminder.lat, longitude: reminder.lng }}
                radius={200}
                strokeWidth={2}
                strokeColor="rgba(76, 76, 251, 0.5)"
                fillColor="rgba(101, 165, 255, 0.2)"
              />
            </React.Fragment>
          )
        ))}
      </MapView>
    </View>
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  MapContainer: {
    flex: 1,
    width: "100%",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
