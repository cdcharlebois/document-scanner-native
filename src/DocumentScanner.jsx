import { Component, createElement, useRef } from "react";
import { View } from "react-native";
import Scanner from "react-native-rectangle-scanner";
import PropTypes from "prop-types";

// import { HelloWorld } from "./components/HelloWorld";

export const DocumentScanner = () => {
    console.info("rendered");
    console.info("rendered");
    console.log(PropTypes);

    // const camera = useRef();

    const handlePictureTaken = data => {
        console.log("picture taken");
        console.log(data);
    };

    const handleRectangleDetected = ({detectedRectangle}) => {
        if (!detectedRectangle) return;
        console.log("rectangle detected");
        console.log(detectedRectangle);
    }

    // const onCapture = () => {
    //     camera.current.capture();
    // }

    return ( 
        <View style={{flex:1}}>
            <Scanner onPictureProcessed={handlePictureTaken} style={{flex: 1}} onRectangleDetected={handleRectangleDetected} />
        </View>
    );
};
