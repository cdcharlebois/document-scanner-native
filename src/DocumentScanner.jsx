import { Component, createElement } from "react";

import { HelloWorld } from "./components/HelloWorld";

export class DocumentScanner extends Component {
    render() {
        return <HelloWorld name={this.props.yourName} style={this.props.style} />;
    }
}
