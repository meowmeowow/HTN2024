// History.js
import React, {useState} from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// Define the SAVED_RUNS object and runs array


const History = () => {
    const runs = [
        [10, 4, 60, 120624, 123], // pace, miles, time, date, goal_pace
        [20, 5, 20, 120524, 123],
        [120, 5, 12045, 12056, 123],
    ];


    const HistoryComponent = ({ pace, miles, time, date, goalPace }) => {
        return (
            <View style={styles.item}>
                <Text style={styles.text}>Pace: {pace}</Text>
                <Text style={styles.text}>Miles: {miles}</Text>
                <Text style={styles.text}>Time: {time} minutes</Text>
                <Text style={styles.text}>Date: {date}</Text>
                <Text style={styles.text}>Goal Pace: {goalPace}</Text>
            </View>
        );
    };

    useEffect(() => {
        // Your side effect code here
    }, []); // Empty dependency array since there are no dependencies

    return (
        <View style={styles.container}>
            {runs.map((run, index) => (
                <HistoryComponent
                    key={index}
                    pace={run[0]}
                    miles={run[1]}
                    time={run[2]}
                    date={run[3]}
                    goalPace={run[4]}
                />
            ))}
            
        </View>
    );
};


//edit
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    item: {
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    text: {
        fontSize: 16,
    },
});

export default History;