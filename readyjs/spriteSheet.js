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

  function setTileOnSprite(sprite, tx, ty, tx2, ty2) {
    spritesBasedOnSheet.add(sprite);
    sprite.image = image;
    sprite.sheet = self;
    sprite.setTile(tx, ty, tx2, ty2);
	}

  // update a single sprite based on full known sheet info
  function updateSprite(sprite) {
    sprite.setTile();
  }

  this.setGridSize = setGridSize;
  this.getSprite = getSprite;
  this.setTileOnSprite = setTileOnSprite;
}
