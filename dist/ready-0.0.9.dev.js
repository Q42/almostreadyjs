(function(){
  var css = `
  html, body {
    padding: 0; margin: 0;
    background: #000; color: #fff;
  }
  #meta {
    position: absolute;
    left: -999999px; top: -999999px;
    pointer-events: none;
    visibility: hidden;
  }
  .sprite {
    position: absolute;
    left: 0; top: 0;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility:    hidden;
    -ms-backface-visibility:     hidden;
    backface-visibility: hidden;
  }
  .sprite.inspector-selected {
    z-index: 100 !important;
  }
  .sprite.inspector-selected:before {
    content: '';
    display: block;
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    background: rgba(80,80,255, .7);
  }
  .sprite.inspector-selected:after {
    content: '';
    display: block;
    position: absolute;
    left: -2px; top: -2px; right: -2px; bottom: -2px;
    border: solid red 2px;
  }
  #game {
    position: relative;
    overflow: hidden;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -moz-touch-callout: none;
    -ms-touch-callout: none;
    touch-callout: none;
    /*
    top: 50%; left: 50%;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility:    hidden;
    -ms-backface-visibility:     hidden;
    backface-visibility: hidden;
    */
  }
  #world {
    position: absolute;
  }
  `;

  setTimeout(init);

  function init() {
    var head = document.getElementsByTagName('head')[0];
    if (!head) return setTimeout(init, 0);
    var style = document.createElement('style');
    style.innerHTML = css;
    head.appendChild(style);
  }
})();


// NEXT FILE

var Game = new (function(){
	var self 			= this;
	
	self.title  	= undefined;
	self.author 	= undefined;
	self.path 		= undefined

	setTimeout(init);

	function init() {
		if (self.title) {
			document.title = self.title;
		}
	}
})();

// NEXT FILE

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (callback, element) {
      window.setTimeout(function () {
        callback(+new Date);
      }, 10);
    };
})();

window.cancelAnimFrame = (function () {
  return window.cancelAnimationFrame
    || window.webkitCancelRequestAnimationFrame
    || window.mozCancelRequestAnimationFrame
    || window.oCancelRequestAnimationFrame
    || window.msCancelRequestAnimationFrame
    || function() {}
})();

function contains(arr, v) {
  for (var i=0; i<arr.length; i++)
    if (arr[i] == v)
      return true;
  return false;
}

function every(ms) {
  if (!every.last) every.last = {};
  if (!every.last[ms]) every.last[ms] = 0;
  if (new Date() * 1 > every.last[ms]) {
    every.last[ms] = (new Date() * 1) + ms;
    return true;
  }
  return false;
}

function between (min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}

function load(scriptName) {
  Ready.loadScript(scriptName);
}

function ask(question, currentAnswer) {
  return prompt(question, currentAnswer)
}

// 'world'.letter(1) = 'w'
String.prototype.letter = function(i) { return this.charAt(i-1)}

function GameEvent(eventName, evt, props) {
  this.date = new Date();
  this.name = eventName;
  this.originalEvent = evt;
  props = props || {};
  for (var o in props) {
    this[o] = props[o];
  }
}

function each(obj, f) {
  var isSpriteList = typeof obj == 'object' && obj.constructor == SpriteListInstance;
  if (isSpriteList || Array.isArray(obj)) {
    for (var i=0; i<obj.length; i++) {
      (function(i){
        f(obj[i], i);
      })(i)
    }
    return;
  }
  if (typeof obj == 'object'){
    for (var id in obj) {
      (function(id){
        f(obj[id], id);
      })(id)
    }
  }
}

function forever(f) {
  repeat(f);
}

function repeat(f, count) {
  if (typeof f == 'number' && typeof count == 'function')
    return repeat(count, f);
  if (count === 0 || count < 0) return;
  count = count || Infinity;
  // repeat the amount of times as specified
  if (count < Infinity) {
    for (var i=0; i<count; i++) {
      (function(i){ f(i) })(i);
    }
  } else {
    // repeat forever
    if (repeat.__active) {
      throw 'repeat inside repeat';
    } else {
      // create a newly scoped gameloop function
      function loop() {
        // prevent repeat inside repeat
        repeat.__active = true;
        f.apply(null, arguments);
        delete repeat.__active;
      }
      on.gameloop(loop);
    }
  }
}

function round() {
  return Math.round.apply(Math, arguments);
}


// NEXT FILE

/*
	CSS1 selectors, <div to create>, element(s), array, window
 */
$ = function(s) {
	var d = document, qs = 'querySelectorAll', hi=!!d[qs], u = undefined, cn = 'className', pn = 'parentNode';

	function _getEls(sel, par) {
		if (!sel) return [];
		if (typeof(sel) == 'object') {
			if(sel==window) return [window];
			if(sel.nodeType) return [sel];
			if(sel.length != u) return sel;
		}
		if(/^\</.test(sel)) {var fr = d.createElement('div');fr.innerHTML = sel;return fr.childNodes;}
		if (sel && hi) return (par||d)[qs](sel);
		// single selector tag#id.class1.class2
		if (/^[#\.]?[\w\-_\*]+$/.test(sel)) {
			// #id
			if (/^#/.test(sel)) { 
				var r = d.getElementById(sel.substr(1)),p;
				if (r) {
					if (!par || par==d) // #id by document, serve cold
						return [r];
					// otherwise traverse ancestor tree
					for(p=r[pn];p!=d;p=p[pn])
						if (p==par) 
							return [r];
				}
				return [];
			}
			// .class
			if (/^\./.test(sel)) { var els = []; new _$(par||d).find('*').each(function(){ if ($(this).hasClass(sel.substr(1))) els.push(this); }); return els; }
			return (par||d).getElementsByTagName(sel);
		}
		var r=[],$els,root;
		each(sel.replace(/^\s+|\s{2}|\s+$/gi,'').split(','),function(i2,sel2){ // split double selectors: foo,bar
			root = par||d;
			each(sel2.replace(/^\s+|\s+$/gi,'').split(' '), function(i3,sel3,l3) { // split ancestor paths: foo bar
				$els = 0;
				sel3.replace(/^[\w\*]+|#[\w_-]+|\.[\w_-]+/gi, function(sel4) { // split single rules tag#foo,bar
					// for each part of a single tag#div.class1.class2 selector, do a filter, except for the first
					$els = $els? $els.filter(sel4) : new _$(root).find(sel4);
				});
				if ($els) {
					root = $els.get();
					if (i3==l3-1)
						$els.each(function(i,o){if (indexOf(r,o)<0) r.push(o)});
				}
			});
		});
		return r;
	}

	function each(arr, f) {
		for(var i=0;i<arr.length;i++) f.call(arr[i],i,arr[i],arr.length);
	}

	function indexOf(arr,o) {
		for (var i=0;i<arr.length;i++)
			if (arr[i]==o) return i;
		return -1;
	}

	function _$(sel,par){ 
		var _ = _getEls(sel,par); 
		for(var x in _) 
			this[x]=_[x]; 
		if(!this.length) 
			this.length = _.length; 
		this._ = _;
	}

	_$.prototype = {
		closest			: function(sel)  	{ var r=[],test,closest; this.each(function() {test = $(this);do {closest = test.filter(sel),stop = (test[0] == d);if (closest.length) {stop = true;closest.each(function(i,o){if(indexOf(r,o)<0)r.push(o)});}test = test.parent();}while (test.length && !stop);});return new _$(r);},
		each        : function(f)    	{ each(this,f); return this },
		remove      : function()     	{ this.each(function(){this[pn].removeChild(this)}); return this },
		replaceWith : function(el)   	{ var me = this; if(me[0]) { if(el.each) el.each(function(){ me[0][pn].insertBefore(this,me[0]); }); else me[0][pn].insertBefore(el,me[0]); me.remove(); } return this },
		appendTo    : function(el)   	{ el=el.length?el[0]:el;this.each(function(){el.appendChild(this)}); return this },
		append      : function(sel)  	{ var me = this; if(me[0]) { new _$(sel).each(function(){ me[0].appendChild(this)}); }return this },
		parent      : function()     	{ var r = [];this.each(function(){if(indexOf(r,this[pn])<0) r.push(this[pn])});return new _$(r); },
		children    : function(sel)  	{ var ce = [], res, e; this.each(function(){ e = this.childNodes; for(var i=0;i<e.length;i++) ce.push(e[i]); }); res = new _$(ce); return sel? res.filter(sel) : res; },
		find        : function(sel)  	{ var r = [],cs,i; this.each(function(){ cs = _getEls(sel, this); for (i=0;i<cs.length;i++) if (indexOf(r,cs[i])<0) r.push(cs[i]);}); return new _$(r); },
		filter      : function(s,iv) 	{ s = _getEls(s); var r = [],i; this.each(function() { for(i=0;i<s.length;i++) if (s[i]==this&&!iv||s[i]!=this&&iv) r.push(this) }); return new _$(r); },
		not         : function(sel)  	{ return this.filter(sel,true) },
		eq          : function(i)    	{ return new _$(this[i]) },
		has         : function(el)   	{ for(var i=0;i<this.length;i++) if(this[i]==el) return true },
		get 				: function(i)	 		{ return i==u? this._ : this._[i] },
		attr        : function(k,v)  	{ if(v===u) return this[0]&&this[0].getAttribute(k); this.each(function(){this[((v===null)?'remove':'set')+'Attribute'](k,v)}); return this },
		on          : function(e,f)  	{ e=e.toLowerCase().split(' '); this.each(function(i,o){ for(var x in e) { this['on' + e[x]] = function() { return f.apply(o, arguments); }; }}); return this },
		off         : function(e)  	 	{ e=e.toLowerCase().split(' '); this.each(function(){ for(var x in e) this['on' + e[x]] = null; }); return this },
		click       : function(h)    	{ this.on('click',f); return this },
		text        : function(t)    	{ if(t===u) return this[0]&&this[0].textContent; this.each(function(){this.textContent=t}); return this },
		html        : function(h)    	{ if(h===u) return this[0]&&this[0].innerHTML; this.each(function(){this.innerHTML=h}); return this },
		hasClass    : function(cl,h) 	{ h=0;this.each(function(){ h+=new RegExp('(^| )' + cl + '( |$)', 'gi').test(this[cn])&&1||0;});return !!h; },
		addClass    : function(cl)   	{ this.removeClass(cl);cl=cl.split(' ');this.each(function(){for(var i in cl)this[cn] = (this[cn] + ' ' + cl[i]).replace(/^ |(\s)\s+|\s+$/g,'$1');});return this },
		removeClass : function(cl)   	{ cl=cl.split(' ');this.each(function(){for(var i in cl)this[cn] = this[cn].replace(new RegExp('(^| )' + cl[i] + '\\b', 'gi'), '').replace(/^ |(\s)\s+|\s+$/g,'$1');});return this },
		toggleClass : function(cl)   	{ cl=cl.split(' ');for(var x in cl) if(cl[x]) this[(this.hasClass(cl[x])?'remove':'add')+'Class'](cl[x]); return this },
		setCss      : function(p,v)  	{ this.each(function(){this.style[p]=v}); return this },
		getCss      : function(p)    	{ return this[0]&&this[0].style[p]; },
		css         : function(a,b)  	{ if(typeof a == 'string') if(b===u) return this.getCss(a); else this.setCss(a,b);else for(var x in a) this.setCss(x,a[x]); return this },
		hide        : function()     	{ this.setCss('display','none'); return this },
		val					: function(v)	 		{ if (v==u) return this[0]?this[0].value:u; this.each(function(i,o){o.value=v});return this},
		show        : function()     	{ this.setCss('display','block'); return this },
		focus				: function()	 		{ if (this.length) this[0].focus(); return this }
	};

	return new _$(s);
};

