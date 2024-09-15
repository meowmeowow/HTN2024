import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, Modal, TouchableOpacity } from 'react-native';
import { Accuracy, requestPermissionsAsync, watchPositionAsync } from 'expo-location';
import SetGoal from './setGoal';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
let tempPaceGoal = 5;
let display = 0;
let levelColour = 'gray';
let userSpeed = 0;

function drawProgress() {
  <View style={{transform: [{rotateZ:'180deg'}]} }>
        <AnimatedCircularProgress
        size={120}
        width={15}
        fill={display}
        tintColor= {levelColour}
        backgroundColor="#FFF" />
  </View>
}
drawProgress();

const SpeedDisplay = ({ updateRunningMetrics }) => {
  const [speed, setSpeed] = useState(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef(null); // Ref to store interval timer
  const date = 'Sat Sep 15';
  const [avgspeed, setAvgSpeed] = useState(0);

  const logJog = () => {
    updateRunningMetrics(avgspeed/(elapsedTime*10), elapsedTime, paceGoal, date)
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
            timeInterval: 100,
          },
          (location) => {
            userSpeed = location.coords.speed;
            setSpeed(userSpeed);
            setAvgSpeed(avgspeed + speed);
            if (!paused) {
              const userSpeed = location.coords.speed;
              setSpeed(userSpeed);
              setAvgSpeed((prevAvgSpeed) => prevAvgSpeed + userSpeed);
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

  const hideModal = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <SetGoal />
      <View style={{position: 'absolute', alignSelf: 'center'}}>
        <Text style={{ textAlign: 'center' }}>User's Speed: {Math.round(speed * 10) / 10} m/s</Text>
        <Text style={{ textAlign: 'center' }}>Time: {formatTime(elapsedTime)}</Text>
        <View style={{transform: [{rotateZ:'180deg'}]} }>
        <AnimatedCircularProgress
        size={120}
        width={15}
        fill={display}
        tintColor= {levelColour}
        backgroundColor="#f5f5f5" />
        </View>

        {!running ? (
          <TouchableOpacity
            style={{ backgroundColor: 'blue', padding: 18, borderRadius: 10, margin: 10 }}
            onPress={startRun}
          >
            <Text style={{ color: 'white' }}>Start Run</Text>
          </TouchableOpacity>
        ) : paused ? (
          <>
            <TouchableOpacity
              style={{ backgroundColor: 'blue', padding: 18, borderRadius: 10, margin: 10 }}
              onPress={resumeRun}
            >
              <Text style={{ color: 'white' }}>Resume Run</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'red', padding: 18, borderRadius: 10, margin: 10 }}
              onPress={stopRun}
            >
              <Text style={{ color: 'white' }}>Stop Run</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={{ backgroundColor: 'blue', padding: 18, borderRadius: 10, margin: 10 }}
              onPress={pauseRun}
            >
              <Text style={{ color: 'white' }}>Pause Run</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'red', padding: 18, borderRadius: 10, margin: 10 }}
              onPress={stopRun}
            >
              <Text style={{ color: 'white' }}>Stop Run</Text>
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

function speedChange()  {
  if (userSpeed*(50/3)/(tempPaceGoal)*100 > 100) {
    display = 100;
  } else {
    display = userSpeed*(50/3)/(tempPaceGoal)*100;
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
}

setInterval(function() {
  speedChange();
}, 2000);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
