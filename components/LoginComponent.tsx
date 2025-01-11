import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Modal, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import { LoginProvider, useLogin } from '../app/auth/LoginContext';
import SignupComponent from './SignupComponenet';
import config from '@/config';

const Login = () => {
  
  const { setIsLoginComplete ,setUserId ,userId } = useLogin();
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  const handleLogin = async () => {
    // setIsLoginComplete(true);
    // return
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in both username and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(config.SERVER_API + '/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserId(data.user._id);
        Alert.alert('Success', 'Login successful!');
        
        setIsLoginComplete(true); // Update context state
      } else {
        console.log(data);
        Alert.alert('Error', data.error || 'Login failed!');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginProvider>
      <View style={styles.container}>
        <View style={styles.topBackground} />
        <Image source={require('../assets/images/Logo.png')} style={styles.logo} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenModal}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
        <SignupComponent visible={modalVisible} onClose={handleCloseModal} />

        {loading && (
          <Modal transparent={true} animationType="fade" visible={loading}>
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#DF6316" />
              <Text style={styles.loadingText}>Logging in...</Text>
            </View>
          </Modal>
        )}
      </View>
    </LoginProvider>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  signUpText: {
    color: '#DF6316',
    paddingVertical: 10,
    textDecorationLine: 'underline',
  },
  logo: {
    width: 333,
    height: 247,
    marginBottom: 20,
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
});

export default Login;
