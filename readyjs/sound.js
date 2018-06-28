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
