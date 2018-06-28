window._Screen = Screen;
var Screen = new (function ScreenInstance() {
	var self = this;
	self.$el = $('#game');
	self.$world = $('#world');
	self.isScreen = true;

	var defaultWidth = 540;
	var defaultHeight = 360;

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
		initState();
	}

	function onDOMReady() {
		self.$el = $('#game');
		self.$world = $('#world');
		adjustToOrientation();
		//initState();
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
	this.__defineGetter__('style', function() { return self.$el[0]? self.$el[0].style : {}; });
})();
