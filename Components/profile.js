import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TextInput } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

let paceGoal = 10;
const Stack = createNativeStackNavigator();
``
const DREADFUL_JAMS = {
    PATH: 0,
    NAME: 1,
};

const dread_jams_list = [
    ["path to file", "song2"],
];

const SAVED_MOTIVATOR = {
    DATE: 0,
    TEXT: 1,
};

const motivator_list = [
    [1020202, "amazing"],
];

const FAVORITE_JAMS = {
    PATH: 0,
    NAME: 1,
};

const fav_jams_list = [
    ["path to file", "song 1"],
];

// Profile Component with Navigation Stack
const Profile = ({route}) => {
  const updateGoalPace = (newGoal) => {
    setGoalPace(newGoal);
  };
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Motivators" component={Motivators} />
      <Stack.Screen name="Favorite_Jams" component={Favorite_Jams} />
      <Stack.Screen name="Dreadful_Jams" component={Dreadful_Jams} />
    </Stack.Navigator>
  );
};

// Settings Component
const Settings = ({ navigation }) => {
  

  return (
    <View style={styles.container}>
      <Button title="Motivators" onPress={() => navigation.navigate('Motivators')} />
      <Button title="Favorite Jams" onPress={() => navigation.navigate('Favorite_Jams')} />
      <Button title="Dreadful Jams" onPress={() => navigation.navigate('Dreadful_Jams')} />
    </View>
  );
};

// Motivators Component
const Motivators = () => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>Date: {item[SAVED_MOTIVATOR.DATE]}</Text>
      <Text style={styles.text}>Text: {item[SAVED_MOTIVATOR.TEXT]}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={motivator_list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

// Favorite_Jams Component
const Favorite_Jams = () => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>Path: {item[FAVORITE_JAMS.PATH]}</Text>
      <Text style={styles.text}>Name: {item[FAVORITE_JAMS.NAME]}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={fav_jams_list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

// Dreadful_Jams Component
const Dreadful_Jams = () => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>Path: {item[DREADFUL_JAMS.PATH]}</Text>
      <Text style={styles.text}>Name: {item[DREADFUL_JAMS.NAME]}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dread_jams_list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

// Export the ProfileStack component
export default Profile;

// Styles
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
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});
