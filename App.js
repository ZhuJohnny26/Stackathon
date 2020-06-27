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
import favicon from './assets/favicon.png';
import SelectImage from './SelectImage';

class App extends React.Component {
  constructor() {
    super();
    const app = new Clarifai.App({
      apiKey: '82ad3d4ca6da445d89db902db17311ca',
    });
    this.state = {
      colorFinder: app,
      colors: [],
      image: 'hi',
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.onTouch = this.onTouch.bind(this);
  }
  async handleClick() {
    // let pic =
    // console.log(this.state.image);
    // //   'https://image.shutterstock.com/image-photo/white-transparent-leaf-on-mirror-260nw-1029171697.jpg';
    // let colors = await this.state.colorFinder.models.predict(
    //   'eeed0b6733a644cea07cf4c60f87ebb7',
    //   'https://image.shutterstock.com/image-photo/white-transparent-leaf-on-mirror-260nw-1029171697.jpg'
    // );
    // colors = colors.outputs[0].data.colors;

    // console.log(colors[0].w3c.name);
    // // await this.setState({ colors: picked, color, image: pic });

    // await this.setState({ colors });

    // let openImagePickerAsync = async () => {
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
      console.log(picture.slice(23));
      console.log('Hello');
      // console.log(this.state.remoteUri);
      // console.log('https://anonymousfiles.io/f/blob_pGhFVPk');
      //   'https://image.shutterstock.com/image-photo/white-transparent-leaf-on-mirror-260nw-1029171697.jpg';
      let colors = await this.state.colorFinder.models.predict(
        'eeed0b6733a644cea07cf4c60f87ebb7',
        picture.slice(23)
      );
      console.log('hello');
      let picked = colors.outputs[0].data.colors;
      let color = picked[0];
      console.log(color.w3c.name);
      await this.setState({ colors: picked });
    }
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }
  // async onTouch() {
  //   let colors = await this.state.colorFinder.models.predict(
  //     'eeed0b6733a644cea07cf4c60f87ebb7',
  //     'https://image.shutterstock.com/image-photo/white-transparent-leaf-on-mirror-260nw-1029171697.jpg'
  //   );
  //   let picked = colors.outputs[0].data.colors;
  //   let color = picked[0];
  //   // console.log(color.w3c.name);
  //   await this.setState({ color });
  //   console.log(this.state.image);
  // }

  render() {
    // console.log(this.state.image);
    return (
      <View style={styles.container}>
        <SelectImage image={this.state.image} />
        <Image source={{ uri: this.state.image }} style={styles.logo} />
        {/* <TextInput
          name="image"
          onChange={this.handleChange}
          placeholder="test"
        ></TextInput> */}
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
        {/* <View style={styles.colorContainer}>
          <TouchableOpacity
            onPress={this.onTouch}
            style={{ backgroundColor: 'blue' }}
          >
            <Text style={{ fontSize: 20, color: '#fff' }}>Check colors</Text>
          </TouchableOpacity>
          <StatusBar style="auto" /> */}
        {/* </View> */}
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
