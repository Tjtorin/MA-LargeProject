import * as React from 'react';
import { useState } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import { IMAGE_LABELING_API_KEY } from '../hidden/apiKey';
import {Cloudinary, CloudinaryImage} from '@cloudinary/url-gen'
import { image } from '@cloudinary/url-gen/qualifiers/source';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

export default function ScanResultsPage({route, navigation}) {
    const cldInstance = new Cloudinary({cloud: {cloudName: 'dwtp2yub2'}});
    const data = route.params.data;
    const url = data.uri;
    console.log("Recieved picture: " + url);

    // // Make sure I don't accidentally spam the api while updating code :)
    Alert.alert('Confirm', 'Are you sure you want to call the api?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => hostImage()},
    ]); 

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
        .then(response => console.log(response))
        .catch(err => console.error(err));
    };

    return (
       <Image style={styles.image} source={{uri: url}}></Image>
    );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
  },

  image: {
    width: deviceWidth,
    height: deviceHeight
  }
});