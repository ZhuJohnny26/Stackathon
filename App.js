import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
const Clarifai = require('clarifai');
import favicon from './assets/favicon.png'

class App extends React.Component{
  constructor(){
    super()
     const app = new Clarifai.App({
    apiKey: '82ad3d4ca6da445d89db902db17311ca'
   });
    this.state = {
      colorFinder: app,
      colors: [],
      image: favicon
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  async handleClick(){
    let colors = await this.state.colorFinder.models.predict("eeed0b6733a644cea07cf4c60f87ebb7", 'https://samples.clarifai.com/metro-north.jpg')
    colors = colors.outputs[0].data.colors
    let color = colors[0]
    console.log(color.w3c.name)
    await this.setState({colors})

  }
  async handleChange(evt){
    this.setState({[evt.target.name]: evt.target.value})
  }
  
  render(){
    
    return (
      <View style={styles.container}>
      <Image source={this.state.image}/>
      <TextInput name="image" onChange={this.handleChange} placeholder="test"></TextInput>
        {/* <Text>{colors[0].w3c.name}</Text> */}
        <View style={styles.colorContainer}>
        {this.state.colors.map(color => (
          <Text style={{backgroundColor:color.w3c.hex, color:'white', padding:'2%'}}>{color.w3c.name}, {color.w3c.hex}</Text>
        ))}
        </View>
        <TouchableOpacity
        onPress={this.handleClick}
        style={{ backgroundColor: 'blue' }}>
        <Text style={{ fontSize: 20, color: '#fff' }}>Pick a photo</Text>
      </TouchableOpacity>
        <StatusBar style="auto" />
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
    display: 'flex'
  }
});

export default App