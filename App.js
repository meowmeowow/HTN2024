import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import Speedo from './Components/speedo'; // Ensure Speedo is correctly exported
import History from './Components/history'; 
import Profile from './Components/profile'; 

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';




const Tab = createBottomTabNavigator();





const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
      <Tab.Screen
          name="History"
          component={History}
        />
        <Tab.Screen
          name="Run"
          component={Speedo}
          options={{ title: 'Run' }}
        />
                <Tab.Screen
          name="Profile"
          component={Profile}
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App; 
