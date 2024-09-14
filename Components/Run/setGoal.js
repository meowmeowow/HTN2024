import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

const SetGoal = () => {
    const [paceGoal, setPaceGoal] = useState(0.00);
    const [isEditing, setIsEditing] = useState(false);
    const [newPaceGoal, setNewPaceGoal] = useState(paceGoal === 0 ? '' : paceGoal.toString());
  
  const handleSaveGoal = () => {
    const goal = parseFloat(newPaceGoal);
    if (!isNaN(goal)) {
      setPaceGoal(goal);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Enter your pace goal'
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