$.browser = new function(){
	var ualc = navigator.userAgent.toLowerCase();

	this.webkit = /applewebkit/.test(ualc);
	this.firefox = /firefox/.test(ualc);
	this.safari = /safari/.test(ualc) && !/chrome/.test(ualc);
	this.ie = /msie/.test(ualc) || /trident/.test(ualc);
	this.iemobile = /iemobile/.test(ualc);
	this.iOS = /ipad|iphone|ipod/.test(ualc);
	this.android = /android/.test(ualc);
	this.s40 = /series40/.test(ualc); // nokia
	this.mobile = this.iOS || this.android || this.iemobile;
	this.unknown = !this.webkit&&!this.firefox&&!this.ie&&!this.iOS&&!this.android;

	this.version = parseFloat(this.webkit?ualc.match(/applewebkit\/(\d+)\./)[1]
		: this.firefox?ualc.match(/firefox\/(\d+)\./)[1]
		: this.ie?ualc.match(/(msie\s|rv\:)(\d+)\./)[2]
		: -1);

	this.retina = (window.devicePixelRatio && window.devicePixelRatio >= 2) && this.iOS;
};

// NEXT FILE

var KeyCodes = {
	'escape': 27,
	'space': 32,
	'left': 37,
	'up': 38,
	'right': 39,
	'down': 40,
	'enter': 13,
	'backspace': 8,
	'left': 37
}

for (var c=65;c<=90;c++) KeyCodes[String.fromCharCode(c).toLowerCase()] = c;
for (var c=48;c<=57;c++) KeyCodes[String.fromCharCode(c).toLowerCase()] = c;

// map the inverted dictionary too (KeyCodes.codes.27 = 'escape')
KeyCodes.codes = {};
for (var o in KeyCodes) KeyCodes.codes[KeyCodes[o]] = o;

// NEXT FILE

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


// NEXT FILE

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
		if (Screen.redraw) Screen.redraw();
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
						getImageSize(pair.url, pair.handler, true)
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
			img.src = fixImageUrl(url);
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

  function fixImageUrl(url) {
  	var path = url;
  	if (Game.path) {
  		var needsSlash = true;
  		if (/\/$/.test(Game.path)) needsSlash = false;
  		if (/^\//.test(url)) needsSlash = false;
  		path = Game.path + (needsSlash?'/':'') + url;
  	}
  	return path;
  }

	this.start = start;
	this.stop = stop;
  this.clear = clear;
	this.loadScript = loadScript;
	this.onLoad = onLoad;
	this.onResize = onResize;
	this.getSpriteNames = getSpriteNames;
	this.getImageSize = getImageSize;
	this.fixImageUrl = fixImageUrl;
	this.onOrientationChange = onOrientationChange;
	this.handlers = handlers;
	this.dispatch = dispatch;
	//this.doEvent = doEvent;
  this.__defineGetter__('started', function(){ return started; })
})();


// NEXT FILE

// SpriteList is a smart list of sprites
// .add
// .remove
// but it's smart as in; when sprites are removed from the game, they are also taken out of spritelists
function SpriteList() {
  var obj = Object.create(SpriteListInstance.prototype);
  SpriteListInstance.apply(obj, arguments);
  return obj;
}
SpriteList.lists = SpriteList.lists || [];
SpriteList.removeSprite = function(sprite) {
	for (var i in SpriteList.lists) {
		var list = SpriteList.lists[i];
		list.remove(sprite)
	}
}
function SpriteListInstance() {
	SpriteList.lists.push(this);
	// factory function to remove obj from any lists

	// instance code follows
	var self = this;
	var contents = [];
	var highestIndex = 0;
	self.length = 0;

	for (var i in arguments) {
		contents.push(arguments[i]);
	}

	update();

	// set all [0], [1], [2] etc references properly and clean out old ones
	function update() {
		var startClean = 0;
		for (i in contents) {
			self[i] = contents[i];
			startClean++;
		}
		// clear out old values
		for (j=startClean; j<self.length; j++) {
			delete self[j];
		}
		self.length = contents.length;
		return self;
	}

	// add(a), or add(a,b,c,d,...)
	function add() {
		for (var i in arguments)
			contents.push(arguments[i])
		return update();
	}

	// remove() = pop()
	// remove(obj) = seek that obj and remove it
	function remove(obj) {
		if (obj) {
			var retry = true;
			while (retry) {
				for (var i in contents) {
					if (contents[i] == obj) {
						contents.splice(i, 1);
						update();
						break;
					}
				}
				retry = false;
			}
		} else {
			var result = contents.pop();
			update();
			return result;
		}
		return update();
	}

	function join(list) {
		for (var i=0; i<list.length; i++)
			add(list[i]);
		return self;
	}

	function each(h) {
		// first, push all items into a temp array (because the handler could remove items and change the length and indices)
		var items = [];
		for (var i in contents)
			items.push(contents[i])
		// iterate the temp list
		for (var i in items) {
      (function(){
  			var obj = items[i];
  			h.apply(obj, [obj, i]);
      })(i)
		}
		return self;
	}

	function clear() {
    each(function(sprite){
      sprite.remove();
    })
		contents = [];
		update();
		return self;
	}

	function contains(obj) {
		for (var i in contents) {
			if (contents[i] == obj)
				return true;
		}
		return false;
	}

	function addUnique() {
		for (var i in arguments) {
			if (!contains(arguments[i]))
				add(arguments[i])
		}
		return self;
	}

	function getMaxValue(propName, lowest) {
		var value = 0;
		for (var i in contents) {
			var obj = contents[i];
			if (typeof obj == 'object' && obj.constructor == SpriteInstance) {
				value = lowest? Math.min(obj[propName], value) : Math.max(obj[propName], value);;
			}
		}
		return value;
	}

  // sets name/value on all sprites
  // can be an object too
  function set(name, value) {
    if (typeof name == 'object') {
      for (var n in name) {
        set(n, name[n])
      }
      return self;
    }
    each(function(sprite, i){
      console.log(i)
      sprite[name] = value;
    })

    return self;
  }

	this.add = add;
	this.addUnique = addUnique;
	this.remove = remove;
	this.join = join;
	this.each = each;
	this.clear = clear;
	this.contains = contains;
  this.set = set;
	this.__defineGetter__('right', function() { return getMaxValue('right'); });
	this.__defineGetter__('left', function() { return getMaxValue('left', true); });
	this.__defineGetter__('top', function() { return getMaxValue('top', true); });
	this.__defineGetter__('bottom', function() { return getMaxValue('bottom'); });
}


