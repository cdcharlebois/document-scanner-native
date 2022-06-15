import { Component, createElement, useState, useRef } from "react";
import { View, Dimensions } from "react-native";
import Scanner, { RectangleOverlay } from "react-native-rectangle-scanner";
import { withNavigationFocus } from "react-navigation";
import PropTypes from "prop-types";
console.log(!!PropTypes);

const DocumentScannerComponent = ({
    saveImageAction,
    uriAttribute,
    uriAttributeUncropped,
    isFocused
}) => {
    const camera = useRef();
    const [rectangleDetected, setRectangleDetected] = useState(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

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
    };
    // const handlePictureTaken = () => {
    //     //something?
    // };
    const handlePictureProcessed = data => {
        uriAttribute.setValue(data.croppedImage);
        uriAttributeUncropped.setValue(data.initialImage);
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

    return isFocused ? (
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0)", position: "relative" }} onLayout={handleLayoutChange}>
            <Scanner
                onPictureProcessed={handlePictureProcessed}
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
    ) : null;
};
export const DocumentScanner = withNavigationFocus(DocumentScannerComponent);
