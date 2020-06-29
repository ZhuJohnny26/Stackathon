import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import { Platform, Text, View, TouchableOpacity, Image } from 'react-native';
const Clarifai = require('clarifai');
import * as ImageManipulator from 'expo-image-manipulator';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { styles } from './style';
import { defaultPicData } from './defualtPicData';

class App extends React.Component {
  constructor() {
    super();
    const app = new Clarifai.App({
      apiKey: '82ad3d4ca6da445d89db902db17311ca',
    });
    this.state = {
      colorFinder: app,
      colors: defaultPicData,
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
      let allColors = picked.sort((a, b) => {
        console.log(a.value, ' ', a);
        return a.value - b.value;
      });

      await this.setState({
        hasPermission: null,
        image: photo.uri,
        colors: allColors,
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

      let allColors = picked.sort((a, b) => {
        console.log(a.value, ' ', a);
        return a.value - b.value;
      });

      console.log('>>>>>>: ', allColors);

      await this.setState({ colors: allColors });
    }
  }

  render() {
    const { hasPermission } = this.state;
    if (hasPermission === null) {
      return (
        <View style={styles.veiw}>
          <View style={styles.logo}>
            <Image source={{ uri: this.state.image }} style={styles.image} />
          </View>

          <View style={styles.container}>
            <Text style={styles.title}>Colors</Text>

            <View style={styles.colors}>
              {this.state.colors.map((color, idx) => {
                let size = Math.round(color.value * 100);
                let col = color.w3c.hex;
                let colorHight = 0;
                if (size <= 17) {
                  colorHight = 10 + '%';
                } else if (size > 17 && size <= 40) {
                  colorHight = 15 + '%';
                } else if (size > 40 && size <= 75) {
                  colorHight = 18 + '%';
                } else if (size > 75) {
                  colorHight = 25 + '%';
                }
                size = size + '%';
                const numbers = '012345';
                const numbers1 = '0123';
                const numbers2 = '678';

                let one =
                  numbers.includes(col[1]) &&
                  numbers.includes(col[3]) &&
                  numbers.includes(col[5]);
                let two =
                  numbers.includes(col[1]) &&
                  numbers.includes(col[3]) &&
                  numbers1.includes(col[5]);
                let three =
                  numbers2.includes(col[1]) &&
                  numbers2.includes(col[3]) &&
                  numbers.includes(col[5]);

                let colorOfText = '';
                if (one || two || three) colorOfText = 'white';
                else colorOfText = 'black';
                console.log('hello: ', color.value);

                return (
                  <View
                    key={color.value}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: 430,
                      borderRadius: 4,
                      marginBottom: 2,
                      height: colorHight,
                      backgroundColor: color.w3c.hex,
                      borderColor: '#C3C3D1',
                      borderWidth: 0.2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: 'bold',
                        fontFamily: 'Verdana',
                        marginLeft: 8,
                        color: colorOfText,
                      }}
                    >
                      {color.w3c.name} {color.w3c.hex}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        fontFamily: 'Verdana',
                        marginRight: 8,
                        color: colorOfText,
                      }}
                    >
                      {size}
                    </Text>
                  </View>
                );
              })}
            </View>
            <TouchableOpacity onPress={this.handleClick} style={styles.onClick}>
              <Text
                style={{ fontFamily: 'Verdana', fontSize: 20, color: '#fff' }}
              >
                Chose an image
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.clickToTakeAPic}
              style={styles.onClick}
            >
              <Text
                style={{ fontFamily: 'Verdana', fontSize: 20, color: '#fff' }}
              >
                Click to take a photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: '#DADDE8',
          }}
        >
          <Camera
            ref={(ref) => {
              this.camera = ref;
            }}
            style={styles.camera}
            type={this.state.cameraType}
          />
          <TouchableOpacity
            onPress={this.takePicture}
            style={styles.takePicture}
          >
            <Text
              style={{
                fontFamily: 'Verdana',
                fontSize: 20,
                color: '#DEDFCD',
              }}
            >
              Take a photo
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

export default App;
