import { Component, createElement, useState, useRef } from "react";
import { View } from "react-native";
import Scanner, { RectangleOverlay } from "react-native-rectangle-scanner";
import PropTypes from "prop-types";

export const DocumentScanner = () => {
    
    console.log(PropTypes);
    const [rectangleDetected, setRectangleDetected] = useState(null);
    const boundary = useRef();
    // const camera = useRef();

    const handlePictureTaken = data => {
        console.log("picture taken");
        console.log(data);
    };

    const handleRectangleDetected = ({ detectedRectangle }) => {
        if (!detectedRectangle) return;
        console.log("rectangle detected");
        console.log(detectedRectangle);
        boundary.current.measure((fx, fy, w, h, px, py)=>{
            console.log("py", py);
            console.log("fy", fy);
            setRectangleDetected(detectedRectangle);
        });
        
    };

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
            />
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor:"rgba(0,0,0,0)", position:"relative" }} ref={boundary}>
            <Scanner
                onPictureProcessed={handlePictureTaken}
                style={{ flex: 1 }}
                onRectangleDetected={handleRectangleDetected}
            />
            {renderRectangleOverlay()}
        </View>
    );
};
