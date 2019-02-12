# Coin

A library to render a single coin, using JavaScript, CSS, and SVG.

## Installation

You can install into your project using npm:

```
    npm i cryptokred-coin
```

## Usage

```javascript
    // pull in CSS
    require('cryptokred-coin/src/coin.css');

    // pull in module
    var Coin = require('cryptokred-coin');

    var coin = new Coin({
        // required - root element for the coin
        container: document.getElementById('coin'),

        // one of image or video (not both) is required - url of the image or video in the circle
        image: 'assets/example.jpg',
        video: 'assets/example.mp4',

        // optional - width of the coin
        width: 500,

        // optional - text for upper and lower part of coin
        upperText: 'Coin Title',
        lowerText: '1Kred - 2',

        // optional - default is Gold
        color: 'blue',

        // optional - base URL for finding patterns (see images/patterns/*)
        patternBase: 'assets/images/patterns/',

        // optional - pattern file name (excluding .svg extension) to use for coin
        pattern: 'jigsaw',

        // optional - color to use for the coin pattern
        patternColor: 'green'
    });
```