// NEXT FILE

function Sprite() {
  var obj = Object.create(SpriteInstance.prototype);
  SpriteInstance.apply(obj, arguments);
  return obj;
}
Sprite.id = 0;
Sprite.sprites = {};
Sprite.solids = SpriteList();
Sprite.gravities = {};

function SpriteInstance(p1) {
	var self = this;
	var defaultSize = 50;
	var cycleNr = 0;
	var myCycleNr = 0;
	var onScope = {};
	var prefixes = ['-webkit-', '-moz-', '-ms-', ''];
	var statesChanged = {};
	var useTranslate3d = true;
	var onSolidGround = false;
	var touchedSolid = false;
  var actualImageSize = {
    width: 0,
    height: 0
  };
  // when derived from a sprite sheet, this obj holds the tile info
  var sheetInfo = {
    tileX:   0,
    tileY:   0,
    tileX2:  0,
    tileY2:  0,
  };
	var sliding = {
		enabled: false,
		destX: 0,
		destY: 0,
		duration: 0,
		deltaX: 0,
		deltaY: 0
	};
	var gravitySettings = {
		current: 3,
		max: 5,
		add: .4
	};
	var oldState = {};
	var moved = false; // flag for detecting (in a cycle) if this sprite moved
	var state = {
		front: 				{ value: 0 },
		rotation: 		{ value: 0, name: 'rotate', isTransform: true },
		scaleX: 			{ value: 1, isTransform: true },
		scaleY: 			{ value: 1, isTransform: true },
		width: 				{ value: 0, unit: 'px' },
		height: 			{ value: 0, unit: 'px' },
    background:   { value: 'transparent', name: 'backgroundColor' },
		image: 				{ value: '' },
		images: 			{ value: [], },
		left: 				{ value: 0, unit: 'px' },
		top: 					{ value: 0, unit: 'px' },
		x: 						{ value: undefined },
		y: 						{ value: undefined },
    z:            { value: 1, name: 'zIndex' },
		right: 				{ value: undefined },
		bottom: 			{ value: undefined },
		size: 				{ value: undefined },
		flip: 				{ value: false },
		flipY: 				{ value: false },
		solid: 				{ value: false },
		gravity: 			{ value: false },
		fixed: 				{ value: false },
		opacity: 			{ value: 1 },
		transparency: { value: 0 },
    backgroundSize:       { value: 'contain' },
    backgroundPosition:   { value: 'center center' },
	}
	init();

	function init() {
		Sprite.id++;
		self.id = 'sprite' + Sprite.id;
		Sprite.sprites[self.id] = self;
		self.$el = $('<div id="' + self.id + '" class="sprite"></div>');
		self.handlers = [];
		self.removed = false;
		initGettersAndSetters()
		if (document.body) onDOMReady();
		else Ready.onLoad(onDOMReady);
		// first setting of initState is required to make state properties available pre-DOM-loaded
		if (typeof p1 == 'string') {
			self.image = p1;
		} else if (typeof p1 == 'object') {
			set(p1);
		}
		initState();
	}

	function onDOMReady() {
		$('#world').append(self.$el);
		// re-initialize state for props changed in between script and dom loaded
		initState();
	}

	function initGettersAndSetters() {
		for (var name in state) {
			(function(n){
				var prop = state[n];
				self.__defineSetter__(n, function(v) { changeState(n, v); });
				self.__defineGetter__(n, function() { return state[n].value; });
			})(name);
		}
	}

	// takes all state values and set them
	function initState() {
		for (var name in state) {
			var prop = state[name];
			if (prop.value === 0 || prop.value) {
				changeState(name, prop.value, true);
			}
		}
	}

	// act upon state changes
	// @isApproach is true when called back internally after hitting a solid wall and trying to approach it closer
	function changeState(name, value, isSystem, isApproach) {
		//console.log('changeState', name, value)

		// don't allow public movement calls when sliding
		if (sliding.enabled && !isSystem) return;

		// only check for solids if this sprite has gravity enabled!
		if (self.gravity || self.solid) {
			if (!isSystem && !allowStateChange(name, value)) {
				if (contains(['left','x','right'], name)) {
					if (!isNaN(value)) {
						var curValue = self[name];
						if (value > curValue)
							changeState(name, Math.max(curValue, value - 1), false, true);
						if (value < curValue)
							changeState(name, Math.min(curValue, value + 1), false, true);
						touchedSolid = true;
					}
				}
				return;
			}
			// if the changeState is allowed, it is either a direct success (making touchedSolid false)
			// or it's due to approaching the solid, after touching a solid. So then go with that value
			if (contains(['left','x','right'], name)) {
				touchedSolid = isApproach;
			}
		}
		oldState = {}; for (var n in state) oldState[n] = state[n];
		state[name].value = value;
		statesChanged[name] = true;

		switch (name) {
			case 'left':
				// set virtual properties x and right
				state.x.value 			= value + Math.floor(self.width / 2);
				state.right.value 	= value + self.width;
				break;
			case 'top':
				// set virtual properties y and bottom
				state.y.value 			= value + Math.floor(self.height / 2);
				state.bottom.value 	= value + self.height;
				break;
			case 'x':
				self.left = value - Math.floor(self.width / 2)
				break;
			case 'y':
				self.top = value - Math.floor(self.height / 2)
				break;
			case 'right':
				self.left = value - self.width;
				break;
			case 'bottom':
				self.top = value - self.height;
				break;
			case 'width':
				// when width is set, keep x centered
				if (oldState.x.value !== undefined)
					self.x = oldState.x.value;
				// clear state when width is set manually
				if (!isSystem) state.size.value = undefined;
				break;
			case 'height':
				if (self.gravity) {
					// when height is set and we're a gravity platformer, keep bottom aligned!
					if (oldState.bottom.value !== undefined)
						self.bottom = oldState.bottom.value;
				} else {
					// when height is set, keep y centered
					if (oldState.y.value !== undefined)
						self.y = oldState.y.value;
				}
				// clear state when width is set manually
				if (!isSystem) state.size.value = undefined;
				break;
			case 'image':
				// just trigger a getting of the image size
				Ready.getImageSize(value);
				if (!self.size && !self.width && !self.height)
					self.size = defaultSize;
				if (self.size)
					self.size = self.size;
				break;
			case 'images':
				if (value && value.length) {
					self.image = value[0];
					for (var i in value) {
						Ready.getImageSize(value[i]);
					}
				}
				break;
			case 'size':
				// size sets the height, and cause vertical re-center, but make it a system call
				changeState('height', value, true);
        if (self.sheet) {
          updateSizeBySheet(value);
          break;
        }
				Ready.getImageSize(self.image, function(url, size){
          //console.log('set size', size)
					// only set width if size is still set (and not overridden by manual width/height)
					if (size && self.size && size.width !== undefined && url == self.image) {
						var w = Math.round((value / size.height) * size.width);
						if (w) {
							// size also sets the width, and cause horizontal re-center, but make it a system call
							changeState('width', w, true);
						}
					}
				})
				break;
			case 'flip':
				changeState('scaleX', (value == true || value == 1)? -1 : 1);
				break;
			case 'flipY':
				changeState('scaleY', (value == true || value == 1)? -1 : 1);
				break;
			case 'solid':
				if (value) Sprite.solids.addUnique(self)
				else Sprite.solids.remove(self)
				break;
			case 'gravity':
				if (value) Sprite.gravities[self.id] = self;
				else delete Sprite.gravities[self.id];
				break;
			case 'opacity':
				state.transparency.value = 1 - value;
				break;
			case 'transparency':
				self.opacity = 1 - value;
				break;
		}
		//redraw();
	}

  function needsRedraw() {
    return Object.keys(statesChanged).length > 0;
  }

	function redraw() {
		if (!needsRedraw()) return;
		// 1. for now redraw everything
		// 2. only redraw changed properties
		var transformValue = '';
		var cssModifiers = {};
		var needsTransform = false;
		for (var n in statesChanged) {
			var prop = state[n];
					name = prop.name || n,
					value = prop.value;
			if (prop.isTransform) {
				needsTransform = true;
			}
			else {
				// set cssModifiers
				switch (n) {
					case 'x':
					case 'y':
					case 'right':
					case 'bottom':
					case 'size':
					case 'flip':
					case 'flipY':
					case 'solid':
					case 'gravity':
					case 'front':
					case 'images':
						// don't render anything for these properties
						break;
					case 'image':
						var imagePath = Ready.fixImageUrl(value);
						cssModifiers['background-image'] = 'url(' + encodeURI(imagePath) + ')';
						break;
					case 'fixed':
						setFixed(value);
						break;
					case 'left':
					case 'top':
						if (useTranslate3d) break;
					default:
						if (prop.unit) {
							var needsUnit = !/\%|px/i.test(value+'');
							if (needsUnit)
								value += prop.unit;
						}
            cssModifiers[name] = value;
						break;
				}
			}
		}
		// when using translate3d for left/top positioning, make sure it is set first (before rotation and such)
		if (useTranslate3d) {
			if (statesChanged.left || statesChanged.top || needsTransform) {
				transformValue = 'translate3d(' + state.left.value + 'px,' + state.top.value + 'px, 0) ';
				needsTransform = true;
			}
		}
		if (needsTransform) {
			for (var n in state) {
				var prop = state[n];
						name = prop.name || n,
						value = prop.value;
				if (prop.isTransform) {
					var unit = (name == 'rotate')? 'deg' : '';
					transformValue += name + '(' + value + unit + ') '
				}
			}
		}
		// set transform
		if (transformValue != '') {
			for (var i in prefixes) {
				var prefix = prefixes[i]
				cssModifiers[prefix + 'transform'] = transformValue;
			}
		}
		$(self.$el).css(cssModifiers);
		statesChanged = {};
	}

	// move(10,20) = move x and y
	// move(10) = move in direction
	// move({y:-10}) move specific direction (or multiple name/value pairs)
	function move(name, value) {
		if (typeof name == 'number' && typeof value == 'number')
			return move({x:name,y:value});
		// when moving a number only, move in the current direction
		if (!value && typeof name == 'number') {
			var deg = state.rotation.value + state.front.value;
			var radians = deg * (Math.PI/180);
			var dx = Math.cos(radians) * name;
			var dy = Math.sin(radians) * name;
			self.move({x:dx, y:dy})
			return self;
		}
		// when a set of name/values are given, move along those
		if (typeof name == 'object') {
			for (var n in name) {
				move(n, name[n])
			}
			return self;
		}
		if (value !== 0) {
			var prop = state[name];
			if (prop) {
				set(name, prop.value + value);
			}
		}
		return self;
	}

	function set(name, value) {
		if (typeof name == 'object') {
			for (var n in name) {
				set(n, name[n])
			}
			return self;
		}
		if (state[name])
			self[name] = value; // use public property ti cause automatic setting/drawing

		return self;
	}

	function turn(value) {
		if (value === undefined) {
			self.rotation += 180;
			self.flipY = !self.flipY;
		} else {
			self.rotation += isNaN(value)? 0 : value;
		}
		return self;
	}

	function pointTo(value) {
		// allow pointing to an object
		if (typeof value == 'object' && value.x !== undefined && value.y !== undefined) {
			var rotation = Math.atan2(value.y - self.y, value.x - self.x) * 180 / Math.PI;
			return pointTo(rotation);
		}
		self.rotation = isNaN(value)? 0 : value;
		return self;
	}

	function goTo(x, y) {
		// allow going to an object that exposes x,y (such as mouse, or another sprite)
		if (typeof(x) == 'object' && x.x !== undefined && x.y !== undefined) {
			return goTo(x.x, x.y);
		}
		self.x = x;
		self.y = y;
		return self;
	}

	function hide() {
		self.$el.hide();
		return self;
	}

	function show() {
		self.$el.show();
		return self;
	}

	// schedules for removal
	// @cleanup performs the actual cleanup: removes from DOM, sprite array and lists
	function remove(cleanup) {
		if (self.removed) return;
		SpriteList.removeSprite(self);
		self.$el.remove();
		delete Sprite.sprites[self.id];
		self.removed = true;
	}

	// clones this sprite at the given spot
	function clone(x, y) {
		// if no spot is given, clone at the exact same spot as the original sprite
		if (x === undefined && y === undefined)
			return clone(self);
		// if x is an object that has x and y, then use that x and y
		if (typeof(x) == 'object' && x.x !== undefined && x.y !== undefined)
			return clone(x.x, x.y);
		var newSprite = Sprite();
		for (var name in state) {
			newSprite[name] = self[name];
		}
		newSprite.x = x;
		newSprite.y = y;
		return newSprite;
	}

	function touches() {
		var sides = {};
		var sprites = [];
		for (var i in arguments) {
			var obj = arguments[i];
			// detect for touching a side?
			if (typeof obj == 'string') {
				var sideStrs = obj.toLowerCase().split(' ');
				for (var i=0; i<sideStrs.length; i++) {
					var str = sideStrs[i];
					if (contains(['left', 'top', 'right', 'bottom'], str))
						sides[str] = true;
				}
			}
			if (typeof obj == 'object' && obj.constructor == SpriteInstance) {
				if (!obj.isSliding) {
					if (obj.id != self.id) {
            sprites.push(obj)
          }
				}
			}
			// allow detection of touching ANY sprite in a list
			else if (typeof obj == 'object' && obj.constructor == SpriteListInstance) {
				obj.each(function(listObj) {
					if (typeof listObj == 'object' && listObj.constructor == SpriteInstance && !listObj.isSliding) {
            if (listObj.id != self.id) {
              sprites.push(listObj)
            }
          }
				})
			}
			else if (typeof obj == 'object' && obj.isScreen) {
				if (this.right > obj.right) return screen;
				if (this.left < obj.left) return screen;
				if (this.top < obj.top) return screen;
				if (this.bottom > obj.bottom) return screen;
			}
		}
		for (var i in sprites) {
			var sprite = sprites[i];
			// first, bail out asap
			if (this.left >= sprite.right) continue;
			if (this.right <= sprite.left) continue;
			if (this.top >= sprite.bottom) continue;
			if (this.bottom <= sprite.top) continue;
			// if sides were requested, check for side matches
			if (Object.keys(sides).length > 0) {
				if (sides.top && this.bottom <= sprite.y) return sprite;
				if (sides.bottom && this.top >= sprite.y) return sprite;
				if (sides.left && this.right <= sprite.x) return sprite;
				if (sides.right && this.left >= sprite.x) return sprite;
			} else {
				// no side was requested, so any touch will do
				return sprite;
			}
		}
		return false;
	}

	function nextImage(step) {
		if (!self.images) return;
		if (nextImage.index === undefined || nextImage.index >= (self.images.length - 1) )
			nextImage.index = 0;
		else
			nextImage.index += (step? (1/step) : 1);
		self.image = self.images[Math.round(nextImage.index)]
		return self;
	}

	// the main gameloop cycle
	function cycle(nr) {
		// upon first gameLoop, init the state once more
		if (myCycleNr == 0) initState();
		myCycleNr++;
		cycleNr = nr;
		if (sliding.enabled) {
			handleSlide();
		}
		if (self.gravity) {
			handleGravity();
		}
		return self;
	}

	function handleGravity() {
		// if jumping, OR falling without being on solid ground
		if (sliding.enabled) return;
		var isJump = gravitySettings.current <= 0;
		// if we've reset onSolidGround, we only need to check ONE pixel below first, to see if we should fall at all
		if (!isJump && !onSolidGround) {
			onSolidGround = !allowMove('y', 1);
		}
		// now we know if we're jumping or falling
		if (isJump || !onSolidGround) {
			// modify the gravitySettings.current speed
			gravitySettings.current = Math.min(gravitySettings.current + gravitySettings.add, gravitySettings.max);
			var destY = self.y + gravitySettings.current;
			var oldY = self.y;

			// keep going to destY until it's not possible, then land exactly on the surface
			while (self.y == oldY) {
				self.y = destY; // this will fail if it's not allowed (by hitting a solid sprite)
				if (self.y == oldY) {
					if (destY > self.y)
						destY = Math.max(self.y, destY - 1);
					else
						destY = Math.min(self.y, destY + 1);
				}
			}
			if (isJump) {
				if (!allowMove('y', -1)) gravitySettings.current = 0.1;
			} else {
				onSolidGround = !allowMove('y', 1);
			}
		}
	}

	function jump(howHigh) {
		if (sliding.enabled) return;
		if (!self.gravity) return;
		onSolidGround = !allowMove('y', 1);
		if (!onSolidGround || gravitySettings.current < 0) return;
		howHigh = howHigh || 1;
		gravitySettings.current = - (self.height / 12) - howHigh * 1.4;
		return self;
	}

	function allowMove(name, value) {
		if (!state[name]) return false;
		return allowStateChange(name, state[name].value + value);
	}

	function allowStateChange(name, value) {
		if (sliding.enabled) return true;
		if (!self.gravity && !self.solid) return true;
		//console.log('allowStateChange', state[name].value, value)
		var needsSolidCheck = false;
		switch (name) {
			case 'x':
			case 'left':
			case 'right':
			case 'y':
			case 'top':
			case 'bottom':
				needsSolidCheck = true;
				break;
		}
		if (!needsSolidCheck) return true;
		if (!Sprite.solids || !Sprite.solids.length) return true;
		onSolidGround = false; // flag false and check again

		var box = {
			left: 	self.left,
			top: 		self.top,
			right: 	self.right,
			bottom: self.bottom
		}
		// modify the box
		switch (name) {
			case 'x':
				value -= Math.floor(self.width / 2); // and fall through to 'left'
			case 'left':
				box.left = value;
				box.right = box.left + self.width;
				break;
			case 'y':
				value -= Math.floor(self.height / 2); // and fall through to 'top'
			case 'top':
				box.top = value;
				box.bottom = box.top + self.height;
				break;
			case 'right':
				box.right = value;
				box.left = box.right - self.width;
				break;
			case 'bottom':
				box.bottom = value;
				box.top = box.bottom - self.height;
				break;
		}
		var solidHit = touches.apply(box, Sprite.solids);
		if (solidHit)
			return false;
		return true;
	}

	/*
		slideTo(x, y, s)
		Slides to the gven x,y spot in s seconds
		@s = optional (defaults to 1)
		@x, @y can be passed as 1 sprite / mouse object that exposes .x and .y
	*/
	function slideTo(px, py, ps) {
		if (typeof px == 'object' && px.x !== undefined && px.y !== undefined) {
			return slideTo(px.x, px.y, ps);
		}
		ps = ps || 1;
		sliding.destX = px;
		sliding.destY = py;
		sliding.duration = ps * 1000;
		sliding.deltaX = px - self.x;
		sliding.deltaY = py - self.y;
		sliding.enabled = true;
		sliding.handler = undefined;
		for (var i in arguments) {
			var arg = arguments[i];
			if (typeof arg == 'function')
				sliding.handler = arg;
		}
		sliding.started = new Date();
		sliding.startLeft = self.left;
		sliding.startTop = self.top;
	}

	function handleSlide() {
		var perc = Math.min(1, (new Date() - sliding.started) / sliding.duration);
		if (perc == 1) {
			sliding.enabled = false;
			self.x = sliding.destX;
			self.y = sliding.destY;
			if (sliding.handler)
				sliding.handler()
		} else {
			var newLeft = perc * sliding.deltaX + sliding.startLeft;
			var newTop = perc * sliding.deltaY + sliding.startTop;
			changeState('left', newLeft, true);
			changeState('top', newTop, true);
		}
	}

	function setFixed(isFixed) {
		if (isFixed) {
			$('#game').append(self.$el)
			self.depth = 10;
		} else {
			$('#game #world').append(self.$el)
			self.depth = 0;
		}
	}

  /*
    Adjusts this sprite to be the tile of the sheet specified.
    Possible usages:

      setTile(nr)
      setTile(column, row)
      setTile(columnStart, rowStart, columnEnd, rowEnd)
  */
  function setTile(tx, ty, tx2, ty2) {
    var sheet = self.sheet;
    if (!sheet) {
      throw 'sprite.setTile(-) cannot be called when the sprite is not retrieved from a SpriteSheet';
      return;
    }
    if (!sheet.columns || !sheet.rows) {
      throw 'You must call sheet.setGridSize(-,-) BEFORE doing getSprite(-)';
      return;
    }

    // when called from the sheet, no arguments are passed because the sprite knows its own, in sheetInfo
    if (arguments.length > 0) {
      // if no ty is specified, getSprite is called by 1-based index, so map to tx, ty
      if (ty === undefined) {
        var index = tx - 1;
        y = Math.floor(index / sheet.columns);
        x = index - (y * sheet.columns);
        tx = x + 1;
        ty = y + 1;
        return setTile(tx, ty);
      }

      // set the properties
      sheetInfo.tileX = tx;
      sheetInfo.tileY = ty;
      sheetInfo.tileX2 = tx2;
      sheetInfo.tileY2 = ty2;
    }
    updateSizeBySheet()
  }

  function updateSizeBySheet() {
    var sheet = self.sheet;
    // when the sheet is not ready, go back, this will be called later again from the sheet
    if (!sheet.tileWidth || !sheet.tileHeight) {
      return;
    }

    sheetInfo.tileNr          = (sheetInfo.tileY - 1) * sheet.columns + sheetInfo.tileX;

    // see if this sprite takes up multiple sheet-tiles, or just 1
    var tileCountH            = 1 + (sheetInfo.tileX2? (sheetInfo.tileX2 - sheetInfo.tileX) : 0);
    var tileCountV            = 1 + (sheetInfo.tileY2? (sheetInfo.tileY2 - sheetInfo.tileY) : 0);
    var size                  = self.size || self.height;
    var sizeFactor            = size / (sheet.tileHeight * tileCountV);
    var px                    = -((sheetInfo.tileX - 1) * sheet.tileWidth * sizeFactor);
    var py                    = -((sheetInfo.tileY - 1) * sheet.tileHeight * sizeFactor);

    self.width                = (sheet.tileWidth * tileCountH) * sizeFactor;
    self.height               = size;
    self.backgroundSize       = (sheet.width * sizeFactor) + 'px ' + (sheet.height * sizeFactor) + 'px';
    self.backgroundPosition   = px + 'px ' + py + 'px';
  }

  function animateTiles() {

  }

  function cycleTiles(tilesArr) {
    if (arguments.length > 1 && !Array.isArray(tilesArr)) {
      var arr = [];
      for (var i=0; i<arguments.length;i++) {
        arr.push(arguments[i])
      }
      return cycleTiles(arr);
    }
    if (Array.isArray(tilesArr) && tilesArr.length) {
      var isNewAnimation = !sheetInfo.animation || sheetInfo.animation.join(',') != tilesArr.join(',');
      if (isNewAnimation) {
        sheetInfo.animation = tilesArr;
        for (var i=0; i<tilesArr.length; i++) {
          var nr = tilesArr[i];
          if (nr == sheetInfo.tileNr) {
            found = true;
            sheetInfo.index = i;
            break;
          }
        }
        sheetInfo.index = 0;
      }
      sheetInfo.index++;
      if (sheetInfo.index > sheetInfo.animation.length - 1)
        sheetInfo.index = 0;

      var nr = sheetInfo.animation[sheetInfo.index];
      setTile(nr);
    }
    return self;
  }

	this.move = move;
	this.set = set;
	this.turn = turn;
	this.pointTo = pointTo;
	this.goto = goTo;
	this.goTo = goTo;
	this.hide = hide;
	this.show = show;
	this.remove = remove;
	this.clone = clone;
	this.touches = function() { return touches.apply(self, arguments); }
	this.onDOMReady = onDOMReady;
	this.redraw = redraw;
	this.nextImage = nextImage;
	this.cycle = cycle;
	this.jump = jump;
	this.slideTo = slideTo;
  this.setTile = setTile;
	//this.__defineGetter__('removed', () => self.removed);
	this.__defineGetter__('isSliding', function() { return sliding.enabled; });
	this.__defineGetter__('style', function() { return self.$el[0]? self.$el[0].style : {}; });
	this.__defineGetter__('touchedSolid', function() { return touchedSolid; });

	this.__defineGetter__('screenX', function() { return self.x + Screen.worldLeft; });
	this.__defineGetter__('screenY', function() { return self.y + Screen.worldTop; });

	this.allowStateChange = allowStateChange;
	this.allowMove = allowMove;
  this.cycleTiles = cycleTiles;
  this.animateTiles = animateTiles;
}

