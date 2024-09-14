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


    const HistoryComponent = ({ pace, kilometers, time, date, goalPace }) => {
        return (
            <View style={styles.item}>
                <View style={styles.rightRect}>
                    <View style={styles.flexPace}>
                        <Text style={styles.Pace}>{pace}</Text>
                        <Text style = {{alignSelf: 'flex-end' }}> pace</Text>
                    </View>
                
                    <Text style={styles.text}>Kilometers: {kilometers}</Text>
                    <Text style={styles.text}>Time: {time} minutes</Text>
                    <Text style={styles.text}>Date: {date}</Text>
                    <Text style={styles.text}>Goal Pace: {goalPace}</Text>
                </View>
            </View>
        );
    };


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
    flexPace:
    { flexDirection: 'row', 
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