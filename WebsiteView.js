import React from 'react'

import {
    StyleSheet,
    Platform,
    Text,
    View,
    TouchableOpacity,
    Image,
  } from 'react-native';

  function isCharNumber(c){
    return c >= '0' && c <= '9';
  }

const WebsiteView = (props) => {
    return (
          <View style={props.styles.view}>
            <View style={props.styles.logo}>
              <Image
                source={{ uri: props.image }}
                style={{
                  width: 500,
                 height: 400,
                  margin: 5,
                  padding: 2,
                }}
              />
            </View>

            <View style={props.styles.container}>
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
                {props.colors.map((color) => (
                isCharNumber(color.w3c.hex[1]) ? 
                <Text
                  key={color.raw_hex}
                  style={{
                    textAlignVertical: 'center',
                    width: 340,
                    height: 35,
                    backgroundColor: color.w3c.hex,
                    margin: 2,
                    borderRadius: 3,
                    borderColor: 'white',

                    color: 'white',
                  }}
                >
                  {color.w3c.name}, {color.w3c.hex}
                </Text>

                :
                  
                <Text
                key={color.raw_hex}
                style={{
                  textAlignVertical: 'center',
                  width: 340,
                  height: 35,
                  backgroundColor: color.w3c.hex,
                  margin: 2,
                  borderRadius: 3,
                  borderColor: 'black',

                  color: 'black',
                }}
                >
                {color.w3c.name}, {color.w3c.hex}
                </Text>


              ))}
              </View>
              <TouchableOpacity
                onPress={props.handleClick}
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
                onPress={props.clickToTakeAPic}
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
}
{/* <WebsiteView styles={styles} image={this.state.image} colors={this.state.colors} handleClick={this.handleClick} clickToTakeAPic={this.clickToTakeAPic}  /> */}
export default WebsiteView
