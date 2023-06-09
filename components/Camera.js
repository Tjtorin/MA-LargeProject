import * as React from 'react';
import {View, StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import { useState } from 'react';
import {Camera, CameraType} from 'expo-camera';
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

let camera;

export default function Cam() {
    const navigation = useNavigation();
    const [ready, setReady] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const isFocused = useIsFocused();
    const [isVisible, setIsVisible] = useState(false)

    // Only use camera object when on camera screen
    useFocusEffect(
      React.useCallback(() => {
        setIsVisible(true)
  
        return () => {
          setIsVisible(false)
        }
      }, [])
    )

    React.useEffect(() => {
        if (isFocused) {
            setIsVisible(true);

            Camera.getCameraPermissionsAsync().then((permission) => {
                if (!permission.granted) {
                    console.log("Permission not granted to use camera");
            
                    return (<Text>Permission not granted to use camera</Text>);
                } else {
                    setReady(true);
                }
            })
        }
    }, [isFocused]);

    /**
     * called when camera is ready
    */
    const onCameraReady = () => {
        console.log("Camera is ready");
        setCameraReady(true);
    }

    /**
     * takes a picture using the camera object
     */
    const takePicture = () => {
        if (cameraReady && camera) {
            const options = {base64: true, quality: 0.2};
            camera.takePictureAsync(options).then((data) => {
                navigation.navigate("Scan Results", {data: data});
            });
        } else {
            console.log("Attempted to take picture while camera is not ready");
        }
    }

    /**
     * returns camera object to render if screen is open and camera is ready
     * @returns {Camera} - Camera to render
     */
    const renderCam = () => {
        return isVisible ? (
        <Camera 
            style={styles.camera}
            onCameraReady={onCameraReady}
            ref={(r) => camera = r}
        >
            <Pressable 
                onPress={takePicture}
                style={({pressed}) => [
                    {
                      backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                    },
                    styles.takePictureButton,
                ]}
            >
                <Text style={styles.takePictureText}>Take Picture</Text>
            </Pressable>
        </Camera>
        ) : <View></View>
    }

    if (ready) {
        return renderCam();
    } else {
        return (
            <Text style={styles.text}>Loading...</Text>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    camera: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        flexDirection: "column-reverse"
    },

    text: {
        color: "white"
    },

    takePictureButton: {
        marginBottom: deviceHeight / 20,
        padding: 5,
        fontSize: 25,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },

    takePictureText: {
        fontSize: 25,
    }
});