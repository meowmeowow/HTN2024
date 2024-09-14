import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Existing runs array
const runs = [
    [10, 45, 'Sat Sep 14', 112], // speed, time, date, goal_pace
    [10, 45, 'Sat Sep 14', 112],
    [10, 45, 'Sat Oct 23', 112]
];

const History = ({ metrics }) => {
    // Ensure metrics is defined and has correct format
    const additionalRun = [
        metrics.speed || 0,
        metrics.elapsedTime || 0,
        metrics.date || 'Unknown Date',
        metrics.paceGoal || 0
    ];

    // Combine runs array with the additional run
    const allRuns = [...runs, additionalRun];

    const HistoryComponent = ({ pace, time, date, goalPace }) => {
        const backgroundColor = pace >= goalPace ? '#FFDDDD' : '#65A06B';
        return (
            <View style={styles.item}>
                <View style={styles.rightRect}>
                    <View style={styles.flexPace}>
                        <View style={styles.paceContainer}>
                            <Text style={styles.Pace}>{pace}</Text>
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
    );
};
const styles = StyleSheet.create({
    flexPace:
    { flexDirection: 'row', 
      justifyContent: 'space-between', 
      fontFamily: 'Inter',
    },

    paceContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Align items vertically in pace container
    },

    paceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline', // Align items vertically within pace container

    },

    stuff: {
        flexDirection: 'row',
    },

    units: {
        fontSize: 12,
        marginLeft: 5,
        opacity: 0.4,
    },

    goal: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    rightRect: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    Pace: {
        fontSize: 50,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    item: {
        padding: 0,
        marginVertical: 8,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#65A06B',
        borderRadius: 5,
    },
    text: {
        fontFamily: 'Poppins-Black',
        padding: 2,
    },
});

export default History;