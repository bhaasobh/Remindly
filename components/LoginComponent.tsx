
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import 'react-native-reanimated';
import { LoginProvider, useLogin } from "../app/auth/LoginContext"; // Import LoginContext
import { Button } from 'react-native';
import SignupComponent from './SignupComponenet';

 
const Login = () => {
     const { isLoginComplete, setIsLoginComplete } = useLogin();
     const [modalVisible, setModalVisible] = useState(false); 

     const handleOpenModal = () => setModalVisible(true);
     const handleCloseModal = () => setModalVisible(false);

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
            <Button title="Sign Up" onPress={handleOpenModal} />
            <SignupComponent visible={modalVisible} onClose={handleCloseModal} />
            
          </View>
          
          </LoginProvider>
          
  )
}

export default Login

const styles2 = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonSignIn: {
    backgroundColor: '#4CAF50',
  },
  buttonClose: {
    backgroundColor: '#f44336',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },buttonOpen: {
    backgroundColor: '#F194FF',
  },
});


const styles = StyleSheet.create({
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
    }
  });
  