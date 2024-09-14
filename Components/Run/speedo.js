import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, Modal,TouchableOpacity } from 'react-native';
import { Accuracy, requestPermissionsAsync, watchPositionAsync } from 'expo-location';
import SetGoal from './setGoal';

const SpeedDisplay = ({ updateRunningMetrics }) => {
  const [speed, setSpeed] = useState(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef(null); // Ref to store interval timer
  const date = 'Sat Sep 14';
  const [avgspeed, setAvgSpeed] = useState(0);

  const onRunningMetricsLog = () => {
    updateRunningMetrics({
      speed,
      avgspeed,
      date,
      goal,
    });
  };

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await requestPermissionsAsync();
      if (status === 'granted') {
        const locationSubscription = await watchPositionAsync(
          {
            accuracy: Accuracy.BestForNavigation,
            timeInterval: 1000,
          },
          (location) => {
            const userSpeed = location.coords.speed;
            setSpeed(userSpeed);
            setAvgSpeed(avgspeed + speed);
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
        setElapsedTime((prevTime) => prevTime + 1);
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
    setShowModal(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };
  const hideModal = () => {
    setShowModal(false);
  };
  return (
    <View style={styles.container}>
      <SetGoal />
      <View style={{position: 'absolute', alignSelf: 'center'}}>
        <Text style={{ textAlign: 'center' }}>User's Speed: {Math.round(speed * 10) / 10} m/s</Text>
        <Text style={{ textAlign: 'center' }}>Time: {formatTime(elapsedTime)}</Text>

        {!running ? (
          <Button style={styles.button} title="Start Run" onPress={startRun} />
        ) : paused ? (
          <>
            <Button style={styles.button} title="Resume Run" onPress={resumeRun} />
            <Button style={styles.button} title="Stop Run" onPress={stopRun} />
          </>
        ) : (
          <>
            <Button style={styles.button} title="Pause Run" onPress={pauseRun} />
            <Button style={styles.button} title="Stop Run" onPress={stopRun} />
          </>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Run Stopped!</Text>
          <Button title="Log today's jog?" onPress={hideModal} />
          <Text style={{ color: 'white' }} onPress={hideModal}>Exit</Text>
        </View>
      </Modal>
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
  button: {
    borderRadius: 5,
    width: 20,
    padding: 10, // Adjust the padding as needed
    height: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    fontSize: 20,
    color: '#fff',
  },
});

export default SpeedDisplay;