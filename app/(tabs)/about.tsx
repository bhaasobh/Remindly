import { Text, View, StyleSheet, Button } from 'react-native';
import { useLogin} from "../auth/LoginContext";




export default function AboutScreen() {
  const { isLoginComplete, setIsLoginComplete } = useLogin();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About screen</Text>
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
