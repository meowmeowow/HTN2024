import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Speedo from './Components/Run/speedo';
import History from './Components/history/history';
import Profile from './Components/profile';


import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; 

const Tab = createBottomTabNavigator();

const App = () => {
  const [metrics, setMetrics] = useState({
    speed: null,
    elapsedTime: 0,
    paceGoal: 0.00,
    date: 'Sat Sep 14',
  });

  const handleMetricsUpdate = (speed, elapsedTime, paceGoal, date) => {
    setMetrics({
      speed,
      elapsedTime,
      paceGoal,
      date
    });
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';  // Person icon for Profile
            } else if (route.name === 'History') {
              iconName = focused ? 'fitness' : 'fitness-outline';  // Running man icon for History
            } else if (route.name === 'Run') {
              iconName = focused ? 'timer' : 'timer-outline';  // Timer icon for Run
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name="History"
          children={(props) => <History {...props} metrics={metrics} />}
        />
        <Tab.Screen
          name="Run"
          options={{ title: 'Run' }}
        >
          {(props) => <Speedo {...props} updateRunningMetrics={handleMetricsUpdate} />}
        </Tab.Screen>
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