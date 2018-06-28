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
						cssModifiers['background-image'] = 'url(' + encodeURI(value) + ')';
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
