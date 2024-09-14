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
        return (
            <View style={styles.item}>
                <View style={styles.rightRect}>
                    <View style={styles.flexPace}>
                        <Text style={styles.Pace}>{pace}</Text>
                        <Text style={{ alignSelf: 'flex-end' }}> pace</Text>
                    </View>
                    <Text style={styles.text}>Time: {time} minutes</Text>
                    <Text style={styles.text}>Date: {date}</Text>
                    <Text style={styles.text}>Goal Pace: {goalPace}</Text>
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
    flexPace: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignItems: 'flex-end'
    },
    rightRect: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    Pace: {
        fontSize: 30,
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
        fontFamily: 'Poppins-Black'
    },
});

export default History;
