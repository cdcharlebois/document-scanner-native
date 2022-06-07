import { Component, createElement } from "react";
import { View } from "react-native";
import Scanner from "react-native-document-scanner";

// import { HelloWorld } from "./components/HelloWorld";

export const DocumentScanner = () => {
    const handlePictureTaken = (data) => {
        console.log(data);
    }

    return (
        <View>
            <Scanner overlayColor={"tomato"} onPictureTaken={handlePictureTaken}/>
        </View>
    )
}
