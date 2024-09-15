import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

const SetGoal = ({ onPaceUpdate }) => {
  // Initialize newPaceGoal with an empty string
  const [newPaceGoal, setNewPaceGoal] = useState('');

  // Convert newPaceGoal to a number when saving
  const handleSaveGoal = () => {
    const goal = parseFloat(newPaceGoal);
    if (!isNaN(goal)) {
      // Notify parent with new goal
      if (onPaceUpdate) {
        onPaceUpdate({ goal });
      }
    }
  };

  // Update the newPaceGoal state when paceGoal is updated externally
  useEffect(() => {
    // Optionally handle updates if paceGoal is passed as a prop
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Enter pace goal'
        value={newPaceGoal}
        onChangeText={setNewPaceGoal}
        keyboardType='numeric'
        onBlur={handleSaveGoal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  input: {
    textAlign: 'center',
    height: 40,
    width: '80%',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});

export default SetGoal;
