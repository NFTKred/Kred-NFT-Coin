var CircleType;

// allowing usage from the browser or CommonJS
if (typeof window !== 'undefined' && window.CircleType) {
	CircleType = window.CircleType;
} else {
	CircleType = require('circletype');
}

function Coin(options) {
	this.image = options.image;

	this.width = options.width || 400;
	this.upperText = options.upperText || '';
	this.lowerText = options.lowerText || '';

	this.backgroundColor = options.backgroundColor || '#FAB832';
	this.textColor = options.textColor || 'rgba(255,255,255,0.8)';

	if (options.container) {
		this.render(options.container);
	}
}

Coin.prototype.render = function(element) {
	var root = document.createElement('div');

	root.className = 'coin-root';
	root.style.width = root.style.height = this.width + 'px';
	root.style.fontSize = (this.width / 10) + 'px';
	root.style.textShadow = getTextShadow(this.width);
	root.style.color = this.textColor;

	root.innerHTML = `
<svg version="1.1" class="coin-background"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	viewBox="0 0 661.005 638.627" enable-background="new 0 0 661.005 638.627"
	xml:space="preserve">
<path fill="${
	cleanAttribute(this.backgroundColor)
}" d="M342.039,0h-23.071C142.805,0,0,142.807,0,318.967c0,176.162,142.806,318.969,318.968,318.969
	c3.863,0,7.705-0.094,11.535-0.23c3.83,0.137,7.671,0.23,11.536,0.23c176.16,0,318.967-142.807,318.967-318.969
	C661.005,142.807,518.199,0,342.039,0z"/>
</svg>

<div class="coin-texture"></div>

<svg class="coin-image" width="100%" height="100%"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    xlink="http://www.w3.org/1999/xlink"
    version="1.1">
	${this.image ? `
		<g>
			<clipPath id="circle">
				<circle cx="50" cy="50" r="50" />
			</clipPath>
		</g>
		<image clip-path="url(#circle)" height="100%"
			width="100%" preserveAspectRatio="xMidYMid slice"
			xlink:href="${cleanAttribute(this.image)}"
		/>
	` : '<circle cx="50" cy="50" r="50" fill="rgba(0,0,0,0.2)" />'}
</svg>

<div class="coin-upper"></div>
<div class="coin-lower"></div>
`;

	element.appendChild(root);

	var textUpper = root.querySelector('.coin-upper');
	var textLower = root.querySelector('.coin-lower');

	textUpper.innerText = this.upperText;
	textLower.innerText = this.lowerText;

	var circleTextUpper = new CircleType(textUpper);
	var circleTextLower = new CircleType(textLower);

	circleTextUpper.radius(this.width / 2.23);
	circleTextLower.radius(this.width / 2.23).dir(-1);

	this.root = root;
};

Coin.prototype.destroy = function () {
	if (this.root) {
		this.root.parentElement.removeChild(this.root);
		this.root = null;
	}
};

function cleanAttribute(attr) {
	return String(attr).replace(/"/g, '');
}

function getTextShadow(width) {
	var y = Math.max(1, width / 300);
	var x = -y;
	var blur = y * 2;
	
	return x + 'px ' + y + 'px ' + blur + 'px rgba(0,0,0,0.5)';
}

if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = Coin;
}
