## DocumentScanner
Mendix wrapper around [https://github.com/HarvestProfit/react-native-rectangle-scanner](https://github.com/HarvestProfit/react-native-rectangle-scanner)

## Features
[feature highlights]

## Usage
[step by step instructions]

## Demo project
[link to sandbox]

## Issues, suggestions and feature requests
[link to GitHub issues]

## Development and contribution

1. Install NPM package dependencies by using: `npm install`. If you use NPM v7.x.x, which can be checked by executing `npm -v`, execute: `npm install --legacy-peer-deps`.
1. Run `npm start` to watch for code changes. On every change:
    - the widget will be bundled;
    - the bundle will be included in a `dist` folder in the root directory of the project;
    - the bundle will be included in the `deployment` and `widgets` folder of the Mendix test project.

### Known Development Issue (and Workaround!)
⚠️ if you encounter an error when attempting to build this widget about `prop-types` not being installed, you may need to "trick" the pluggable-widgets-tools into installing it. You can accomplish this by creating either an `/android` or `/ios` folder in `/node_modules/prop-types` and placing any empty file inside, like this:

![image](https://user-images.githubusercontent.com/2905603/175112944-af95f73a-eab5-4278-a98d-cfd6ba3d5b06.png)

