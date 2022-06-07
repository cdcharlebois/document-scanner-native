import { Component, createElement } from "react";
import { View } from "react-native";
import Scanner from "react-native-rectangle-scanner";
import PropTypes from "prop-types";

// import { HelloWorld } from "./components/HelloWorld";

export const DocumentScanner = () => {
    console.log(PropTypes);
    const handlePictureTaken = data => {
        console.log(data);
    };

    return (
        <View>
            <Scanner onPictureProcessed={handlePictureTaken} style={{flex: 1}} />
        </View>
    );
};
