import { Component, createElement, useState, useRef, useEffect } from "react";
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
    const [previewSize, setPreviewSize] = useState(null);

    useEffect(() => {
        setPreviewSize(getPreviewSize())
    }, [width, height])

    const getPreviewSize = () => {
        const dimensions = Dimensions.get("window");
        const previewHeightPercent = height / dimensions.height;
        const previewWidthPercent = width / dimensions.width;
        const screenRatio = dimensions.height / dimensions.width;

        // console.warn(`Window Height: ${dimensions.height}`)
        // console.warn(`Window Width: ${dimensions.width}`)
        // console.warn(`Screen Ratio: ${screenRatio}`)
        // console.warn(`Layout Height: ${height}`)
        // console.warn(`Layout Width: ${width}`)
        // console.warn(`Layout Height Percent: ${previewHeightPercent}`)
        // console.warn(`Layout Width Percent: ${previewWidthPercent}`)

        

        // We use set margin amounts because for some reasons the percentage values don't align the camera preview in the center correctly.
        const heightMargin = ((1 - previewHeightPercent) * height) / 2;
        
        // android devices need some padding to fix/unskew the camera preview. iOS handles this gracefully, so no margin is needed.
        const expectedWidth = height / screenRatio;
        const widthMargin = Platform.OS === "android" ? (dimensions.width - expectedWidth) / 2 : 0 // changed; function of height to maintain aspect ratio
        // const widthMargin = ((1 - previewWidthPercent) * width) / 2; // original
        
        // console.warn(`Height Margin: ${heightMargin}`)
        // console.warn(`Width Margin: ${widthMargin}`)
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

    return isFocused && previewSize !== null ? (
        <TouchableOpacity onPress={takePicture}  style={{ flex: 1, backgroundColor: "rgba(0,0,0,0)", position: "relative", marginLeft: previewSize.marginLeft, marginRight: previewSize.marginLeft }} onLayout={handleLayoutChange}>
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
                    previewRatio={previewSize}
                    allowDetection={true}
                    // onDetectedCapture={takePicture}
                />
            ) : null}
            <FlashAnimation overlayFlashOpacity={flashOpacity} />
        </TouchableOpacity>
    ) : null;
};
export const DocumentScanner = withNavigationFocus(DocumentScannerComponent);
