import React from 'react';

import {
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

function isCharNumber(c) {
  return c >= '0' && c <= '9';
}

const MobileView = (props) => {
  let grayContainerHeight = 400 + props.colors.length * 35;
  return (
    //background
    <View
      style={{ alignItems: 'center', justifyContent: 'center', height: 700 }}
    >
      {/* top seperator  */}
      <Text
        style={{
          width: 800,
          backgroundColor: 'white',
          alignSelf: 'flex-start',
          position: 'absolute',
          top: 0,
        }}
      />
      {/* container for the picture, colors, and button */}
      <View
        style={{
          backgroundColor: 'gray',
          width: 340,
          height: grayContainerHeight,
          alignSelf: 'center',
          justifyContent: 'center',
          borderRadius: 3,
        }}
      >
        {/* picture */}
        <Image
          source={{ uri: props.image }}
          style={{
            width: 330,
            height: 300,
            margin: 5,
            padding: 2,
            borderRadius: 3,
          }}
        />
        {props.colors.map((color) =>
          isCharNumber(color.w3c.hex[1]) ? (
            <Text
              key={color.raw_hex}
              style={{
                textAlignVertical: 'center',
                width: 335,
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
          ) : (
            <Text
              key={color.raw_hex}
              style={{
                textAlignVertical: 'center',
                width: 335,
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
          )
        )}
        <View style={{ flexDirection: 'row', width: 400 }}>
          <TouchableOpacity
            onPress={props.clickToTakeAPic}
            style={{
              // flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: 100,
              height: 60,
              backgroundColor: 'blue',
              margin: 2,
              borderRadius: 3,
            }}
          >
            <Text style={{ fontSize: 18, color: '#fff' }}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={props.handleClick}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 100,
              height: 60,
              backgroundColor: 'blue',
              margin: 2,
              borderRadius: 3,
            }}
          >
            <Text style={{ fontSize: 18, color: '#fff', alignItems: 'center' }}>
              Pick a photo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MobileView;
