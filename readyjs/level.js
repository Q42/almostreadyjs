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
