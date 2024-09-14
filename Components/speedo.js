import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import { Accuracy, requestPermissionsAsync, watchPositionAsync } from 'expo-location';



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


return (
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
{speed !== null ? (
<Text>User's Speed: {speed} m/s</Text>
) : (
<Text>Loading...</Text>
)}
<TouchableOpacity>
<Text>Start your jog!</Text>
<Text></Text>

</TouchableOpacity>
</View>);
};

export default SpeedDisplay;