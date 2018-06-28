var Controls = new (function() {
	var self = this;
	var transparency = 0.5;
	var controls = {
		// left: { sprite: new Sprite('controls/flatDark04.png'), w:60,h:60,key:'left' },
		// right: { sprite: new Sprite('controls/flatDark05.png'), w:60,h:60,key:'right' },
		// up: { sprite: new Sprite('controls/flatDark02.png'), w:60,h:60,key:'up' },
		// down: { sprite: new Sprite('controls/flatDark09.png'), w:60,h:60,key:'down' },
		// button1: { sprite: new Sprite('controls/flatDark35.png'), w:60,h:60 },
		// button2: { sprite: new Sprite('controls/flatDark36.png'), w:60,h:60 },
	}

	init();

	function init() {
		if (document.body) onDOMReady();
		else Ready.onLoad(onDOMReady);
	}

	function onDOMReady() {
		createControls();
		on.gameloop(cycle);
		onOrientationChange();
	}

	function cycle() {

	}

	function createControls() {
		for (var n in controls) {
			(function(n){
				var control = controls[n];
				var sprite = control.sprite;
				self[n] = sprite;
				sprite.transparency = transparency;
				sprite.fixed = true;
				sprite.hide();
				sprite.width = control.w;
				sprite.height = control.h;
				on.mousedown(sprite, buttonDown);

				sprite.bind = function(key) {
					control.binding = control.binding || {};
					control.binding[key] = true;
					return sprite;
				}
				sprite.unbind = function(key) {
					control.binding = control.binding || [];
					delete control.binding[key];
					return sprite;
				}

				if (control.key) {
					sprite.bind(control.key);
				}
			})(n);
		}
	}

	function buttonDown(evt) {
    return;
		for (var n in controls) {
			var control = controls[n];
			if (evt.sprite == control.sprite) {
				for (var key in control.binding) {
					Ready.dispatch('keypress', { keyCode: KeyCodes[key] });
					Ready.dispatch('keydown', { keyCode: KeyCodes[key] });
				}
			}
		}
	}

	function onOrientationChange() {
    return;
		var keyX = 80;
		var keyY = Screen.height - 80;
		controls.left.sprite.right = keyX;
		controls.left.sprite.y = keyY;
		controls.right.sprite.left = keyX;
		controls.right.sprite.y = keyY;
		controls.up.sprite.x = keyX;
		controls.up.sprite.bottom = keyY;
		controls.down.sprite.x = keyX;
		controls.down.sprite.top = keyY;

		controls.button1.sprite.right = Screen.width - 20 - controls.button2.sprite.width - 10;
		controls.button1.sprite.y = keyY;

		controls.button2.sprite.right = Screen.width - 20;
		controls.button2.sprite.y = keyY;
	}

	this.onOrientationChange = onOrientationChange;
})();
