// History.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
//a
// Define the SAVED_RUNS object and runs array
const SAVED_RUNS = {
    PACE: 0,
    MILES: 1,
    TIME: 2,
    DATE: 3,
    GOAL_PACE: 4,
};

//for now with no backend connected-> new run is added to this 2d arraylist 
const runs = [
    [82, 423, 912308, 12323, 123],
    [82, 423, 912308, 12323, 123],
    [82, 423, 912308, 12323, 123],
];

const History = () => {
    // Render each run item
    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.text}>Pace: {item[SAVED_RUNS.PACE]}</Text>
            <Text style={styles.text}>Miles: {item[SAVED_RUNS.MILES]}</Text>
            <Text style={styles.text}>Time: {item[SAVED_RUNS.TIME]}</Text>
            <Text style={styles.text}>Date: {item[SAVED_RUNS.DATE]}</Text>
            <Text style={styles.text}>Goal Pace: {item[SAVED_RUNS.GOAL_PACE]}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={runs}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
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
