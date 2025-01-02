import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import 'react-native-reanimated';
import { LoginProvider } from "./LoginContext";

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();



export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
const [isLoginComplete, setIsLoginComplete] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Hide the splash screen once fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; // Optionally, return a loading indicator here
  }

  if (!isLoginComplete) {
    return (
      

      <LoginProvider>
       <View style={styles.container1}>
            <View style={styles.topBackground} />
            <Image source={require('../assets/images/Logo.png')} style={styles.Logo} />
            <TextInput style={styles.input} placeholder="UserName" />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={() => setIsLoginComplete(true)}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsLoginComplete(true)}>
              <Text style={styles.SignIn}>Sign In</Text>
            </TouchableOpacity>
          </View>
          </LoginProvider>


    );
  }
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ title: 'About' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      
      <StatusBar style="auto" />
    </ThemeProvider>
  );
  
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FF9A5B',
  },
  topBackground: {
    width: '110%',
    height: '100%',
    backgroundColor: '#ffff',
    borderTopLeftRadius: 124,
    borderTopRightRadius: 124,
    position: 'absolute',
    top: '10%',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: 282,
    height: 50,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#DF6316',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#DF6316',
    paddingVertical: 13,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  SignIn: {
    color: '#DF6316',
    paddingVertical: 10,
    textDecorationLine: 'underline',
  },
  Logo: {
    width: 333,
    height: 247,
  },container: {
flex: 1,
justifyContent: 'center',
padding: 16,
},
});
