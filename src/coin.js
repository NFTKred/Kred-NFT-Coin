var instanceCounter = 1;
var patternPromiseCache = {};

function Coin(options, callback) {
	this.instance = instanceCounter++;
	this.image = options.image;
	this.video = options.video;

	this.width = options.width || 400;
	this.upperText = options.upperText || '';
	this.lowerText = options.lowerText || '';

	this.color = options.backgroundColor || '#FAB832';
	this.textColor = options.textColor || this.color;

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
	root.style.opacity = 0;

	function onLoad() {
		if (++loadedCount === waitingCount) {
			ready();
		}
	}

	function ready() {
		root.style.opacity = 1;
		self.hasLoaded = true;

		if (callback) {
			callback();
		}
	}

	root.innerHTML =
		getBackgroundSVG(this.color) +
		'<div class="coin-texture"></div>' +
		getPatternSVG(
			this.patternURL,
			this.patternColor,
			this.instance,
			onLoad
		) +
		(this.video
			? getCoinVideo(this.video)
			: getCoinImage(this.image, this.color, this.instance, onLoad)) +
		getTextSVG(
			this.textColor,
			this.instance
		);

	var textPaths = root.querySelectorAll('textPath');
	textPaths[0].appendChild(document.createTextNode(this.upperText));
	textPaths[1].appendChild(document.createTextNode(this.upperText));
	textPaths[2].appendChild(document.createTextNode(this.lowerText));
	textPaths[3].appendChild(document.createTextNode(this.lowerText));

	textPaths[0].style.fill = textPaths[2].style.fill = this.textColor;

	element.appendChild(root);

	this.root = root;

	if (waitingCount === 0) {
		ready();
	}
};

Coin.prototype.animate = function() {
	var root = this.root;

	root.className += ' animate ';

	setTimeout(function() {
		root.className = root.className.replace(/ animate /g, '');
	}, 1000);
};

Coin.prototype.destroy = function() {
	if (this.root) {
		this.root.parentElement.removeChild(this.root);
		this.root = null;
	}
};

function loadPattern(url, callback) {
	// if promises aren't available, just use ajax directly
	if (typeof Promise === 'undefined') {
		return ajax(url, callback);
	}

	// cache the request to load the pattern as a promise, to reuse across coins
	var promise =
		patternPromiseCache[url] ||
		(patternPromiseCache[url] = new Promise(function(resolve) {
			ajax(url, resolve);
		}));

	// attach the callback to the promise, either new or cached
	promise.then(callback);
}

function ajax(url, callback) {
	var xhr = new XMLHttpRequest(url);
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4 || xhr.status != 200) return;
		callback(xhr.responseText);
	};
	xhr.send();
}

function getBackgroundSVG(color) {
	return (
		'<svg version="1.1" class="coin-background-pattern" width="100%" height="100%" ' +
		'viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">' +
		'<g>' +
		'<circle cx="52" cy="50" r="42.5" stroke-width="11.1" fill="transparent" stroke="' +
		color +
		'"/>' +
		'<path d="M 50 1.9 C -16.7 2 -16.7 98 51.5 98.2 C 3 98 0 6.6 50 2.2" fill="' +
		color +
		'"/>' +
		'</g>' +
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

function getCoinVideo(video) {
	return (
		'<div class="coin-video">' +
		'<video autoplay loop muted playsinline><source src="' +
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

	loadPattern(patternURL, function(svg) {
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
		'<circle cx="49.8" cy="50" r="44.4" stroke-width="11.5" fill="transparent" stroke="url(#' +
		patternID +
		')"/>' +
		'</g>' +
		'</svg>'
	);
}

function cleanAttribute(attr) {
	return String(attr).replace(/"/g, '');
}

function getTextSVG(textColor, instance) {
	var circleID = 'coin-text-circle-' + instance;
	var gradientID = 'coin-text-gradient-' + instance;

	return (
		'<svg version="1.1" class="coin-text" width="100%" height="100%" ' +
		'viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">' +
		'<defs>' +
		// '<radialGradient spreadMethod="pad" gradientTransform="userSpaceOnUse" id="' +
		// gradientID +
		// '">' +
		// '<stop offset="84%" stop-color="#fff" stop-opacity=".1"/>'+
		// '<stop offset="88%" stop-color="#fff" stop-opacity=".4"/>'+
		// '<stop offset="92%" stop-color="#fff" stop-opacity=".1"/>'+
		// '</radialGradient>'+
		'<path id="upper-' +
		circleID +
		'" d="M13,50a39,39 0 1 1 78 0a39 39 0 1 1 -78 0a39 39 0 1 1 78 0a39 39 0 1 1 -78 0"/>' +
		'<path id="lower-' +
		circleID +
		'" d="M7,50a45,45 0 1,0 90,0a45,45 0 1,0 -90,0a45,45 0 1,0 90,0a45,45 0 1,0 -90,0"/>' +
		'</defs>' +
		'<text style="font-size: 8px; text-anchor: middle">' +
		'<textPath xlink:href="#upper-' +
		circleID +
		'" startOffset="62.5%" fill="' + textColor + '">' +
		'</textPath>' +
		'<textPath xlink:href="#upper-' +
		circleID +
		'" startOffset="62.5%" fill="#FFF" fill-opacity="0.1">'+ // style="fill:url(#' + gradientID + ')">' +
		'</textPath>' +
		'<textPath xlink:href="#lower-' +
		circleID +
		'" startOffset="62.5%" fill="' + textColor + '">' +
		'</textPath>' +
		'<textPath xlink:href="#lower-' +
		circleID +
		'" startOffset="62.5%" fill="#FFF" fill-opacity="0.1">'+ // style="fill:url(#' + gradientID + ')">' +
		'</textPath>' +
		'</text>' +
		'</svg>'
	);
}

if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = Coin;
}
