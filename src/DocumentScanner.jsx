import { Component, createElement, useState, useRef } from "react";
import { View, Dimensions } from "react-native";
import Scanner, { RectangleOverlay } from "react-native-rectangle-scanner";
import PropTypes from "prop-types";
console.log(!!PropTypes);



export const DocumentScanner = ({saveImageAction, uriAttribute}) => {
    const camera = useRef();
    const [rectangleDetected, setRectangleDetected] = useState(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [pictureProcessing, setPictureProcessing] = useState(false);

    const getPreviewSize = () => {
        const dimensions = Dimensions.get("window");
        const previewHeightPercent = height / dimensions.height;
        const previewWidthPercent = width / dimensions.width;

        // We use set margin amounts because for some reasons the percentage values don't align the camera preview in the center correctly.
        const heightMargin = ((1 - previewHeightPercent) * dimensions.height) / 2;
        const widthMargin = ((1 - previewWidthPercent) * dimensions.width) / 2;
        if (dimensions.height > dimensions.width) {
            // Portrait
            return {
                height: previewHeightPercent,
                width: previewWidthPercent,
                marginTop: heightMargin,
                marginLeft: widthMargin
            };
        }

        // Landscape
        return {
            width: previewHeightPercent,
            height: previewWidthPercent,
            marginTop: widthMargin,
            marginLeft: heightMargin
        };
    };
    const takePicture = () => {
        if (pictureProcessing) return;
        camera.current.capture();
    };
    const handlePictureTaken = () => {
        setPictureProcessing(true);
    }
    const handlePictureProcessed = data => {
        console.log("picture taken");
        // {"target":17,"croppedImage":"/var/mobile/Containers/Data/Application/BFCECCEC-169C-473E-9197-378DABF7709F/Library/Caches/RNRectangleScanner/C1655241717.jpeg","initialImage":"/var/mobile/Containers/Data/Application/BFCECCEC-169C-473E-9197-378DABF7709F/Library/Caches/RNRectangleScanner/O1655241717.jpeg"}
        console.log(data);
        uriAttribute.setValue(data.croppedImage);
        saveImageAction.execute();
        setPictureProcessing(false);
    };
    const handleRectangleDetected = ({ detectedRectangle }) => {
        if (!detectedRectangle) return;
        setRectangleDetected(detectedRectangle);
    };
    const handleLayoutChange = event => {
        const { width, height } = event.nativeEvent.layout;
        setHeight(height);
        setWidth(width);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0)", position: "relative" }} onLayout={handleLayoutChange}>
            <Scanner
                onPictureProcessed={handlePictureProcessed}
                onPictureTaken={handlePictureTaken}
                style={{ flex: 1 }}
                onRectangleDetected={handleRectangleDetected}
                ref={camera}
            />
            {rectangleDetected ? (
                <RectangleOverlay
                    detectedRectangle={rectangleDetected}
                    backgroundColor="rgba(255,181,6,0.2)"
                    borderColor="tomato"
                    borderWidth="4"
                    previewRatio={getPreviewSize()}
                    allowDetection={true}
                    onDetectedCapture={takePicture}
                />
            ) : null}
        </View>
    );
};
