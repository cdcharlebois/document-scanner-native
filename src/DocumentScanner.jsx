import { Component, createElement, useState, useRef } from "react";
import { View, Dimensions } from "react-native";
import Scanner, { RectangleOverlay } from "react-native-rectangle-scanner";
import PropTypes from "prop-types";
console.log(!!PropTypes);


export const DocumentScanner = () => {    
    
    const [rectangleDetected, setRectangleDetected] = useState(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const getPreviewSize = () => {
        const dimensions = Dimensions.get('window');
        const previewHeightPercent = height / dimensions.height;
        const previewWidthPercent = width / dimensions.width;
        
        // We use set margin amounts because for some reasons the percentage values don't align the camera preview in the center correctly.
        const heightMargin = (1 - previewHeightPercent) * dimensions.height / 2;
        const widthMargin = (1 - previewWidthPercent) * dimensions.width / 2;
        if (dimensions.height > dimensions.width) {
          // Portrait
          return {
            height: previewHeightPercent,
            width: previewWidthPercent,
            marginTop: heightMargin,
            marginLeft: widthMargin,
            };
          }
        
          // Landscape
          return {
            width: previewHeightPercent,
            height: previewWidthPercent,
            marginTop: widthMargin,
            marginLeft: heightMargin,
          };
        };

    const handlePictureTaken = data => {
        console.log("picture taken");
        console.log(data);
    };
    const handleRectangleDetected = ({ detectedRectangle }) => {
        if (!detectedRectangle) return;
        setRectangleDetected(detectedRectangle); 
    };

    handleLayoutChange = (event) => {
        const {width, height} = event.nativeEvent.layout
        setHeight(height);
        setWidth(width);
    }

    const renderRectangleOverlay = () => {
        if (!rectangleDetected) return null;

        // {
        //     "topRight": { "y": 1330.0572681427002, "x": 133.67738470435143 },
        //     "topLeft": { "y": 1168.6467218399048, "x": -5.12178341858089 },
        //     "dimensions": { "width": 910, "height": 1560 },
        //     "bottomLeft": { "y": 998.9343523979187, "x": 164.8810277879238 },
        //     "bottomRight": { "y": 1205.8252358436584, "x": 288.4637638926506 }
        //   }
          
        return (
            <RectangleOverlay
                detectedRectangle={rectangleDetected}
                backgroundColor="rgba(255,181,6,0.2)"
                borderColor="tomato"
                borderWidth="4"
                previewRatio={getPreviewSize()}
            />
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor:"rgba(0,0,0,0)", position:"relative" }} onLayout={handleLayoutChange}>
            <Scanner
                onPictureProcessed={handlePictureTaken}
                style={{ flex: 1 }}
                onRectangleDetected={handleRectangleDetected}
            />
            {renderRectangleOverlay()}
        </View>
    );
};
