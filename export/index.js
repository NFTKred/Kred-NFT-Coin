var page = require('webpage').create();
var system = require('system');
var BASEURL = 'http://127.0.0.1:14634/'

try {
	var options = JSON.parse(system.args[1]);
	var imagePath = system.args[2];
} catch (e) {
	console.log('Usage: npm run export -- "{/* json options */}" output.jpg');
	console.log(system.args);
	phantom.exit();
}

if (options.video) {
    console.log('Video is not supported at this time.');
    phantom.exit();
}

console.log('Exporting to ' + imagePath);

page.viewportSize = {
    width: options.width || 400,
    height: options.width || 400
};

page.onConsoleMessage = function(msg) {
	console.log(msg);
};

page.onError = function(msg, trace) {
	var msgStack = ['ERROR: ' + msg];

	if (trace && trace.length) {
		msgStack.push('TRACE:');
		trace.forEach(function(t) {
			msgStack.push(
				' -> ' +
					t.file +
					': ' +
					t.line +
					(t.function ? ' (in function "' + t.function + '")' : '')
			);
		});
	}

	console.error(msgStack.join('\n'));
};

page.open(BASEURL + 'export/export.html', function(status) {
	if (status === 'fail') {
		console.error('Unable to load export.html');
		phantom.exit();
		return;
	}

	options.patternBase = '../images/patterns/';

	page.evaluate(function(options) {
		options.container = document.getElementById('coin');
        window.coin = new Coin(options);
    }, options);
    
    setInterval(function () {
        var hasLoaded = page.evaluate(function() {
            return window.coin.hasLoaded;
        });
        
        if (hasLoaded) {
            page.render(imagePath, { format: 'jpeg', quality: '100' });
            phantom.exit();
        }
    }, 1000);

});
