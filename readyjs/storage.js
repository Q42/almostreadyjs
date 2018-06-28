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