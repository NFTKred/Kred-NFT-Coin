var CircleType;
var instanceCounter = 1;

// allowing usage from the browser or CommonJS
if (typeof window !== 'undefined' && window.CircleType) {
	CircleType = window.CircleType;
} else {
	CircleType = require('circletype');
}

var requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;

function Coin(options) {
	this.instance = instanceCounter++;
	this.image = options.image;
	this.video = options.video;

	this.width = options.width || 400;
	this.upperText = options.upperText || '';
	this.lowerText = options.lowerText || '';

	this.color = options.backgroundColor || '#FAB832';

	var patternBase =
		options.patternBase ||
		'https://static.socialos.net/inspinia/html/crypto/images/patterns/';

	this.patternURL = options.pattern
		? patternBase + options.pattern + '.svg'
		: false;
	this.patternColor = options.patternColor || this.color;

	if (options.container) {
		this.render(options.container);
	}
}

Coin.prototype.render = function(element) {
	var root = document.createElement('div');

	root.className = 'coin-root';
	root.style.width = root.style.height = this.width + 'px';
	root.style.fontSize = this.width / 10 + 'px';
	root.style.color = this.textColor;
	root.style.opacity = 0;

	root.innerHTML =
		getBackgroundSVG(this.color, this.instance) +
		'<div class="coin-texture"></div>' +
		getPatternSVG(this.patternURL, this.patternColor, this.instance) +
		(this.video
			? getCoinVideo(this.video, this.instance)
			: getCoinImage(this.image, this.instance)) +
		'<div class="coin-upper-shadow"></div>' +
		'<div class="coin-upper"></div>' +
		'<div class="coin-lower-shadow"></div>' +
		'<div class="coin-lower"></div>';

	element.appendChild(root);

	var textUpper = root.querySelector('.coin-upper');
	var textLower = root.querySelector('.coin-lower');
	var textUpperShadow = root.querySelector('.coin-upper-shadow');
	var textLowerShadow = root.querySelector('.coin-lower-shadow');

	textUpper.innerText = this.upperText;
	textLower.innerText = this.lowerText;
	textUpperShadow.innerText = this.upperText;
	textLowerShadow.innerText = this.lowerText;

	textUpperShadow.style.color = this.color;
	textLowerShadow.style.color = this.color;

	var textShadow = getTextShadow(this.width);
	textUpperShadow.style.textShadow = textShadow;
	textLowerShadow.style.textShadow = textShadow;

	var circleTextUpper = new CircleType(textUpper);
	var circleTextLower = new CircleType(textLower);
	var circleTextUpperShadow = new CircleType(textUpperShadow);
	var circleTextLowerShadow = new CircleType(textLowerShadow);

	circleTextUpper.radius(this.width / 2.23);
	circleTextUpperShadow.radius(this.width / 2.23);
	circleTextLower.radius(this.width / 2.23).dir(-1);
	circleTextLowerShadow.radius(this.width / 2.23).dir(-1);

	this.root = root;

	// give CircleType a chance to process before revealing
	requestAnimationFrame(function() {
		root.style.opacity = 1;
	});
};

Coin.prototype.destroy = function() {
	if (this.root) {
		this.root.parentElement.removeChild(this.root);
		this.root = null;
	}
};

function ajax(url, callback) {
	var xhr = new XMLHttpRequest(url);
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4 || xhr.status != 200) return;
		callback(xhr.responseText);
	};
	xhr.send();
}

function getBackgroundSVG(color, instance) {
	return (
		'<svg version="1.1" class="coin-background-pattern" width="100%" height="100%" ' +
		'viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">' +
		'<g>' +
		'<circle cx="51.7" cy="50" r="37.9" stroke-width="20" fill="transparent" stroke="' +
		color +
		'"/>' +
		'<path d="M 49 2 C -16 2 -16 98 49 98 C 10 98 10 2 49 2" fill="' + color + '"/>' +
		'</g>' +
		'</svg>'
	);
}

function getBackgroundSVGPattern(color) {
	return (
		'<svg version="1.1" class="coin-background" ' +
		'xmlns="http://www.w3.org/2000/svg" ' +
		'xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" ' +
		'viewBox="0 0 661.005 638.627" enable-background="new 0 0 661.005 638.627" ' +
		'xml:space="preserve">' +
		'<path fill="' +
		cleanAttribute(color) +
		'" d="M342.039,0h-23.071C142.805,0,0,142.807,0,318.967c0,176.162,142.806,318.969,318.968,318.969' +
		'c3.863,0,7.705-0.094,11.535-0.23c3.83,0.137,7.671,0.23,11.536,0.23c176.16,0,318.967-142.807,318.967-318.969' +
		'C661.005,142.807,518.199,0,342.039,0z"/>' +
		'</svg>'
	);
}

function getCoinImage(image, instance) {
	return (
		'<svg version="1.1" class="coin-image" width="100%" height="100%" ' +
		'viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">' +
		(image
			? '<g>' +
			  '<clipPath id="circle' +
			  instance +
			  '">' +
			  '<circle cx="50" cy="50" r="50" />' +
			  '</clipPath>' +
			  '</g>' +
			  '<image clip-path="url(#circle' +
			  instance +
			  ')" height="100%" ' +
			  'width="100%" preserveAspectRatio="xMidYMid slice" ' +
			  'xlink:href="' +
			  cleanAttribute(image) +
			  '"/>'
			: '<circle cx="50" cy="50" r="50" fill="rgba(0,0,0,0.2)" />') +
		'</svg>'
	);
}

function getCoinVideo(video, instance) {
	return (
		'<div class="coin-video">' +
		'<video autoplay loop muted><source src="' +
		cleanAttribute(video) +
		'"/></video>' +
		'</div>'
	);
}

function getPatternSVG(patternURL, color, instance, callback) {
	if (!patternURL) {
		return '';
	}

	var patternID = 'coin-pattern-' + instance;

	ajax(patternURL, function(svg) {
		var pattern = document.getElementById(patternID);
		pattern.innerHTML = svg;

		var image = pattern.firstElementChild;

		// set the color on all the pattern svg contents directly
		var paths = image.querySelectorAll('*');
		for (var i = 0; i < paths.length; i++) {
			paths[i].style.fill = color;
		}

		var width = +image.getAttribute('width');
		var height = +image.getAttribute('height');

		var patternWidth = 10,
			patternHeight = 10;

		if (width && height) {
			if (width > height) {
				patternHeight *= height / width;
			} else {
				patternWidth *= width / height;
			}
		}

		pattern.setAttribute('width', patternWidth);
		pattern.setAttribute('height', patternHeight);

		pattern.firstElementChild.setAttribute('width', patternWidth);
		pattern.firstElementChild.setAttribute('height', patternHeight);
	});

	return (
		'<svg version="1.1" class="coin-pattern" width="100%" height="100%" ' +
		'viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">' +
		'<defs>' +
		'<pattern id="' +
		patternID +
		'" patternUnits="userSpaceOnUse">' +
		// SVG contents go in here asynchronously
		'</pattern>' +
		'</defs>' +
		'<g>' +
		'<circle cx="50" cy="50" r="39" stroke-width="20" fill="transparent" stroke="url(#' +
		patternID +
		')"/>' +
		'</g>' +
		'</svg>'
	);
}

function cleanAttribute(attr) {
	return String(attr).replace(/"/g, '');
}

function getTextShadow(width) {
	//var blur = width / 100;

	return '0.2px 0.2px 1px rgba(0, 0, 0, 0.7), -1px -1px 1px rgb(255, 255, 255)';
}

if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = Coin;
}
