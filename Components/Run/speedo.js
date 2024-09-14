import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Accuracy, requestPermissionsAsync, watchPositionAsync } from 'expo-location';
import SetGoal from './setGoal';
const SpeedDisplay = ({ goalSpeed }) => {
  const [speed, setSpeed] = useState(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null); // Ref to store interval timer
  
  function roundSpeedToNearestTenth(speed) {
    let roundedSpeed = Math.round(speed / 10) * 10;
    
    return roundedSpeed;
}
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

      // Cleanup timer on component unmount or when running stops
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
    setElapsedTime(0); // Optionally reset the timer
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    
    <View style={styles.container}>
      <SetGoal/>
      <View style={{position:'absolute', width: 300}}>
      <View style={{ wordWrap: 'break-word'}}>
        <Text style={{textAlign: 'center' }}>User's Speed: {Math.round(speed * 10) / 10} m/s</Text>
      </View>

        <Text style = {{textAlign: 'center' }}>Time: {formatTime(elapsedTime)}</Text>

        {!running ? (
          <Button style={styles.button} title="Start Run" onPress={startRun} />
        ) : paused ? (
          <>
            <Button style={styles.button} title="Resume Run" onPress={resumeRun} />
            <Button style = {styles.button}title="Stop Run" onPress={stopRun} />
          </>
        ) : (
          <>
            <Button style={styles.button} title="Pause Run" onPress={pauseRun} />
            <Button style={styles.button}title="Stop Run" onPress={stopRun} />
          </>
        )}
            
        </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  middleContainer: {
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: '5',
    width: 20,
    padding: 10, // Adjust the padding as needed
    height: 40,
  }
});

export default SpeedDisplay;
