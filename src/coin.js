var CircleType;
var instanceCounter = 1;

// allowing usage from the browser or CommonJS
if (typeof window !== 'undefined' && window.CircleType) {
	CircleType = window.CircleType;
} else {
	CircleType = require('circletype');
}

var requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;

function Coin(options, callback) {
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

	this.animation = options.animation || false;

	this.hasLoaded = false;

	if (options.container) {
		this.render(options.container, callback);
	}
}

Coin.prototype.render = function(element, callback) {
	var root = document.createElement('div');
	var self = this;
	var waitingCount = (this.patternURL ? 1 : 0) + (this.image ? 1 : 0);
	var loadedCount = 0;

	root.className =
		'coin-root ' + (this.animation ? 'animated ' + this.animation : '');

	root.style.width = root.style.height = this.width + 'px';
	root.style.fontSize = this.width / 10 + 'px';
	root.style.color = this.textColor;
	root.style.opacity = 0;

	function onLoad() {
		if (++loadedCount === waitingCount) {
			ready();
		}
	}

	function ready() {
		// render CircleType now, after fontawesome font has (probably) loaded
		var circleTextUpper = new CircleType(textUpper);
		var circleTextLower = new CircleType(textLower);
		var circleTextUpperShadow = new CircleType(textUpperShadow);
		var circleTextLowerShadow = new CircleType(textLowerShadow);

		circleTextUpper.radius(self.width / 2.23);
		circleTextUpperShadow.radius(self.width / 2.23);
		circleTextLower.radius(self.width / 2.23).dir(-1);
		circleTextLowerShadow.radius(self.width / 2.23).dir(-1);

		root.style.opacity = 1;
		self.hasLoaded = true;

		if (callback) {
			callback();
		}
	}

	root.innerHTML =
		getBackgroundSVG(this.color, this.instance) +
		'<div class="coin-texture"></div>' +
		getPatternSVG(
			this.patternURL,
			this.patternColor,
			this.instance,
			onLoad
		) +
		(this.video
			? getCoinVideo(this.video, this.instance)
			: getCoinImage(this.image, this.color, this.instance, onLoad)) +
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

	this.root = root;

	if (waitingCount === 0) {
		ready();
	}
};

Coin.prototype.animate = function () {
	var root = this.root;

	root.className += ' animate ';

	setTimeout(function () {
		root.className = root.className.replace(/ animate /g, '');
	}, 1000);
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
		'<circle cx="51.7" cy="50" r="41" stroke-width="15" fill="transparent" stroke="' +
		color +
		'"/>' +
		'<path d="M 50 1.6 C -16.7 1.6 -16.7 98 50 98 C 5 98 5 1.6 50 1.6" fill="' +
		color +
		'"/>' +
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

function getCoinImage(image, backgroundColor, instance, callback) {
	var preload = new Image();
	preload.onload = callback;
	preload.src = image;

	return (
		'<svg version="1.1" class="coin-image" width="100%" height="100%" ' +
		'viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">' +
		'<circle cx="50" cy="50" r="50" fill="' +
		cleanAttribute(backgroundColor) +
		'" />' +
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
			  '" />'
			: '') +
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

		var doc = new DOMParser().parseFromString(svg, 'application/xml');
		pattern.appendChild(
			pattern.ownerDocument.importNode(doc.documentElement, true)
		);

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

		callback();
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
		'<circle cx="49.8" cy="50" r="42.5" stroke-width="15.3" fill="transparent" stroke="url(#' +
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
	return '0.1px 0.1px 1px rgba(0, 0, 0, 0.7), -1px -1px 1px rgba(255, 255, 255, 0.5)';
}

if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = Coin;
}
