import * as React from 'react';
import { View, StyleSheet, Text, Dimensions, Image, useWindowDimensions, Pressable } from 'react-native';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

export let selectedItem = null;

const buttonStyle = (itemName) => {
  return selectedItem == itemName ? styles.buttonSelected : styles.buttonNotSelected;
}

export default function ResultItem({itemName, confidence}) {
  return (
    <Text>{itemName}: {Math.round(((confidence * 100) + Number.EPSILON) * 100) / 100}%</Text>
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
});