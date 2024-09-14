import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import { Accuracy, requestPermissionsAsync, watchPositionAsync } from 'expo-location';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
// const paceGoal = require('./profile.js');
// import paceGoal from './profile.js';
let tempPaceGoal = 5;
let display, levelColour;

const SpeedDisplay = () => {
    const [speed, setSpeed] = useState(null);

    useEffect(() => {
    const getLocation = async () => {
    const { status } = await requestPermissionsAsync();

    if (status === 'granted') {
      const locationSuscription = await watchPositionAsync(
        {
          accuracy: Accuracy.BestForNavigation,
          timeInterval: 1000,
        },
        location => {
          const userSpeed = location.coords.speed;
          setSpeed(userSpeed);
        }
      );

      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
      }
    };
  }
  };

  getLocation();

  }, []);
  if (speed*(50/3)/(tempPaceGoal)*100 > 100) {
    display = 100;
  } else {
    display = speed*(50/3)/(tempPaceGoal)*100;
  }
  if (display < 25) {
    levelColour = '#cc0000';
  } else if (display < 50) {
    levelColour = '#e69138';
  } else if (display < 75) {
    levelColour = '#f1c232'
  } else  {
    levelColour = '#6aa84f';
  }

  return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  {speed !== null ? (
  <Text>User's Speed: {speed} m/s</Text>
  ) : (
  <Text>Loading...</Text>
  )}
  <View style={{transform: [{rotateZ:'180deg'}]} }>
  <AnimatedCircularProgress
        size={120}
        width={15}
        fill={display}
        tintColor= {levelColour}
        backgroundColor="#FFF" />
  </View>
  <TouchableOpacity>
  <Text>Start your jog!</Text>
  <Text></Text>
  </TouchableOpacity>
  </View>);
}

export default SpeedDisplay;