import { Text, View, StyleSheet, Button } from 'react-native';
import { useLogin} from "../auth/LoginContext";
import NotificationApp from '@/components/NotificationApp';




export default function AboutScreen() {
  const { isLoginComplete, setIsLoginComplete } = useLogin();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About screenn</Text>
      <View style={styles.container2}>
        {/* <NotificationApp ></NotificationApp> */}
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container2:{
    height : '50%'
  },
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
