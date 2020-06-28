import { StatusBar } from 'expo-status-bar';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import {
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
const Clarifai = require('clarifai');
import * as ImageManipulator from 'expo-image-manipulator';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

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
      hasPermission: null,
      type: Camera.Constants.Type.back,
    };
    this.handleClick = this.handleClick.bind(this);
    this.clickToTakeAPic = this.clickToTakeAPic.bind(this);
    this.takePicture = this.takePicture.bind(this);
  }
  async clickToTakeAPic() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    await this.setState({ hasPermission: status === 'granted' });
  }

  async takePicture() {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      console.log(photo.uri);
      let data;
      let encoded;
      if (photo.uri.length < 500) {
        encoded = await ImageManipulator.manipulateAsync(photo.uri, [], {
          base64: true,
        });
        data = encoded.base64;
      } else {
        data = photo.uri.slice(22);
      }
      let colors = await this.state.colorFinder.models.predict(
        'eeed0b6733a644cea07cf4c60f87ebb7',
        data
      );

      let picked = colors.outputs[0].data.colors;
      let color = picked[0];
      console.log(color.w3c.name);

      await this.setState({
        hasPermission: null,
        image: photo.uri,
        colors: picked,
      });
    }
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
    console.log(pickerResult);
    await this.setState({ image: pickerResult.uri });

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      await this.setState({ image: pickerResult.uri, remoteUri });
    } else {
      await this.setState({ image: pickerResult.uri, remoteUri: null });
    }

    if ((await this.state.image) !== null) {
      let picture = await this.state.image;
      let data;
      let encoded;
      if (picture.length < 500) {
        encoded = await ImageManipulator.manipulateAsync(picture, [], {
          base64: true,
        });
        data = encoded.base64;
      } else {
        data = picture.slice(23);
      }

      let colors = await this.state.colorFinder.models.predict(
        'eeed0b6733a644cea07cf4c60f87ebb7',
        data
      );

      let picked = colors.outputs[0].data.colors;
      let color = picked[0];

      console.log(color.w3c.name);
      console.log(picked);
      await this.setState({ colors: picked });
    }
  }

  render() {
    const { hasPermission } = this.state;
    if (hasPermission === null) {
      return (
        <View style={styles.veiw}>
          <View style={styles.logo}>
            <Image
              source={{ uri: this.state.image }}
              style={{
                width: 500,
                height: 400,
                margin: 5,
                padding: 2,
              }}
            />
          </View>

          <View style={styles.container}>
            <Text
              style={{
                flex: 1,
                width: 430,
                height: 25,
                backgroundColor: 'white',
                margin: 10,

                borderBottomColor: '#DBDED7',
                borderBottomWidth: 0.5,
              }}
            >
              Colors
            </Text>
            <View
              style={{
                flex: 5,
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: 430,
                height: 400,
                backgroundColor: '#E4EBDA',
                margin: 10,
                padding: 2,
              }}
            >
              {this.state.colors.map((color) => (
                <Text
                  key={color.raw_hex}
                  style={{
                    textAlignVertical: 'center',
                    width: 430,
                    height: 35,
                    backgroundColor: color.w3c.hex,
                    margin: 2,
                    borderRadius: 3,

                    color: 'white',
                  }}
                >
                  {color.w3c.name}, {color.w3c.hex}
                </Text>
              ))}
            </View>
            <TouchableOpacity
              onPress={this.handleClick}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: 430,
                height: 20,
                backgroundColor: 'blue',
                margin: 10,
                borderRadius: 3,
              }}
            >
              <Text style={{ fontSize: 20, color: '#fff' }}>Pick a photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.clickToTakeAPic}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: 430,
                height: 20,
                backgroundColor: 'blue',
                margin: 10,
                borderRadius: 3,
              }}
            >
              <Text style={{ fontSize: 20, color: '#fff' }}>
                Click to take a picture
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            ref={(ref) => {
              this.camera = ref;
            }}
            style={{ flex: 1 }}
            type={this.state.cameraType}
          />
          <TouchableOpacity
            onPress={this.takePicture}
            style={{ backgroundColor: 'blue' }}
          >
            <Text style={{ fontSize: 20, color: '#fff' }}>
              Click to take a picture
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  veiw: {
    flex: 1,
    flexDirection: 'row',
    width: 1400,
    height: 500,
    alignItems: 'center',
    marginLeft: 30,
  },
  container: {
    flex: 3,
    width: 500,
    height: 500,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    marginLeft: 10,
  },
  logo: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 6,
    width: 400,
    height: 500,
    backgroundColor: '#212A40',
  },
});

export default App;
