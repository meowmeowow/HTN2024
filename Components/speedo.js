import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Accuracy, requestPermissionsAsync, watchPositionAsync } from 'expo-location';

const SpeedDisplay = ({ goalSpeed }) => {
  const [speed, setSpeed] = useState(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null); // Ref to store interval timer

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

  useEffect(() => {
    if (running && !paused) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);

      return () => clearInterval(timerRef.current);
    } else {
      clearInterval(timerRef.current);
    }
  }, [running, paused]);

  const startRun = () => {
    setRunning(true);
    setPaused(false);
  };

  const pauseRun = () => {
    setPaused(true);
  };

  const resumeRun = () => {
    setPaused(false);
  };

  const stopRun = () => {
    setRunning(false);
    setPaused(false);
    setElapsedTime(0); 
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <View style={styles.container}>
      {speed !== null ? (
        <Text>User's Speed: {speed} m/s</Text>
      ) : (
        <Text>Loading...</Text>
      )}

      <Text>Time: {formatTime(elapsedTime)}</Text>

      {!running ? (
        <Button title="Start Run" onPress={startRun} />
      ) : paused ? (
        <>
          <Button title="Resume Run" onPress={resumeRun} />
          <Button title="Stop Run" onPress={stopRun} />
        </>
      ) : (
        <>
          <Button title="Pause Run" onPress={pauseRun} />
          <Button title="Stop Run" onPress={stopRun} />
        </>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default SpeedDisplay;
