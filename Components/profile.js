import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { CohereClient } from 'cohere-ai';

// Initialize Cohere client
const cohere = new CohereClient({
    token: "jS97QmL7e6QK3Npdb2Zrv8lqAiWearnOmbHpGyIv",
});

export default function Profile() {
    const [story, setStory] = useState('');

    // Define the speak function
    const speak = () => {
        const thingToSay = 'Hello, this is a test speech!';
        Speech.speak(thingToSay);
    };

    // Fetch a story from Cohere AI
    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await cohere.chat({
                    model: 'command',
                    message: 'Tell me a story in 5 parts!',
                });
                console.log('API Response:', response); // Debugging line
                if (response && response.message) {
                    setStory(response.message);
                } else {
                    throw new Error('Invalid response structure');
                }
            } catch (error) {
                console.error('Error fetching story:', error.message);
                setStory('Failed to load story');
            }
        };

        fetchStory();
    }, []);

    return (
        <View style={styles.container}>
            <Button title="Press to hear some words" onPress={speak} />
            {story ? <Text>{story}</Text> : <Text>Loading story...</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
});
