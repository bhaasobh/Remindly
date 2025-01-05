import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';




const MapComponent = () => {
    const [mapRegion,setMapRegion]= useState({
        latitude:32.806482,
        longitude:35.151898,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

const userLocaion = async ()=>{
    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setMapRegion({
        latitude:location.coords.latitude,
        longitude:location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421});
      //console.log("current location "+location.coords.altitude);

}
userLocaion();

  return (
    <View style={styles.MapContainer}>
           
             <MapView
               style={styles.map}
               region={mapRegion}
             >
               <Marker coordinate={mapRegion} title='Marker'></Marker>
             </MapView>
          
         </View>
  )
}

export default MapComponent

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
})