SpriteInstance.prototype.toString = function spriteToString() {
	var state = {
		front: 				{ value: 0 },
		rotation: 		{ value: 0, name: 'rotate', isTransform: true },
		scaleX: 			{ value: 1, isTransform: true },
		scaleY: 			{ value: 1, isTransform: true },
		width: 				{ value: 0, unit: 'px' },
		height: 			{ value: 0, unit: 'px' },
		background: 	{ value: 'transparent', name: 'backgroundColor' },
		image: 				{ value: '' },
		images: 			{ value: [], },
		depth: 				{ value: 1, name: 'zIndex' },
		left: 				{ value: 0, unit: 'px' },
		top: 					{ value: 0, unit: 'px' },
		x: 						{ value: undefined },
		y: 						{ value: undefined },
		right: 				{ value: undefined },
		bottom: 			{ value: undefined },
		size: 				{ value: undefined },
		flip: 				{ value: false },
		flipY: 				{ value: false },
		solid: 				{ value: false },
		gravity: 			{ value: false },
		fixed: 				{ value: false },
		opacity: 			{ value: 1 },
		transparency: { value: 0 },
	};

	var changedProps = '';
	for (var name in state) {
		if (this[name] != state[name].value) {
			changedProps += name + ': ' + this[name] + ', ';
		}
	}

	return 'Sprite(\'' + this.image + '\') {' + changedProps + '}';
}


