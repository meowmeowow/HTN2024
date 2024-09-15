import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Initial affirmations
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

// Settings Component
const Settings = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        title="Positive Affirmations"
        onPress={() => navigation.navigate('Positive Affirmations')}
      />
      <Button
        title="Motivating Affirmations"
        onPress={() => navigation.navigate('Motivating Affirmations')}
      />
    </View>
  );
};

// Motivating Component
const Motivating = () => {
  const [affirmations, setAffirmations] = useState(initialMotivatorList);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAffirmation, setNewAffirmation] = useState('');

  const addAffirmation = () => {
    if (newAffirmation.trim()) {
      setAffirmations([...affirmations, newAffirmation]);
      setNewAffirmation('');
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={affirmations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <Button title="Add Positive Affirmation" onPress={() => setModalVisible(true)} />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Enter new affirmation"
            value={newAffirmation}
            onChangeText={setNewAffirmation}
            style={styles.input}
          />
          <Button title="Add" onPress={addAffirmation} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

// Demotivating Component
const Demotivating = () => {
  const [demotivations, setDemotivations] = useState(initialDemotivatorList);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDemotivation, setNewDemotivation] = useState('');

  const addDemotivation = () => {
    if (newDemotivation.trim()) {
      setDemotivations([...demotivations, newDemotivation]);
      setNewDemotivation('');
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={demotivations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <Button title="Add Motivating Affirmation" onPress={() => setModalVisible(true)} />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Enter new affirmation"
            value={newDemotivation}
            onChangeText={setNewDemotivation}
            style={styles.input}
          />
          <Button title="Add" onPress={addDemotivation} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

// Profile Component with Navigation Stack
const Profile = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Positive Affirmations" component={Motivating} />
      <Stack.Screen name="Motivating Affirmations" component={Demotivating} />
    </Stack.Navigator>
  );
};

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
    width: '80%',
  },
  listContainer: {
    flexGrow: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
});

export default Profile;
