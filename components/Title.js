import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Title({title}) {
  return (
    <Text style={styles.title}>{title}</Text>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
  }
});