import { StatusBar } from 'expo-status-bar';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import {
  StyleSheet,
  Platform,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
const Clarifai = require('clarifai');

class App extends React.Component {
  constructor() {
    super();
    const app = new Clarifai.App({
      apiKey: '82ad3d4ca6da445d89db902db17311ca',
    });
    this.state = {
      colorFinder: app,
      colors: [],
      image:
        'https://image.shutterstock.com/image-photo/white-transparent-leaf-on-mirror-260nw-1029171697.jpg',
    };
    this.handleClick = this.handleClick.bind(this);
    // this.handleChange = this.handleChange.bind(this);
  }
  async handleClick() {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    await this.setState({ image: pickerResult.uri });

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      await this.setState({ image: pickerResult.uri, remoteUri });
    } else {
      await this.setState({ image: pickerResult.uri, remoteUri: null });
    }

    if ((await this.state.image) !== null) {
      let picture = await this.state.image;
      let colors = await this.state.colorFinder.models.predict(
        'eeed0b6733a644cea07cf4c60f87ebb7',
        picture.slice(23)
      );

      let picked = colors.outputs[0].data.colors;
      let color = picked[0];
      console.log(color.w3c.name);
      await this.setState({ colors: picked });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={{ uri: this.state.image }} style={styles.logo} />
        <Text>Text</Text>

        <View style={styles.colorContainer}>
          {this.state.colors.map((color) => (
            <Text
              key={color.raw_hex}
              style={{
                backgroundColor: color.w3c.hex,
                color: 'white',
                padding: '2%',
              }}
            >
              {color.w3c.name}, {color.w3c.hex}
            </Text>
          ))}
        </View>
        <View style={styles.colorContainer}>
          <TouchableOpacity
            onPress={this.handleClick}
            style={{ backgroundColor: 'blue' }}
          >
            <Text style={{ fontSize: 20, color: '#fff' }}>Pick a photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorContainer: {
    display: 'flex',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
});

export default App;
