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
