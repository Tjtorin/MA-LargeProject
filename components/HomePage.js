import { Camera } from 'expo-camera';
import * as React from 'react';
import {View, StyleSheet, Image, SafeAreaView } from 'react-native';

import Cam from './Camera';

export default function HomePage() {
  return (
    <Cam />
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
});