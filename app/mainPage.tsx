import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';

const mainPage = () => {
    const colorScheme = useColorScheme();
  return (
    
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="about" options={{ title: 'About' }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
  )
}

export default mainPage

const styles = StyleSheet.create({})