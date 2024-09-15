import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, Modal, TouchableOpacity, Image } from 'react-native';
import { Accuracy, requestPermissionsAsync, watchPositionAsync } from 'expo-location';
import { Bar as ProgressBar } from 'react-native-progress';
import axios from 'axios';
import * as Speech from 'expo-speech';
import SetGoal from './setGoal';
import TypingAnimation from '../TypingAnimation';
const moodHappy = require('./CoachMood/CoachSmirk.png');
const moodMad = require('./CoachMood/AngryCoach.png');
const moodNeutral = require('./CoachMood/ColdChicken.png');

const potentialSpeech = {
  happyCoach: [
    "Hey! Keep it up!",
    "You're doing great!!",
  ],
  neutralCoach: [
    "I think we can do better than that.",
    "Pick up the pace...",
  ],
  angryCoach: [
    "You makin' fun of me??!?",
    "This is why Jolliver said you were built like a rat.",
  ],
};

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
const LOW_SPEED_THRESHOLD = 0.5; // speed below which message is fetched
const HIGH_SPEED_THRESHOLD = 1.5; // speed above which message is fetched

const SpeedDisplay = ({ updateRunningMetrics }) => {
  const [blab, setBlab] = useState("Another day, another you, let's get going!");
  const [speed, setSpeed] = useState(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [display, setDisplay] = useState(0);
  const [levelColour, setLevelColour] = useState('gray');
  const [story, setStory] = useState('');
  const [error, setError] = useState('');
  const [coachState, setCoachState] = useState(moodNeutral);

  const timerRef = useRef(null); // Ref to store interval timer
  const locationSubscriptionRef = useRef(null); // Ref for location subscription
  const date = 'Sat Sep 15';
  const [avgspeed, setAvgSpeed] = useState(0);
  const paceGoal = 2;

  const fetchText = async (messageType) => {
    try {
      const response = await axios.post(API_URL, { message: messageType });
      const fetchedMessage = response.data.message;
      setStory(fetchedMessage);
      if (running) {
        Speech.speak(fetchedMessage, { language: 'en' });
      }
    } catch (error) {
      setError('Failed to fetch message.');
    }
  };

  const logJog = () => {
    updateRunningMetrics(avgspeed / elapsedTime, elapsedTime, paceGoal, date);
  };

  const handleLogAndHide = () => {
    logJog();
    hideModal();
  };

  const hideModal = () => {
    setShowModal(false);
  };

  const resetValues = () => {
    setSpeed(null);
    setElapsedTime(0);
    setAvgSpeed(0);
    setDisplay(0);
    setLevelColour('gray');
    setStory('');
    setError('');
  };

  const startRun = () => {
    resetValues(); // Reset values for a new run
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
    setShowModal(true);
    resetValues();
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
            const userSpeed = location.coords.speed || 0; // Default to 0 if speed is null
            setSpeed(userSpeed);
            setAvgSpeed((prevAvgSpeed) => prevAvgSpeed + userSpeed);

            if (!paused || running) {
              calculateDisplay(userSpeed);

              // Fetch and speak message based on speed
              if (userSpeed < LOW_SPEED_THRESHOLD && running) {
                fetchText('Can you make a short phrase reminding someone for ' +
                          initialDemotivatorList[Math.floor(Math.random() * initialDemotivatorList.length)] +
                          " from the perspective of a goose in an annoyed tone");
              } else if (userSpeed > HIGH_SPEED_THRESHOLD && running) {
                fetchText('Can you make a short phrase praising someone for ' +
                          initialMotivatorList[Math.floor(Math.random() * initialMotivatorList.length)] +
                          " from the perspective of a goose");
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const calculateDisplay = (userSpeed) => {
    let tempDisplay = Math.min(userSpeed/ paceGoal * 100, 100);
    let color;
    if (tempDisplay < 25) {
      setCoachState(moodMad);
      color = '#cc0000'; // Red for low
    } else if (tempDisplay < 50) {
      color = '#e69138'; // Yellow for medium
      setCoachState(moodNeutral);

    } else if (tempDisplay < 75) {
      setCoachState(moodHappy);

      color = '#f1c232'; // Light Yellow
    } else {
      color = '#6aa84f'; // Green for high
    }
    setDisplay(tempDisplay);
    setLevelColour(color);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Goal Speed (m/s):</Text>
      <SetGoal/>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>User's Speed: {Math.round(speed * 10) / 10} m/s</Text>
        <Text style={styles.statsText}>Time: {formatTime(elapsedTime)}</Text>

        <View style={styles.progressBarContainer}>
          <ProgressBar
            progress={display / 100}
            color={levelColour}
            style={styles.progressBar}
            unfilledColor="#f5f5f5"
          />
        </View>

        <View style={styles.buttonsContainer}>
          {!running ? (
            <TouchableOpacity style={styles.button} onPress={startRun}>
              <Text style={styles.buttonText}>Start Run</Text>
            </TouchableOpacity>
          ) : paused ? (
            <>
              <TouchableOpacity style={styles.button} onPress={resumeRun}>
                <Text style={styles.buttonText}>Resume Run</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stopButton} onPress={stopRun}>
                <Text style={styles.buttonText}>Stop Run</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.button} onPress={pauseRun}>
                <Text style={styles.buttonText}>Pause Run</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stopButton} onPress={stopRun}>
                <Text style={styles.buttonText}>Stop Run</Text>
              </TouchableOpacity>
            </>
          )}
            <Image style={{margin:10, marginTop: 10, paddingBottom:20, width: 200, height:200}} source={coachState}/>
            <TypingAnimation text={blab} />
        </View>
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
          <View style={styles.modalButtonContainer}>
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
  title: {
    textAlign: 'center',
    alignContent: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    position: 'absolute',
    justifyContent: 'center',
  },
  statsText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 5,
  },
  progressBarContainer: {
    width: 40,
    height: 20,
    marginLeft: 30,
    marginVertical: 10,
  },
  progressBar: {
    height: 10,
    width: 170
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  stopButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#FFFFFF',
  },
  modalButtonContainer: {
    margin: 20,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
  },
  storyText: {
    color: 'white',
  },
});

export default SpeedDisplay;