// NEXT FILE

window._Screen = Screen;
var Screen = new (function ScreenInstance() {
	var self = this;
	self.$el = $('#game');
	self.$world = $('#world');
	self.isScreen = true;

	var defaultWidth = 540;
	var defaultHeight = 360;
	var delayedStyleProperties = {}; // used for setting any Screen.style.foo = bar properties that were set before DOMready

	var orientations = {
		portrait: { width: defaultHeight, height: defaultWidth },
		landscape: { width: defaultWidth, height: defaultHeight }
	}
	var useTranslate3d = true; // used for $world mostly
	var prefixes = ['-webkit-', '-moz-', '-ms-', ''];
	var statesChanged = {};
	var state = {
		//translate3d:  { value: '0,0,0', isTransform: true },
		rotation: 		{ value: 0, name: 'rotate', isTransform: true },
		scaleX: 			{ value: 1, isTransform: true },
		scaleY: 			{ value: 1, isTransform: true },
		width: 				{ value: defaultHeight, unit: 'px' },
		height: 			{ value: defaultWidth, unit: 'px' },
		background: 	{ value: 'white', name: 'backgroundColor' },
		image: 				{ value: undefined },
		depth: 				{ value: 1, name: 'zIndex' },
		left: 				{ value: 0, unit: 'px' },
		top: 					{ value: 0, unit: 'px' },
		x: 						{ value: undefined },
		y: 						{ value: undefined },
		right: 				{ value: defaultHeight, unit: 'px' },
		bottom: 			{ value: defaultWidth, unit: 'px' },
		flip: 				{ value: false },
		flipY: 				{ value: false },
		worldLeft: 		{ value: 0, unit: 'px' },
		worldTop: 		{ value: 0, unit: 'px' },
		orientation: 	{ value: 'portrait' }
	}
  var initialState = JSON.parse(JSON.stringify(state));

	init();

	function init() {
		//Ready.onResize(resize)
		if (document.body) onDOMReady();
		else Ready.onLoad(onDOMReady);
		initGettersAndSetters()
		// we need an initState here to set all the basic initial properties (width, height, left, top, ...)
		initState();
	}

	function onDOMReady() {
		self.$el = $('#game');
		self.$world = $('#world');
		adjustToOrientation();

		// we need another initState here to actually SET all the user defined properties that are applied to $el
		// (and $el is only available now)
		//initState();
		for (var o in delayedStyleProperties) {
			self.$el[0].style[o] = delayedStyleProperties[o];
		}
	}

	function adjustToOrientation() {
		if (!self.$el[0]) return;
		self.$el[0].style.visibility = 'hidden';
		setTimeout(function() {
			self.width = self.width;
			self.height = self.height;
			self.$el[0].style.visibility = 'visible';
		})
	}

	function initGettersAndSetters() {
		for (var name in state) {
			(function(n){
				var prop = state[n];
				self.__defineSetter__(n, function(v) { changeState(n, v) });
				self.__defineGetter__(n, function() { return state[n].value; });
			})(name);
		}
	}

	// takes all state values and set them
	function initState() {
		for (var name in state) {
			var prop = state[name];
			if (prop.value !== undefined) {
				self[name] = prop.value;
			}
		}
	}

	// act upon state changes
	function changeState(name, value, isSystem) {
		//console.log('changeState', name, value)
		var oldState = {}; for (var n in state) oldState[n] = state[n];
		state[name].value = value;
		statesChanged[name] = true;

		switch (name) {
			case 'left':
				// set virtual properties x and right
				state.x.value 			= value + Math.round(self.width / 2);
				state.right.value 	= value + self.width;
				break;
			case 'top':
				// set virtual properties y and bottom
				state.y.value 			= value + Math.round(self.height / 2);
				state.bottom.value 	= value + self.height;
				break;
			case 'x':
				self.left = value - Math.round(self.width / 2)
				break;
			case 'y':
				self.top = value - Math.round(self.height / 2)
				break;
			case 'right':
				self.left = value - self.width;
				break;
			case 'bottom':
				self.top = value - self.height;
				break;
			case 'image':
				// just trigger a getting of the image size
				Ready.getImageSize(value);
				break;
			case 'height':
				self.top = oldState.top.value;
				//self.marginTop = Math.floor((document.body.scrollHeight - value) / 2)
				break;
			case 'width':
				self.left = oldState.left.value;
				//console.log('width...', oldState.left.value)
				//self.marginLeft = Math.floor((document.body.scrollWidth - value) / 2)
				break;
			case 'flip':
				changeState('scaleX', (value == true || value == 1)? -1 : 1);
				break;
			case 'flipY':
				changeState('scaleY', (value == true || value == 1)? -1 : 1);
				break;
			case 'orientation':
				if (contains(Object.keys(orientations),value)) {
					self.value = value;
					var or = orientations[value];
					self.width = or.width;
					self.height = or.height;
					self.left = self.left;
					self.top = self.top;
					Ready.onOrientationChange(value);
				}
				break;
		}
		//redraw();
	}

	function redraw() {
		if (!Object.keys(statesChanged).length) return;

		// 1. for now redraw everything
		// 2. only redraw changed properties
		var transformValue = '';
		var cssModifiers = {};

		for (var n in statesChanged) {
			var prop = state[n];
					name = prop.name || n,
					value = prop.value;
			if (prop.isTransform) {
				var unit = (name == 'rotate')? 'deg' : '';
				transformValue += name + '(' + value + unit + ') '
			} else {
				// set cssModifiers
				switch (n) {
					case 'x':
					case 'y':
					case 'right':
					case 'bottom':
					case 'flip':
					case 'flipY':
					case 'worldLeft':
					case 'worldTop':
					case 'orientation':
						// don't render anything for these properties
						break;
					case 'image':
						var imagePath = Ready.fixImageUrl(value);
						cssModifiers['background-image'] = 'url(' + imagePath + ')';
						break;
					default:
						if (prop.unit) {
							var needsUnit = !/\%|px/i.test(value+'');
							if (needsUnit)
								value += prop.unit;
						}
						cssModifiers[name] = value;
						break;
				}
			}
		}
		if (transformValue != '') {
			for (var i in prefixes) {
				var prefix = prefixes[i]
				cssModifiers[prefix + 'transform'] = transformValue;
			}
		}
		$(self.$el).css(cssModifiers);

		// world specifics
		if (statesChanged.worldLeft || statesChanged.worldTop) {
			var worldCssModifiers = {};
			if (useTranslate3d) {
				for (var i in prefixes) {
					var prefix = prefixes[i]
					worldCssModifiers[prefix + 'transform'] = 'translate3d(' + state.worldLeft.value + 'px, ' + state.worldTop.value + 'px, 0)';
				}
			} else {
				if (statesChanged.worldLeft) worldCssModifiers.left = state.worldLeft.value + 'px';
				if (statesChanged.worldTop) worldCssModifiers.top = state.worldTop.value + 'px';
			}
			self.$world.css(worldCssModifiers);
		}

		statesChanged = {};
	}

	function move(name, value) {
		// when moving a number only, move in the current direction
		if (!value && typeof name == 'number') {
			var deg = state.rotation.value;
			var radians = deg * (Math.PI/180);
			var dx = Math.cos(radians) * name;
			var dy = Math.sin(radians) * name;
			self.move({x:dx, y:dy})
			return self;
		}
		// when a set of name/values are given, move along those
		if (typeof name == 'object') {
			for (var n in name) {
				move(n, name[n])
			}
			return self;
		}
		var prop = state[name];
		if (prop) {
			set(name, prop.value + value);
		}
		return self;
	}

	function set(name, value) {
		if (typeof name == 'object') {
			for (var n in name) {
				set(n, name[n])
			}
			return self;
		}
		if (state[name])
			self[name] = value; // use public property ti cause automatic setting/drawing

		return self;
	}

	function turn(value) {
		if (value === undefined) {
			self.rotation += 180;
			self.flipY = !self.flipY;
		} else {
			self.rotation += isNaN(value)? 0 : value;
		}
		return self;
	}

	function pointTo(value) {
		self.rotation = isNaN(value)? 0 : value;
		return self;
	}

	function hide() {
		self.$el.hide();
		return self;
	}

	function show() {
		self.$el.show();
		return self;
	}

	function portrait() {
		self.orientation = 'portrait';
		adjustToOrientation();
	}

	function landscape() {
		self.orientation = 'landscape';
		adjustToOrientation();
	}

	// centers the screen around a sprite
	// @box optional left/top/right/bottom exposing object
	function center(sprite, box) {
		box = box || (Level.currentLevel? Level.currentLevel.sprites : screen);
		var needsHorizontalCenter = (box.right - box.left) > Screen.width;
		var needsVerticalCenter = (box.bottom - box.top) > Screen.height;
		// horizontal check
		if (needsHorizontalCenter) {
			var dx = sprite.x + self.worldLeft - Math.floor(self.width / 2);
			if (dx > 0) {
				// use the curret levelSet for checking center boundaries
				var max = box.right;
				if (self.worldLeft - dx > -(max - self.width))
					self.worldLeft -= dx;
				else
					self.worldLeft = -(max - self.width);
			}
			if (dx < 0) {
				var min = box.left;
				if (self.worldLeft - dx < -min)
					self.worldLeft -= dx;
				else
					self.worldLeft = -min;
			}
		}
		// vertical check
		if (needsVerticalCenter) {
			var dy = sprite.y + self.worldTop - Math.floor(self.height / 2);
			if (dy > 0) {
				// use the curret levelSet for checking center boundaries
				var max = box.bottom;
				if (self.worldTop - dy > -(max - self.height))
					self.worldTop -= dy;
				else
					self.worldTop = -(max - self.height);
			}
			if (dy < 0) {
				var min = box.top;
				if (self.worldTop - dy < -min)
					self.worldTop -= dy;
				else
					self.worldTop = -min;
			}
		}
	}

  function clear() {
    state = initialState;
    initGettersAndSetters()
    initState();
    $('#game').remove();
    $('body').append('<div id="game"><div id="meta"></div><div id="world"></div></div>');
    self.$el = $('#game');
    self.$world = $('#world');
  }

	this.move = move;
	this.set = set;
	this.turn = turn;
	this.pointTo = pointTo;
	this.hide = hide;
	this.show = show;
	this.onDOMReady = onDOMReady;
	this.redraw = redraw;
	this.portrait = portrait;
	this.landscape = landscape;
	this.center = center;
  this.clear = clear;
	this.__defineGetter__('style', function() { return self.$el[0]? self.$el[0].style : delayedStyleProperties; });
})();


