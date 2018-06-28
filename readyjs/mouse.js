window.Mouse = new (function MouseInstance(){
  var self = this;
  var x = 0;
  var y = 0;
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
