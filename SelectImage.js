import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
// import * as Sharing from 'expo-sharing';
const Clarifai = require('clarifai');
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uploadToAnonymousFilesAsync from 'anonymous-files';
// import logo from './assets/icon.png';

export default function SelectImage(props) {
  let { image } = props;

  const [selectedImage, setSelectedImage] = useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    }
  };

  if (selectedImage !== null) {
    image = selectedImage.localUri;
  }
  // let colors = data.outputs[0].data.colors;
  // return (
  //   <View style={styles.container}>
  //     <Image
  //       source={{ uri: selectedImage.localUri }}
  //       style={styles.thumbnail}
  //     />
  //     {colors.map((color) => (
  //       <Text
  //         key={color.raw_hex}
  //         style={{
  //           backgroundColor: color.w3c.hex,
  //           color: 'white',
  //           padding: '2%',
  //         }}
  //       >
  //         {color.w3c.name}, {color.w3c.hex}
  //       </Text>
  //     ))}
  //   </View>
  // );

  return (
    <View style={styles.container}>
      {/* <Image
        source={{
          uri: 'https://samples.clarifai.com/metro-north.jpg',
        }}
        style={styles.logo}
      />
      <Text
        style={{
          backgroundColor: color.w3c.hex,
          color: 'white',
          padding: '2%',
        }}
      >
        {color.w3c.name}, {color.w3c.hex}
      </Text> */}

      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Pick a photo</Text>
      </TouchableOpacity>
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
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  instructions: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15,
  },
  button: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});
