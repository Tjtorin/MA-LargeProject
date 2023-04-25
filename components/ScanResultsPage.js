import * as React from 'react';
import { useState } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, Alert, FlatList, Pressable } from 'react-native';
import { IMAGE_LABELING_API_KEY } from '../hidden/apiKey';
import {Cloudinary, CloudinaryImage} from '@cloudinary/url-gen'
import { image } from '@cloudinary/url-gen/qualifiers/source';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

import ResultItem from './ResultItem';
import { selectedItem } from './ResultItem';

let resultItemList = [];

// This is to make sure that when the page reloads from updating it's FlatList, it doesn't
// cause the api to call again for no reason.
let previousData = null;
let loading = true;
let currentUpdateFunction = null;

let renderInterval = 0;
export function ReRenderResults() {
  if (currentUpdateFunction) {
    currentUpdateFunction(renderInterval);
    renderInterval++;
  }
}

let selectedResultItem = 0;

export default function ScanResultsPage({route, navigation}) {
    let resultsReady = false;
    let results;

    const data = route.params.data;
    const url = data.uri;

    if (data != previousData) {
      previousData = data;
      loading = true;
      console.log("Received image: " + url);

      // // Make sure I don't accidentally spam the api while updating code :)
      Alert.alert('Confirm', 'Are you sure you want to call the api?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => hostImage()},
      ]); 
    } else {
      loading = false
    }

    const hostImage = () => {
      const source = data.base64;

      if (source) {
        let base64Img = `data:image/jpg;base64,${source}`;
        let apiUrl = 'https://api.cloudinary.com/v1_1/lp-host/image/upload';
        let cloudinaryData = {
          file: base64Img,
          upload_preset: 'ml_default',
        };

        fetch(apiUrl, {
          body: JSON.stringify(cloudinaryData),
          headers: {
            'content-type': 'application/json'
          },
          method: 'POST'
        }).then(async response => {
          console.log("Attempting to upload image");
          let resData = await response.json();
          console.log(resData);
          if (resData.secure_url) {
            console.log("Upload successful");

            labelImage(resData);
          }
        }).catch(err => {
          console.warn("Cannot upload: " + err);
        })
      }
    }

    const labelImage = (imageData) => {
      console.log("Calling image-labeling api");
      const imageURL = imageData.url;

      const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': IMAGE_LABELING_API_KEY,
            'X-RapidAPI-Host': 'image-labeling1.p.rapidapi.com'
        },
        body: `{"url":"${imageURL}"}`
      };
    
      fetch('https://image-labeling1.p.rapidapi.com/img/label', options)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          results = response;
          updateItemList();
        })
        .catch(err => console.error(err));
    };

    const updateItemList = () => {
      console.log("Updating items list")
      resultItemList = [];

      let i = 0;
      for (let item in results) {
        resultItemList.push({
          itemName: item,
          confidence: results[item],
          id: i
        });

        i++
      }

      setSelectedId(selectedResultItem);
    }

    const setSelectedResultItem = (itemId) => {
      selectedResultItem = itemId;
      setSelectedId(itemId);
    }

    const resultButtonStyle = (itemId) => {
      return selectedResultItem == itemId ? styles.resultButtonSelected : styles.resultButtonNotSelected
    }

    const renderItem = ({item}) => (
      <Pressable
        onPress={() => {
          setSelectedResultItem(item.id)
        }}
        style={({pressed}) => [
          resultButtonStyle(item.id)
        ]}>
        {({pressed}) => (
            <ResultItem itemName={item.itemName} confidence={item.confidence}/>
        )}
      </Pressable>
    );

    const [selectedId, setSelectedId] = React.useState(); // Using to re-render FlatList
    currentUpdateFunction = setSelectedId;
    return loading ? (<Text>Loading...</Text>) : (
      <View style={styles.container}>
        <Text style={styles.title}>Object: Confidence %</Text>
        <FlatList
          extraData={selectedId}
          data={resultItemList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />

        <Pressable
          onPress={() => {

          }}
          style={({pressed}) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            },
            styles.getDataButton,
          ]}>
          {({pressed}) => (
              <Text>Get Data</Text>
          )}
        </Pressable>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },

  image: {
    width: deviceWidth,
    height: deviceHeight
  },

  getDataButton: {
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
    margin: 5,
    width: deviceWidth / 1.1,
    borderWidth: 2
  },

  resultButtonSelected: {
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
    margin: 5,
    width: deviceWidth / 1.1,
    borderWidth: 2,
    backgroundColor: 'rgb(210, 230, 255)'
  },

  resultButtonNotSelected: {
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
    margin: 5,
    width: deviceWidth / 1.1,
    borderWidth: 2,
    backgroundColor: 'rgb(255, 255, 255)'
  },
});