import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Existing runs array
const runs = [
    [10, 20, 'Wed Sep 4', 7], // speed, time, date, goal_pace
    [6, 15, 'Thu Aug 22', 7],
    [7, 35, 'Tue Aug 13', 7],
    [20, 60, 'Fri Aug 2', 8],
    [5, 5, 'Sun Jul 16', 8],
    [2, 35, 'Fri Jul 14', 8.5],
    [15, 10, 'Wed Mar 10', 8.5],
  ];

const History = ({ metrics }) => {
  // Ensure metrics is defined and has the correct format
  const additionalRun = [
    metrics.speed || 0,
    metrics.elapsedTime || 0,
    metrics.date || 'Unknown Date',
    metrics.paceGoal || 0
  ];

  // Combine runs array with the additional run
  const allRuns = [...runs];

  const getBackgroundColor = (pace, goalPace) => {
    const lowerThreshold = goalPace * 0.95; // 95% of goal pace
    const upperThreshold = goalPace * 1.05; // 105% of goal pace

    if (pace < lowerThreshold) return '#c8e6c9'; // Green for lower pace
    if (pace >= lowerThreshold && pace <= upperThreshold) return '#fff9c4'; // Yellow for medium pace
    return '#ffcdd2'; // Red for higher pace
  };

  const HistoryComponent = ({ pace, time, date, goalPace }) => {
    const backgroundColor = getBackgroundColor(pace, goalPace);

    return (
      <View style={styles.itemContainer}>
        <View style={[styles.colorSliver, { backgroundColor }]} />
        <View style={styles.itemContent}>
          <View style={styles.flexPace}>
            <View style={styles.paceContainer}>
              <Text style={styles.pace}>{pace}</Text>
              <Text style={styles.units}> Pace {'\n'}(min/km)</Text>
            </View>
            <View style={styles.goalContainer}>
              <Text style={styles.goal}>Goal Pace: {goalPace}</Text>
            </View>
          </View>
          <View style={styles.stuff}>
            <Text style={styles.text}>{time} min  | </Text>
            <Text style={styles.text}>{date}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {allRuns.map((run, index) => (
          <HistoryComponent
            key={index}
            pace={run[0]}
            time={run[1]}
            date={run[2]}
            goalPace={run[3]}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden', // Ensures the sliver color doesn't overflow
    backgroundColor: '#fff',
  },
  colorSliver: {
    width: 12, // Slightly wider sliver for better visibility
    height: '100%',
  },
  itemContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  flexPace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  paceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pace: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  units: {
    fontSize: 14,
    color: '#666',
  },
  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  goal: {
    fontSize: 14,
    color: '#666',
  },
  stuff: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
});

export default History;
