import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, Modal, TouchableOpacity } from 'react-native';
import { Accuracy, requestPermissionsAsync, watchPositionAsync } from 'expo-location';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import axios from 'axios';
import * as Speech from 'expo-speech';
import SetGoal from './setGoal';

const API_URL = 'http://quickdraw.willowmail.com/api/data'; 

const initialMotivatorList = [
  "Wow I love walking my dog in the morning!",
  "I have such good friends",
  "I feel good about myself"
];

const initialDemotivatorList = [
  "Everyone bullies me",
  "That time in 7th grade I came in last in the run",
  "I just broke up with my partner"
];

// Define speed thresholds
const LOW_SPEED_THRESHOLD = 1; // speed below which message is fetched
const HIGH_SPEED_THRESHOLD = 3; // speed above which message is fetched

const SpeedDisplay = ({ updateRunningMetrics }) => {
  const [speed, setSpeed] = useState(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [display, setDisplay] = useState(0);
  const [levelColour, setLevelColour] = useState('gray');
  const [story, setStory] = useState('');
  const [error, setError] = useState('');
  
  const timerRef = useRef(null); // Ref to store interval timer
  const locationSubscriptionRef = useRef(null); // Ref for location subscription
  const date = 'Sat Sep 15';
  const [avgspeed, setAvgSpeed] = useState(0);
  const paceGoal = 5; // Assuming paceGoal is a constant here; you can modify it accordingly

  const fetchText = async (messageType) => {
    try {
      const response = await axios.post(API_URL, { 'message': messageType });
      const fetchedMessage = response.data.message;
      setStory(fetchedMessage);
      Speech.speak(fetchedMessage, { language: 'en' });
    } catch (error) {
      setError('Failed to fetch message.');
      Speech.speak('Error fetching message.', { language: 'en' });
    }
  };

  const logJog = () => {
    updateRunningMetrics(avgspeed / (elapsedTime * 10), elapsedTime, paceGoal, date);
  };

  const handleLogAndHide = () => {
    logJog();
    hideModal();
  };

  const hideModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await requestPermissionsAsync();
      if (status === 'granted') {
        if (locationSubscriptionRef.current) {
          locationSubscriptionRef.current.remove(); // Cleanup any existing subscription
        }
        locationSubscriptionRef.current = await watchPositionAsync(
          {
            accuracy: Accuracy.BestForNavigation,
            timeInterval: 1000,
          },
          (location) => {
            const userSpeed = location.coords.speed**(1.5); // Adjust speed if needed
            setSpeed(userSpeed);
            setAvgSpeed((prevAvgSpeed) => prevAvgSpeed + userSpeed);

            if (!paused) {
              calculateDisplay(userSpeed);

              // Fetch and speak message based on speed
              if (userSpeed < LOW_SPEED_THRESHOLD && running == true) {
                
                fetchText('Can you make a short phrase reminding someone for '+ initialDemotivatorList[Math.floor(Math.random() * initialDemotivatorList.length)]+ "from the perspective of a goose");
              } else if (userSpeed > HIGH_SPEED_THRESHOLD && running == true) {
                fetchText('Can you make a short phrase praising someone for '+ initialMotivatorList[Math.floor(Math.random() * initialMotivatorList.length)]+ "from the perspective of a goose");
              }
            }
          }
        );
      }
    };

    if (running) {
      getLocation();
    } else if (locationSubscriptionRef.current) {
      locationSubscriptionRef.current.remove(); // Cleanup subscription if not running
    }

    // Cleanup subscription on component unmount
    return () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
    };
  }, [running, paused]);

  useEffect(() => {
    if (running && !paused) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
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
    setElapsedTime(0); // Optionally reset the timer
    setShowModal(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const calculateDisplay = (userSpeed) => {
    let tempDisplay = Math.min(userSpeed * (50 / 3) / paceGoal * 100, 100);
    let color;
    if (tempDisplay < 25) {
      color = '#cc0000'; // Red for low
    } else if (tempDisplay < 50) {
      color = '#e69138'; // Yellow for medium
    } else if (tempDisplay < 75) {
      color = '#f1c232'; // Light Yellow
    } else {
      color = '#6aa84f'; // Green for high
    }
    setDisplay(tempDisplay);
    setLevelColour(color);
  };

  return (
    <View style={styles.container}>
      <SetGoal />
      <View style={{ position: 'absolute', alignSelf: 'center' }}>
        <Text style={{ textAlign: 'center' }}>User's Speed: {Math.round(speed * 10) / 10} m/s</Text>
        <Text style={{ textAlign: 'center' }}>Time: {formatTime(elapsedTime)}</Text>
        <View style={{ transform: [{ rotateZ: '180deg' }] }}>
          <AnimatedCircularProgress
            size={120}
            width={15}
            fill={display}
            tintColor={levelColour}
            backgroundColor="#f5f5f5"
          />
        </View>

        {!running ? (
          <TouchableOpacity
            style={styles.button}
            onPress={startRun}
          >
            <Text style={styles.buttonText}>Start Run</Text>
          </TouchableOpacity>
        ) : paused ? (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={resumeRun}
            >
              <Text style={styles.buttonText}>Resume Run</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopRun}
            >
              <Text style={styles.buttonText}>Stop Run</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={pauseRun}
            >
              <Text style={styles.buttonText}>Pause Run</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopRun}
            >
              <Text style={styles.buttonText}>Stop Run</Text>
            </TouchableOpacity>
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
          <View style={{ margin: 20, borderRadius: 10 }}>
            <Button title="Log today's jog?" onPress={handleLogAndHide} />
          </View>
          <Text style={{ color: 'white', top: 50 }} onPress={hideModal}>Exit</Text>
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
    backgroundColor: 'blue',
    padding: 18,
    borderRadius: 10,
    margin: 10,
  },
  stopButton: {
    backgroundColor: 'red',
    padding: 18,
    borderRadius: 10,
    margin: 10,
  },
  buttonText: {
    color: 'white',
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