// NEXT FILE

window.Mouse = new (function MouseInstance(){
  var self = this;
  var x = Screen.x || 0; // center of screen if possible
  var y = Screen.y || 0; // center of screen if possible
  var isDown = false;
  self.sprite = undefined;

  document.addEventListener('mousedown', mousedown)
  document.addEventListener('mouseup', mouseup)
  document.addEventListener('mousemove', mousemove)

  document.addEventListener('touchstart', mousedown)
  document.addEventListener('touchend', mouseup)
  document.addEventListener('touchmove', touchmove)

  function mousedown(evt) {
    isDown = true;
  }

  function mouseup(evt) {
    isDown = false;
  }

  function mousemove(evt) {
    if (!evt.which) isDown = false;
    checkForSprite(evt);
    if (Screen.$el[0]) {
      x = evt.pageX - Screen.$el[0].offsetLeft;
      y = evt.pageY - Screen.$el[0].offsetTop;
    }
  }

  function touchmove(evt) {
    if (Screen.$el[0]) {
      checkForSprite(evt);
      x = evt.touches[0].pageX - Screen.$el[0].offsetLeft;
      y = evt.touches[0].pageY - Screen.$el[0].offsetTop;
    }
  }

  function checkForSprite(evt) {
    var xyEvt = evt.touches? evt.touches[0] : evt;
    var x = xyEvt.pageX, y = xyEvt.pageY;
    var el = document.elementFromPoint(x, y)
    if (el && el.className == 'sprite') {
      self.sprite = Sprite.sprites[el.id];
    } else {
      self.sprite = undefined;
    }
  }

  this.__defineGetter__('x', function() { return x; });
  this.__defineGetter__('y', function() { return y; });
  this.__defineGetter__('down', function() { return isDown; });
})


