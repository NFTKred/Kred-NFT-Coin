var CircleType;

// allowing usage from the browser or CommonJS
if (typeof window !== 'undefined' && window.CircleType) {
	CircleType = window.CircleType;
} else {
	CircleType = require('circletype');
}

function Coin(options) {
	if (!options.image) {
		throw new Error('image is required');
	}

	this.image = options.image;

	this.width = options.width || 400;
	this.upperText = options.upperText || '';
	this.lowerText = options.lowerText || '';

	this.color = options.color || '#FAB832';

	if (options.container) {
		this.render(options.container);
	}
}

Coin.prototype.render = function(element) {
	var root = document.createElement('div');

	root.className = 'coin-root';
	root.style.width = root.style.height = this.width + 'px';
	root.style.fontSize = 36 * this.width / 400 + 'px';

	root.innerHTML = `
<svg version="1.1" class="coin-background"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 661.005 637.936" enable-background="new 0 0 661.005 637.936"
    xml:space="preserve">
    <g>
        <path fill="${
			this.color
		}" d="M342.039,0h-23.071C142.805,0,0,142.807,0,318.967c0,176.162,142.805,318.969,318.967,318.969
            c3.863,0,7.705-0.094,11.535-0.23c3.83,0.137,7.671,0.23,11.536,0.23c176.16,0,318.967-142.807,318.967-318.969
            C661.005,142.807,518.199,0,342.039,0z"/>
    </g>
</svg>

<div class="coin-texture"></div>

<svg class="coin-image" width="100%" height="100%"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    xlink="http://www.w3.org/1999/xlink"
    version="1.1">
    <g>
        <clipPath id="circle">
            <circle cx="50" cy="50" r="50"/>
        </clipPath>
    </g> 
    <image clip-path="url(#circle)" height="100%"
        width="100%" preserveAspectRatio="xMidYMid slice"
        xlink:href="${this.image}"
        />
</svg>

<div class="coin-upper">${this.upperText}</div>
<div class="coin-lower">${this.lowerText}</div>
`;

	element.appendChild(root);

	var textUpper = root.querySelector('.coin-upper');
	var textLower = root.querySelector('.coin-lower');

	var circleTextUpper = new CircleType(textUpper);
	var circleTextLower = new CircleType(textLower);

	circleTextUpper.radius(175 * this.width / 400);
	circleTextLower.radius(175 * this.width / 400).dir(-1);
};

if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = Coin;
}
