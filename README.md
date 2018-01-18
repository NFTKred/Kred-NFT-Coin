# Coin

A JavaScript widget to handle rendering a coin.

## Usage

javascript`
// pull in CSS
require('coin/src/coin.css');

// pull in module
var Coin = require('coin');

var coin = new Coin({
    // required - root element for the coin
    container: document.getElementById('coin'),

    // required - url of the image in the circle
    image: '../assets/example-cat.jpg',

    // optional - width of the coin
    width: 500,

    // optional - text for upper and lower part of coin
    upperText: 'Coin Title',
    lowerText: '1Kred - 2',

    // optional - default is Gold
    color: 'blue'
});
`
