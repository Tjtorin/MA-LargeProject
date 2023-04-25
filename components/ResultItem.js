import * as React from 'react';
import { View, StyleSheet, Text, Dimensions, Image, useWindowDimensions, Pressable } from 'react-native';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

let selectedItem;

export default function ResultItem({itemName, confidence}) {
  const selectItem = () => {
    selectedItem = itemName;
  }

  return (
    <Pressable
      onPress={() => {
        selectItem();
      }}
      style={({pressed}) => [
        {
          backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
        },
        styles.wrapperCustom,
      ]}>
      {({pressed}) => (
          <Text>{itemName}: {Math.round(((confidence * 100) + Number.EPSILON) * 100) / 100}%</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 2,
    margin: 5,
    padding: 5,
    width: deviceWidth / 1.1
  },
  wrapperCustom: {
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
    margin: 5,
    width: deviceWidth / 1.1,
    borderWidth: 2
  },
});