// NEXT FILE

function Level() {
  var obj = Object.create(LevelInstance.prototype);
  LevelInstance.apply(obj, arguments);
  return obj;
}

// singleton access to current level -> Screen needs this
Level.currentLevel = undefined;

function LevelInstance(tileWidth, tileHeight) {
	var self = this;
	self.sprites = SpriteList();
	var state = {
    data:         { value: [] },
		tileWidth: 		{ value: tileWidth || 50 },
		tileHeight: 	{ value: tileHeight || tileWidth || 50 }
	}
	var tileMap = {};
	init();

	function init() {
		initGettersAndSetters()
		initState();
	}

	function initGettersAndSetters() {
		for (var name in state) {
			(function(n){
				var prop = state[n];
				self.__defineSetter__(n, function(v) { changeState(n, v) });
				self.__defineGetter__(n, function() { return state[n].value; });
			})(name);
		}
	}

	// takes all state values and set them
	function initState() {
		for (var name in state) {
			var prop = state[name];
			if (prop.value !== undefined) {
				self[name] = prop.value;
			}
		}
	}

	// act upon state changes
	function changeState(name, value) {
		state[name].value = value;
	}

	// generic setter
  function set(name, value) {
		if (typeof name == 'object') {
			for (var n in name) {
				set(n, name[n])
			}
			return self;
		}
		if (state[name])
			self[name] = value; // use public property to cause automatic setting/drawing

		return self;
	}

	function load(p1) {
		if (arguments.length == 1 && Array.isArray(p1)) {
      // assign the array as data
      self.data = p1;
    } else {
      var arr = [];
      for (var i=0; i<arguments.length; i++) {
        arr[i] = arguments[i];
      }
      return load(arr);
    }
	}

  function clear() {
    self.sprites.clear();
    Level.currentLevel = undefined;
  }

  function setTileSize(tileWidth, tileHeight) {
    self.tileWidth = tileWidth;
    self.tileHeight = tileHeight;
  }

	// image or props are optional, although not both
  function setTile(char, image, props) {
    if (!props && typeof image == 'object') {
      props = image;
      image = undefined;
    }
		props = props || {};
    if (image) {
      props.image = image;
    }
    tileMap[char] = props;
	}

	function draw(startX, startY) {
    Level.currentLevel = self;
		self.sprites.clear();
		startX = startX || 0;
		startY = startY || 0;
		var levelData = state.data.value;

		for (var y=0; y<levelData.length; y++) {
			var str = levelData[y];
			for (var x=0; x<str.length; x++) {
				var ch = str.charAt(x);
				var px = startX + state.tileWidth.value * x;
				var py = startY + state.tileHeight.value * y;
				var map = tileMap[ch];

				if (map) {
					spr = Sprite();
					spr.width = state.tileWidth.value;
					spr.height = state.tileHeight.value;
					spr.left = px;
					spr.top = py;
          spr.__levelChar = ch;
					for (var n in map) {
						switch (n) {
							default:
								spr[n] = map[n];
						}
					}
          // remember our own set of sprites
					self.sprites.add(spr)
				}
			}
		}
	}

	function getSprite(char) {
    for (var i=0; i<self.sprites.length; i++) {
      var sprite = self.sprites[i];
      if (sprite && sprite.__levelChar == char) {
        return sprite;
      }
    }
	}

  function getSpriteList(chars) {
    if (!chars) return self.sprites;
    var list = SpriteList();
    for (var i=0; i<self.sprites.length; i++) {
      var sprite = self.sprites[i];
      if (sprite && sprite.__levelChar && chars.indexOf(sprite.__levelChar) >= 0) {
        list.add(sprite)
      }
    }
    return list;
  }

	this.load = load;
  this.setTileSize = setTileSize;
  this.setTile = setTile;
  this.draw = draw;
  this.getSprite = getSprite;
  this.getSpriteList = getSpriteList;
  this.clear = clear;
}


