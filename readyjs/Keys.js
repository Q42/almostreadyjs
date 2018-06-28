window.Keys = new (function Keys(){
	var self = this;
	var keyCodesHeldDown = {};

	init();

	function init() {
		addEventListeners();
	}

	function addEventListeners() {
		document.addEventListener('visibilitychange', function(evt) {
			if (document.visibilityState == 'hidden') {
				keyCodesHeldDown = {};
			}
		})
		document.addEventListener('keydown', keydown)
		document.addEventListener('keyup', keyup)
	}

	function cycle() {
		// dispatch continous events
		if (Object.keys(keyCodesHeldDown).length) {
			for (var keyCode in keyCodesHeldDown) {
				var key = keyCodesHeldDown[keyCode];
				Ready.dispatch('keydown', { keyCode: keyCode });
			}
		}
	}

	function keydown(evt) {
		var key = KeyCodes.codes[evt.keyCode];
		if (key) {
			keyCodesHeldDown[evt.keyCode] = key;
		}
	}

	function keyup(evt) {
		var key = KeyCodes.codes[evt.keyCode];
		if (key) {
			delete keyCodesHeldDown[evt.keyCode];
		}
	}

	/*
		@keysToCheck = string, can be space separated such as 'left right'
	*/
	function down(keysToCheck) {
		var keyNames = keysToCheck.split(' ');
		for (var i in keyNames) {
			var keyName = keyNames[i],
					code = KeyCodes[keyName];
			if (keyCodesHeldDown[code]) return true;
		}
		return false;
	}

	this.init = init;
	this.cycle = cycle;
	this.down = down;
})
