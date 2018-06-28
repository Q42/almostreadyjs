var Ready = new (function(){
	var self = this;
	var started = false;
	var onLoads = [start];
	var onResizeHandlers = [];
	var scriptsToLoad = [];
	var mouseDownEvt = undefined; // set to touchstart/mousedown event when set
	var cycleInterval = 10;
	var handlers = [];
	var imageSizes = undefined;
	var cycleTOH = 0;
	var cycleNr = 0;

	buildOnScope();

	// hijack onload
	if (window.onload) onLoads.unshift(window.onload)
	window.onload = onDOMReady;
	if (window.onresize) onResizeHandlers.unshift(window.onresize)
	window.onresize = resize;

	function onDOMReady() {
		$('body').append('<div id="game"><div id="meta"></div><div id="world"></div></div>');
		for (var i in onLoads) {
			onLoads[i]();
		}
		// loadScript('game.js');
	}

	function onLoad(h) {
		onLoads.push(h);
	}

	function onResize(h) {
		onResizeHandlers.push(h);
	}

	function resize() {
		for (var i in onResizeHandlers)
			onResizeHandlers[i]();
	}

	function start() {
		if (started) return;
		started = true;
		addEventListeners();
		for (var i in scriptsToLoad) {
			loadScript(scriptsToLoad[i]);
		}
		setTimeout(function() {
			cycle();
			redraw();
		})
	}

	function stop() {
    Sound.stop();
		started = false;
		clearTimeout(cycleTOH)
	}

	function loadScript(name) {
		// when not DOM ready, schedule for load afterwards
		if (!started) {
			if (!/\.js$/i.test(name))
				name += '.js';
			document.write('<script src="' + name + '?' + new Date() * 1 + '"><\/script>');
			//scriptsToLoad.push(name);
			return;
		}
		if (!/\.js$/i.test(name))
			name += '.js';
		// add script
		var script = document.createElement('script')
		script.src = name + '?' + new Date() * 1;
		document.body.appendChild(script);
	}

	function addEventListeners() {
		document.addEventListener('visibilitychange', function(evt) {
			if (document.visibilityState == 'hidden') {
				clearTimeout(cycleTOH);
			}
			if (document.visibilityState == 'visible') {
				clearTimeout(cycleTOH);
				cycle();
			}
		})
		var eventNames = ['click','mousedown','touchstart','mousemove','touchmove','mouseup','touchend','keydown','keyup'];
		for (var i in eventNames) {
			var n = eventNames[i];
			(function(n){
				document.addEventListener(n, function(evt) { return doEvent(n, evt); })
			})(n)
		}
	}

	function doEvent(eventName, evt) {
		switch (eventName) {
			case 'click':
				dispatch('click', evt)
				break;
			case 'mousedown':
				mouseDownEvt = evt;
				break;
			case 'touchstart':
				mouseDownEvt = evt;
				dispatch('click', evt)
				break;
			case 'mousemove':
			case 'touchmove':
				dispatch('mousemove', evt)
				evt.preventDefault();
				break;
			case 'mouseup':
			case 'touchend':
				mouseDownEvt = undefined;
				dispatch('mouseup', evt)
				break;
			case 'keydown':
				dispatch('keypress', evt)
				break;
			case 'keyup':
				dispatch('keyup', evt)
				break;
		}
	}

	function dispatch(eventName, evt) {
		if (!started) return;
		// get the default set of handlers
		var set = handlers[eventName] || [];
		// if a key was pressed, see if key-specific handlers were added
		var key = evt.keyCode && KeyCodes.codes[evt.keyCode];
		if (key) {
			var set2 = handlers[eventName + key];
			if (set2) set = set.concat(set2);
		}
		// if a sprite was used for this event, see if a set of listeners is available
		var sprite = undefined;
		if (Mouse.sprite) {
			var spriteId = Mouse.sprite.id;
			var set3 = handlers[eventName + spriteId];
			if (set3) {
				sprite = Mouse.sprite;
				set = set.concat(set3);
			}
		}
		for (var i in set) {
			var handler = set[i];
			var evt = new GameEvent(eventName, evt, { key: key, x: Mouse.x, y: Mouse.y, cycle: cycleNr, sprite: sprite })
			handler.apply(self, [evt]);
		}
	}

	function cycle() {
		cycleTOH = setTimeout(cycle, cycleInterval)
		dispatch('gameloop', {})
		Keys.cycle();

		for (var id in Sprite.sprites)
			Sprite.sprites[id].cycle(cycleNr);

		if (Mouse.down && mouseDownEvt) {
			dispatch('mousedown', mouseDownEvt);
		}
		cycleNr++;
	}

	function redraw() {
		requestAnimFrame(redraw);
		if (window.screen) Screen.redraw();
		for (var id in Sprite.sprites) {
			var sprite = Sprite.sprites[id];

      // if (sprite.left > (Screen.right - Screen.worldLeft)) continue;
      // if (sprite.right < (0 - Screen.worldLeft)) continue;
      // if (sprite.top > (Screen.bottom - Screen.worldTop)) continue;
      // if (sprite.bottom < (0 - Screen.worldTop)) continue;

      sprite.redraw();
		}
	}

	function buildOnScope() {
		var onScope = {};
		var eventNames = ['keypress','keydown','keyup','click','mousedown','mousemove','mouseup','click','gameloop'];
		for (var i in eventNames) {
			var eventName = eventNames[i];
			(function(eventName) {
				onScope[eventName] = function(p1, p2) {
					if (typeof p1 == 'function') {
						var set = handlers[eventName] || [];
						handlers[eventName] = set;
						set.push(p1)
						return self; // allow chaining
					}
					// if the first parameter is a string it could be a key like "space" or "escape"
					else if (typeof p1 == 'string') {
						if (typeof p2 == 'function') {
							var strings = p1.split(' ');
							for (var j in strings) {
								var str = strings[j];
								var set = handlers[eventName + str] || [];
								handlers[eventName + str] = set;
								set.push(p2) // p2 is the handler!
							}
							return self; // allow chaining
						}
					}
					// if the first parameter is a sprite, then bind the event on that
					else if (typeof p1 == 'object' && p1.constructor == SpriteInstance) {
						if (typeof p2 == 'function') {
							var set = handlers[eventName + p1.id] || [];
							handlers[eventName + p1.id] = set;
							set.push(p2) // p2 is the handler!
							return self; // allow chaining
						}
					}
				}
			})(eventName);
		}
		// the on scope allows for sprites to bind events
		window.__defineGetter__('on', function() { return onScope; });
	}

	function leaveSprite() {
		console.log('leave sprite')
	}

	function getSpriteNames() {
		var spriteNames = [];
		for (var name in window) {
			var obj = window[name];
			if (obj && typeof obj == 'object' && obj.constructor && obj.constructor.name == 'Sprite') {
				spriteNames.push(name);
			}
		}
		return spriteNames;
	}

	// detects and stores the image size for the given url
	// and immediately returns it if already known
	// also supports waiting for DOMready
	function getImageSize(url, handler) {
		if (!imageSizes) {
			imageSizes = Storage.get('imageSizes', {});
		}
		if (!document.body) {
			if (!getImageSize.waiting) {
				getImageSize.waiting = [];
				onLoads.push(function(){
					for (var i in getImageSize.waiting) {
						var pair = getImageSize.waiting[i];
						getImageSize(pair.url, pair.handler)
					}
					delete getImageSize.waiting;
				})
			}
			getImageSize.waiting.push({url: url, handler: handler});
			return;
		}
		if (!imageSizes[url]) {
			var img = new Image();
			img.style = 'position:absolute;left:-9999px;top:-9999px;opacity:0';
			img.src = url;
			document.getElementById('meta').appendChild(img);
			img.onerror = function(err) {
        img.parentNode.removeChild(img);
				//handler(url);
				//document.getElementById('meta').removeChild(img);
			}
			img.onload = function() {
				imageSizes[url] = {
					width: this.width,
					height: this.height
				}
				Storage.set('imageSizes', imageSizes);
				if (handler)
					handler(url, imageSizes[url]);
				//document.body.removeChild(img);
			}
		} else if (handler) {
			handler(url, imageSizes[url]);
		}
	}

	function onOrientationChange(value) {
		//Controls.onOrientationChange();
	}

  function clear() {
    handlers = [];
    var cs = [SpriteInstance, SpriteListInstance, LevelInstance];
    for (var o in window) {
      var obj = window[o];
      if (obj && obj.constructor && contains(cs, obj.constructor)) {
        delete window[o]
      }
    }
    Screen.clear();
    Sound.clear();
  }

	this.start = start;
	this.stop = stop;
  this.clear = clear;
	this.loadScript = loadScript;
	this.onLoad = onLoad;
	this.onResize = onResize;
	this.getSpriteNames = getSpriteNames;
	this.getImageSize = getImageSize;
	this.onOrientationChange = onOrientationChange;
	this.handlers = handlers;
	this.dispatch = dispatch;
	//this.doEvent = doEvent;
  this.__defineGetter__('started', function(){ return started; })
})();
