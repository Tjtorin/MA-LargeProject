import * as React from 'react';
import {View, StyleSheet, Image, Text, Alert, useWindowDimensions, ScrollView} from 'react-native';
import RenderHtml from 'react-native-render-html';

// https://en.wikipedia.org/api/rest_v1/#/Mobile/getSections

export default function ResultDataPage({route, navigation}) {
    const {width} = useWindowDimensions();
    let originalHtml = route.params.html
    const source = {
        html: originalHtml,
    };

    return (
        <ScrollView style={styles.container}>
            <RenderHtml
                source={source}
                contentWidth={width}
                ignoredDomTags={["meta", "audio", "caption", "video"]}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});