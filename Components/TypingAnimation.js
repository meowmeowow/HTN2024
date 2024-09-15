import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TypingAnimation = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setInterval(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 60); // Adjust the speed of typing here (in milliseconds)

      return () => clearInterval(timer); // Cleanup timer on unmount or dependency change
    }
  }, [index, text]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{displayedText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200, // Fixed width
    height: 100, // Fixed height
  },
  text: {
    fontSize: 18,
    flexWrap: 'wrap', // Enable text wrapping
    textAlign: 'center'
  },
});

export default TypingAnimation;
