import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
   
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
         
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
             backgroundColor : 'red',
          },
          default: {},
        }),
      }}>
    
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Personal Items',
          tabBarIcon: ({ color }) => <MaterialIcons name="backpack" size={24} color="black" />,
        }}
      /> 
       <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            // <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
            <MaterialCommunityIcons name="face-man-profile" size={24} color="black" />
          ),
        }}
      />
    
    </Tabs>
  );
}
