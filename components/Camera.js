import * as React from 'react';
import {View, StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import { useState } from 'react';
import {Camera, CameraType} from 'expo-camera';
import { useNavigation, useIsFocused } from '@react-navigation/native';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

let camera;

export default function Cam() {
    const navigation = useNavigation();
    const [type, setType] = useState(CameraType.back);
    const [ready, setReady] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const isFocused = useIsFocused();

    React.useEffect(() => {
        if (isFocused) {
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

    const toggleCameraType = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const onCameraReady = () => {
        console.log("Camera is ready");
        setCameraReady(true);
    }

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

    const renderCam = () => {
        return (
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
        )
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