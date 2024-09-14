import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
//a

export default function Speedo() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [velocity, setVelocity] = useState(0);   //Use state is the default value of velocity. setVelocity(value) will set velocity to that value. 

  const [subscription, setSubscription] = useState(null);

  const _subscribe = () => {                    //this is to use the lib
    setSubscription(Accelerometer.addListener(setData));
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    Accelerometer.setUpdateInterval(16);     //I think this is 16 ms per accelerator tick
    return () => _unsubscribe();
  }, []);

  useEffect(() => {   //Use effect will run these functions when the page first launches
    setVelocity(velocity + (Math.sqrt(x^2 + y^2)*(x>0 && y>0)? 1: -1)*0.016*9.81);
  }, [x, y]);         //or if you specify an array of "dependency variables" it will run the function

  return ( //this is the actual 'html' or app things- check website to see types of wrappers. {} is like f string in python you can also insert js code here. Everything needs to be wrapped in a view.
    <View style={styles.container}> 
      <Text style={styles.text}>Accelerometer: (in gs where 1g = 9.81 m/s^2) velocity: {velocity}</Text>
      <Text style={styles.text}>x: {x}</Text>
      <Text style={styles.text}>z: {z}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
//Styles are objects with camelcasing
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});