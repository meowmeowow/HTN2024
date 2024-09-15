import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

const SetGoal = ({ onPaceUpdate }) => {
  const [paceGoal, setPaceGoal] = useState(0.00);
  const [newPaceGoal, setNewPaceGoal] = useState(paceGoal.toString());

  useEffect(() => {
    setNewPaceGoal(paceGoal.toString());
  }, [paceGoal]);

  const handleSaveGoal = () => {
    const goal = parseFloat(newPaceGoal);
    if (!isNaN(goal)) {
      setPaceGoal(goal);
      if (onPaceUpdate) {
        onPaceUpdate({ goal }); // Notify parent with new goal
      }
    }
  };

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
    height: 40,
    width: '80%',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});

export default SetGoal;
