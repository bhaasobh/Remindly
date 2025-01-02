import { Text, View, StyleSheet, Button } from 'react-native';
import  RootLayout  from '../../app/_layout';





export default function AboutScreen({isLoginComplete, setIsLoginComplete}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About screen</Text>
      <View style={styles.logoutContainer}>
              <Button title="Logout"  />
            </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  logoutContainer: {
   
    bottom: 0,
    right: 20,
  },
});
