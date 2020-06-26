import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '82ad3d4ca6da445d89db902db17311ca'
});

app.models.predict("eeed0b6733a644cea07cf4c60f87ebb7", "https://samples.clarifai.com/metro-north.jpg").then(
    function(response) {
      // do something with response
      console.log(response)
    },
    function(err) {
      // there was an error
    }
  );

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Test</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