// NEXT FILE

function Sound() {
  if (arguments.length) {
    var obj = Object.create(SoundEffect.prototype);
    SoundEffect.apply(obj, arguments);
    return obj;
  }
}
Sound.id = 0;
Sound.sounds = {};
Sound.stop = function() {
  for (var id in Sound.sounds) {
    Sound.sounds[id].stop();
  }
}
Sound.clear = function() {
  Sound.stop();
  Sound.sounds = {};
  Sound.id = 0;
}

function SoundEffect(path) {
  var self = this;
  var state = {
    instances:   [],
    loop:       false,
    current:    1,
    count:      10,
    volume:     100
  }

  init();

  function init() {
    Sound.id++;
    self.id = 'sound' + Sound.id;
    Sound.sounds[self.id] = self;

    for (var i=0; i<state.count; i++) {
      var audio = new Audio(encodeURI(path));
      audio.preload = true;
      audio.load();
      audio.volume = state.volume / 100;
      audio.loop = state.loop;
      state.instances.push(audio);
    }
  }

  function play() {
    state.current = ++state.current % state.count;
    if (state.loop) {
      var audio = state.instances[state.current];
      if (audio.seekTo)
        audio.seekTo(0);
      audio.play({numberOfLoops:999,playAudioWhenScreenIsLocked: false});
    } else {
      state.instances[state.current].play({playAudioWhenScreenIsLocked : false});
    }
  }

  function stop() {
    for (var i=0; i<state.count; i++) {
      var audio = state.instances[i];
      if (audio) {
        audio.pause();
      }
    }
  }

  function changeState(name, value) {
    state[name] = value;
    switch (name) {
      case 'volume':
        for (var i=0; i<state.count; i++) {
          var audio = state.instances[i];
          if (audio) {
            audio.volume = value / 100;
          }
        }
        break;
      case 'loop':
        for (var i=0; i<state.count; i++) {
          var audio = state.instances[i];
          if (audio) {
            audio.loop = value;
          }
        }
        break;
    }
  }

  this.play = play;
  this.stop = stop;
  this.__defineGetter__('loop', function(){ return state.loop });
  this.__defineSetter__('loop', function(v){ changeState('loop', v); });
  this.__defineGetter__('volume', function(){ return state.volume });
  this.__defineSetter__('volume', function(v){ changeState('volume', v); });
}


// NEXT FILE

var Storage = new (function() {
  var self = this,
      _id,
      data = {};

  function init(id) {
    _id = id;
    data = JSON.parse(localStorage.getItem(_id) || '{}');
  }

  function save() {
    if (!_id) console.error('no id set for storage.js')
    localStorage.setItem(_id, JSON.stringify(data));
  }

  function get(name, defaultValue) {
    if (!_id) console.error('no id set for storage.js')
    if (data[name] === undefined) {
      if (defaultValue != undefined)
        return defaultValue;
      else
        return undefined;
    }
    return data[name];
  }

  function set(name, value) {
    data[name] = value;
    save();
  }

  function clear(cb) {
    localStorage.clear();
  }

  this.init = init;
  this.clear = clear;
  this.set = set;
  this.get = get;
  this.__defineGetter__('data', function() { return data; });
})();

Storage.init('ready');

// NEXT FILE

function SpriteSheet() {
  var obj = Object.create(SpriteSheetInstance.prototype);
  SpriteSheetInstance.apply(obj, arguments);
  return obj;
}

function SpriteSheetInstance(image, columns, rows) {
  var self = this;
  var spritesBasedOnSheet = SpriteList();
  var state = {
    columns:      { value: columns || 0 },
    rows:         { value: rows || 0 },
    width:        { value: 0 },
    height:       { value: 0 },
    tileWidth:    { value: 0 },
    tileHeight:   { value: 0 },
    image:        { value: image || '' }
  }
  init();

  function init() {
    initGettersAndSetters()
    initState();
  }

  function initGettersAndSetters() {
    for (var name in state) {
      (function(n){
        var prop = state[n];
        self.__defineSetter__(n, function(v) { changeState(n, v) });
        self.__defineGetter__(n, function() { return state[n].value; });
      })(name);
    }
  }

  // takes all state values and set them
  function initState() {
    for (var name in state) {
      var prop = state[name];
      if (prop.value !== undefined) {
        self[name] = prop.value;
      }
    }
  }

  // generic setter
  function set(name, value) {
    if (typeof name == 'object') {
      for (var n in name) {
        set(n, name[n])
      }
      return self;
    }
    if (state[name])
      self[name] = value; // use public property to cause automatic setting/drawing

    return self;
  }

  // act upon state changes
  function changeState(name, value) {
    state[name].value = value;
    switch (name) {
      case 'image':
        Ready.getImageSize(self.image, imageSizeCallback);
        break;
      case 'columns':
      case 'rows':
      case 'tileWidth':
      case 'tileHeight':
        updateSpritesBasedOnSheet();
        break;
    }
  }

  function imageSizeCallback(url, size) {
    if (size.width && size.height) {
      self.width = size.width;
      self.height = size.height;
      updateSpritesBasedOnSheet();
    }
  }

  function setGridSize(columns, rows) {
    self.columns = columns;
    self.rows = rows;
  }

  /*
    Retrieve sprite by tx, ty (1-based!).
    When only one param is passed, it is the sprite index (also 1 based!)
    When four params are passed, this sprite consists of multiple tiles (like a high building or tall tree)
  */
  function getSprite(tx, ty, tx2, ty2) {
    if (!self.columns || !self.rows) {
      throw 'You must call sheet.setGridSize(-,-) BEFORE doing getSprite(-)';
      return;
    }
    var sprite = Sprite(image);
    spritesBasedOnSheet.add(sprite);
    sprite.sheet = self;
    sprite.setTile(tx, ty, tx2, ty2);
    return sprite;
  }

  // check if all properties are known (width, height, rows, columns)
  // and update all already-created sprites based on our info
  function updateSpritesBasedOnSheet() {
    // see if we know the basics
    if (!self.width || !self.height || !self.columns || !self.rows)
      return;
    // see if we've already calculated tileWidth and tileHeight
    if (!self.tileWidth) {
      self.tileWidth = self.width / self.columns;
      return;
    }
    if (!self.tileHeight) {
      self.tileHeight = self.height / self.rows;
      return;
    }
    each(spritesBasedOnSheet, updateSprite);
  }

  // update a single sprite based on full known sheet info
  function updateSprite(sprite) {
    sprite.setTile();
  }

  this.setGridSize = setGridSize;
  this.getSprite = getSprite;
}
