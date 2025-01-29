import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Alert, Button, TouchableOpacity } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { useLogin } from "../app/auth/LoginContext";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import config from "@/config";
import AddReminderModal from "./AddReminderModal";


const MapComponent = () => {
  type Reminder = {
    id: string;
    title: string;
    details: string;
    address: string;
    reminderType: 'location' | 'time';
    Time: string;
    lat: number;
    lng: number;
  };
  const [mapRegion, setMapRegion] = useState({
    latitude: 32.806482,
    longitude: 35.151898,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  type Market = {
    id: string;
    name: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  };
  const triggeredReminders = new Set<string>();
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const { reminders, fetchReminders, refreshKey } = useLogin(); // Access refreshKey from context
  const [mapKey, setMapKey] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [nearbyMarkets, setNearbyMarkets] = useState<Market[]>([])
  const [showMarkets, setShowMarkets] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
   const [locationReminders, setLocationReminders] = useState<Reminder[]>([]);

  if (refresh) {
    setRefresh(false);
    fetchReminders();
  }

  useEffect(() => {
    console.log("refresh1");
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

  const handleMarketPress = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setIsModalVisible(true);
  };

  const fetchNearbyMarkets = async () => {
    if (!userLocation) {
      Alert.alert("Error", "User location not found");
      return;
    }

   
    const { latitude, longitude } = userLocation.coords;
    
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&type=supermarket&key=${config.GOOGLE_API}`;

    try {
      const response = await fetch(placesUrl);
      const data = await response.json();

      if (data.results) {
        setNearbyMarkets(data.results);
        console.log("bhbh\n",data.results);
        setShowMarkets(!showMarkets);
      } else {
        Alert.alert("No Markets Found", "Try again later.");
        console.log("bhbh2");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch nearby markets");
    }
  };
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
    console.log("refresh2");
    reminders.forEach((reminder) => {
      if (isWithinRadius(reminder.lat, reminder.lng) && !triggeredReminders.has(reminder.title)) {
        Alert.alert("Reminder", `You are near the reminder ${reminder.title}\nremember to ${reminder.details}`);
        triggeredReminders.add(reminder.title);
      }
    });
    console.log(triggeredReminders);
    fetchReminders();
  }, [userLocation, reminders,refreshKey]);

  useEffect(() => {
    setMapKey(mapKey + 1);
    setRefresh(true);
    fetchReminders();
    console.log('refresh')
  }, [fetchReminders, refreshKey]);

  // Fix: Create a reference for MapView
  const mapRef = useRef<MapView | null>(null);
  const saveReminder = (reminder: Reminder) => {
    setLocationReminders([...locationReminders, reminder]);
    setIsModalVisible(false);
  };
  // Recenter function
  const recenterMap = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  return (
    <View style={styles.MapContainer}>
      {/* ✅ Added ref={mapRef} to MapView */}
      <MapView ref={mapRef} style={styles.map} region={mapRegion}>
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

        {reminders.map(
          (reminder, index) =>
            reminder.lat !== undefined &&
            reminder.lng !== undefined && (
              <React.Fragment key={reminder.id || index}>
                <Marker coordinate={{ latitude: reminder.lat, longitude: reminder.lng }} pinColor="blue" title={reminder.title} />
                <Circle
                  center={{ latitude: reminder.lat, longitude: reminder.lng }}
                  radius={200}
                  strokeWidth={2}
                  strokeColor="rgba(76, 76, 251, 0.5)"
                  fillColor="rgba(101, 165, 255, 0.2)"
                />
              </React.Fragment>
            )
        )}
        {/* ✅ Display Nearby Markets */}
        {showMarkets &&
          nearbyMarkets.map((market, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: market.geometry.location.lat,
                longitude: market.geometry.location.lng,
              }}
              pinColor="green"
              title={market.name}
              onPress={() => handleMarketPress(market.geometry.location.lat, market.geometry.location.lng)}
            />
          ))}

      </MapView>

      
      
      <FontAwesome6 name="location-crosshairs" size={24} color="black" />

      <TouchableOpacity onPress={recenterMap} style={styles.recenterButtonContainer}>
      <FontAwesome6 name="location-crosshairs" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={fetchNearbyMarkets} style={styles.marketButtonContainer}>
        <FontAwesome6 name="store" size={24} color="black" />
      </TouchableOpacity>
      {isModalVisible && (
  <AddReminderModal
    modalVisible={isModalVisible}
    setModalVisible={setIsModalVisible} // ✅ Pass the setter correctly
    onSaveReminder={saveReminder}
  />
)}

    </View>
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  MapContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  recenterButtonContainer: {
    position: "absolute",
    top: 20, // Adjusted for top-left placement
    left: 20, // Adjusted for top-left placement
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 5, // Android shadow effect
    shadowColor: "#000", // iOS shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  marketButtonContainer: {
    position: "absolute",
    top: 80, // Below the "My Location" button
    left: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 5, // Android shadow effect
    shadowColor: "#000", // iOS shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
