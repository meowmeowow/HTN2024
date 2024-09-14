import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import { Accuracy, requestPermissionsAsync, watchPositionAsync } from 'expo-location';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
const paceGoal = require('./profile.js');


const SpeedDisplay = () => {
    const [speed, setSpeed] = useState(null);

    useEffect(() => {
    const getLocation = async () => {
    const { status } = await requestPermissionsAsync();

    if (status === 'granted') {
      const locationSubscription = await watchPositionAsync(
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

  console.log(paceGoal)
  return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  {speed !== null ? (
  <Text>User's Speed: {speed} m/s</Text>
  ) : (
  <Text>Loading...</Text>
  )}
  <View style={{transform: [{rotateZ:'160deg'}]} }>
  <AnimatedCircularProgress
        size={120}
        width={15}
        fill={speed/paceGoal*60*0.6}
        tintColor="#00e0ff"
        backgroundColor="#FFF" />
  </View>
  <TouchableOpacity>
  <Text>Start your jog!</Text>
  <Text></Text>
  </TouchableOpacity>
  </View>);
}

export default SpeedDisplay;