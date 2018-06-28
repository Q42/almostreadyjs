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
