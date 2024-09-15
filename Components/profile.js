import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Modal,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const Stack = createNativeStackNavigator();

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

// Profile Screen Component
const ProfileScreen = ({ navigation }) => {
  const [profilePhoto, setProfilePhoto] = useState('https://philosophy.utoronto.ca/wp-content/uploads/Michael_Rosenthal_sq_4039-150x150.jpg');
  const [name, setName] = useState('John Doe');
  const [bio, setBio] = useState('This is a short bio.');
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAffirmationType, setSelectedAffirmationType] = useState(null);
  const [newAffirmation, setNewAffirmation] = useState('');
  const [newDemotivation, setNewDemotivation] = useState('');
  const [motivatorList, setMotivatorList] = useState(initialMotivatorList);
  const [demotivatorList, setDemotivatorList] = useState(initialDemotivatorList);

  const addAffirmation = () => {
    if (newAffirmation.trim()) {
      setMotivatorList([...motivatorList, newAffirmation]);
      setNewAffirmation('');
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Affirmation cannot be empty');
    }
  };

  const addDemotivation = () => {
    if (newDemotivation.trim()) {
      setDemotivatorList([...demotivatorList, newDemotivation]);
      setNewDemotivation('');
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Demotivation cannot be empty');
    }
  };

  const renderAffirmationItem = ({ item, index }) => (
    <View style={styles.listItem}>
      <Text style={styles.listText}>{item}</Text>
      <TouchableOpacity
        onPress={() => {
          const updatedList = motivatorList.filter((_, i) => i !== index);
          setMotivatorList(updatedList);
        }}
      >
        <Text style={styles.deleteText}>✖</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDemotivationItem = ({ item, index }) => (
    <View style={styles.listItem}>
      <Text style={styles.listText}>{item}</Text>
      <TouchableOpacity
        onPress={() => {
          const updatedList = demotivatorList.filter((_, i) => i !== index);
          setDemotivatorList(updatedList);
        }}
      >
        <Text style={styles.deleteText}>✖</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
        <TouchableOpacity
          style={styles.changePhotoButton}
          onPress={() => {/* Handle photo change */}}
        >
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Enter your name"
            />
            <TextInput
              value={bio}
              onChangeText={setBio}
              style={[styles.input, styles.bioInput]}
              placeholder="Enter your bio"
              multiline
            />
            <Button title="Save" onPress={() => setIsEditing(false)} />
            <Button title="Cancel" onPress={() => setIsEditing(false)} />
          </View>
        ) : (
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileBio}>{bio}</Text>
            <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
          </View>
        )}
<View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
  <Button
    title="+ Positive motivation"
    onPress={() => {
      setSelectedAffirmationType('positive');
      setModalVisible(true);
    }}
    style={{ padding: 10 }}
  />
  <Button
    title="+ Negative motivation"
    onPress={() => {
      setSelectedAffirmationType('negative');
      setModalVisible(true);
    }}
    style={{ padding: 10, marginLeft: 20 }}
  />
</View>

      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Positive motivation</Text>
        <FlatList
          data={motivatorList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderAffirmationItem}
        />
        <Text style={styles.sectionTitle}>Negative motivation</Text>
        <FlatList
          data={demotivatorList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderDemotivationItem}
        />
      </View>

      {/* Modal for adding new affirmation */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedAffirmationType === 'positive' ? (
              <>
                <TextInput
                  placeholder="Enter new affirmation"
                  value={newAffirmation}
                  onChangeText={setNewAffirmation}
                  style={styles.input}
                />
                <Button title="Add Affirmation" onPress={addAffirmation} />
              </>
            ) : (
              <>
                <TextInput
                  placeholder="+ agressive motivation"
                  value={newDemotivation}
                  onChangeText={setNewDemotivation}
                  style={styles.input}
                />
                <Button title="+ agressive motivation" onPress={addDemotivation} />
              </>
            )}
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// Navigator Component
const ProfileNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  profileContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changePhotoButton: {
    marginBottom: 20,
  },
  changePhotoText: {
    fontSize: 16,
    color: '#007BFF',
  },
  profileDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileBio: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginVertical: 10,
  },
  editContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
    width: '100%',
    backgroundColor: '#fff',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  listItem: {
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  listText: {
    fontSize: 16,
    color: '#333',
  },
  deleteText: {
    fontSize: 16,
    color: '#FF0000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default ProfileNavigator;
