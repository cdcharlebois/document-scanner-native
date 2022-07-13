import { Component, createElement, useState, useRef } from "react";
import { View, Dimensions, Animated, TouchableOpacity, Platform } from "react-native";
import Scanner, { RectangleOverlay, FlashAnimation } from "react-native-rectangle-scanner";
import { withNavigationFocus } from "react-navigation";
import PropTypes from "prop-types";
console.log(!!PropTypes);

const DocumentScannerComponent = ({ saveImageAction, uriAttribute, uriAttributeUncropped, rectangleCoordsAttribute, isFocused }) => {
    const camera = useRef();
    const [rectangleDetected, setRectangleDetected] = useState(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [flashOpacity] = useState(new Animated.Value(0));

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
        camera.current.capture();
        triggerFlashAnimation();
    };
    const triggerFlashAnimation = () => {
        Animated.sequence([
            Animated.timing(flashOpacity, { toValue: 0.7, duration: 100, useNativeDriver: true }),
            Animated.timing(flashOpacity, { toValue: 0, duration: 50, useNativeDriver: true }),
            Animated.timing(flashOpacity, { toValue: 0.5, delay: 100, duration: 120, useNativeDriver: true }),
            Animated.timing(flashOpacity, { toValue: 0, duration: 90, useNativeDriver: true })
        ]).start();
    };
    // const handlePictureTaken = () => {
    //     //something?
    // };
    const handlePictureProcessed = data => {
        console.warn(JSON.stringify(rectangleDetected));
        uriAttribute.setValue(data.croppedImage);
        uriAttributeUncropped.setValue(data.initialImage);
        rectangleCoordsAttribute.setValue(JSON.stringify(rectangleDetected));
        if (saveImageAction.canExecute && !saveImageAction.isExecuting) {
            saveImageAction.execute();
        }
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
    const handleDeviceSetup = ({ previewHeightPercent, previewWidthPercent }) => {
        // if (Platform.OS === "android") {
        //     const dimensions = Dimensions.get("window");
        //     console.warn(`hpct: ${previewHeightPercent}, wpct: ${previewWidthPercent}`);
        //     setHeight(previewHeightPercent * dimensions.height);
        //     setWidth(previewWidthPercent * dimensions.width);
        // }
    };

    return isFocused ? (
        <TouchableOpacity onPress={takePicture}  style={{ flex: 1, backgroundColor: "rgba(0,0,0,0)", position: "relative" }} onLayout={handleLayoutChange}>
            <Scanner
                onPictureProcessed={handlePictureProcessed}
                style={{ flex: 1 }}
                onRectangleDetected={handleRectangleDetected}
                ref={camera}
                onDeviceSetup={handleDeviceSetup}
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
            <FlashAnimation overlayFlashOpacity={flashOpacity} />
        </TouchableOpacity>
    ) : null;
};
export const DocumentScanner = withNavigationFocus(DocumentScannerComponent);
