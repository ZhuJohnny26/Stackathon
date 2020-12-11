import React from 'react';

import {
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
  Image,
  ViewBase,
} from 'react-native';

function isCharNumber(c) {
  return c >= '0' && c <= '9';
}

const MobileView = (props) => {
  let grayContainerHeight = 400 + props.colors.length * 35;
  return (
    //background
    <View
      style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%'}}
    >

      <View
        style={{

          backgroundColor: 'rgb(126, 248, 242)',
          height: '100%',
          padding: '2%',
          width: '100%',
          marginLeft: '5%',
          marginRight: '5%',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '5%',

        }}
      >
        <Text style={ [
            {
              shadowOpacity: 8,
              shadowRadius: 1,
              shadowOffset: {
                width: 3,
                height: 2
              },

            },
          {fontSize: 20, fontFamily: 'Cochin', color: 'rgb(3, 43, 1)', shadowColor: 'gray', fontWeight: '600', height: '5%', marginTop: '10%'}
          ]}> ColourFinder
        </Text>
        <Image
          source={{ uri: props.image }}
          style={{
            width: '90%',
            height: '32%',
            borderWidth: 2,
            borderColor: 'rgb(69, 46, 46)',
            borderRadius: 10,
          }}
        />
        <View style={{width: '90%',
            height: '40%',
            marginTop: '1%',
            borderWidth: 2,
            borderColor: 'rgb(69, 46, 46)',
            borderRadius: 10,
            padding: '0.8%'}}>
        {props.colors.map((color) =>
          (isCharNumber(color.w3c.hex[1]) ? (
            <View
                  key={color.raw_hex}
                  style={{
                    textAlignVertical: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '9%',
                    backgroundColor: color.w3c.hex,
                    marginBottom: '2%',
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 7,

                  }}
                >
                  <Text
                  style={{color: 'white', fontWeight: '600', margin: 3, marginLeft: 8}}>{color.w3c.name},  {color.w3c.hex}
                  </Text>
                   <Text style={{color: 'white', fontWeight: '600',
                      margin: 3, marginLeft: 8}}> {Math.round(color.value * 100)}%
                   </Text>

            </View>
              ) : (


                <View
                  key={color.raw_hex}
                  style={{
                    width: '100%',
                    height: '9%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    borderColor: 'black',
                    backgroundColor: color.w3c.hex,
                    marginBottom: '2%',
                    borderRadius: 7,

                  }}
                >
                  <Text style={{color: 'black', fontWeight: '600',
                      margin: 3, marginLeft: 8}}>{color.w3c.name},  {color.w3c.hex}
                  </Text>
                  <Text style={{color: 'black', fontWeight: '600',
                      margin: 3, marginLeft: 8}}> {Math.round(color.value * 100)}%
                  </Text>

                </View>
              )))}
        </View>
        <View style={{ flexDirection: 'column',  width: '90%', height: '10%', justifyContent: 'center', marginBottom: '5%'}}>
          <TouchableOpacity
            onPress={props.clickToTakeAPic}
            style={{

              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '43%',
              backgroundColor: 'blue',
              margin: 3,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 12, color: '#fff' }}>CAMERA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={props.handleClick}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '43%',
              backgroundColor: 'blue',
              margin: 3,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 12, color: '#fff', alignItems: 'center' }}>
              SELECT A PHOTO
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MobileView;
