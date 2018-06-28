function ViewportMaster({element, width, height, keepCentered}) {
	var self = this;
  if (!width) width = element.getBoundingClientRect().width;
  if (!height) height = element.getBoundingClientRect().height;
  var app = { width, height };
  console.log(app)
  var isMobileEmu = /mac|win/i.test(navigator.platform) && /ipad|iphone|ipod|android/i.test(navigator.appVersion);
  var isMobile = isMobileEmu || window.orientation !== undefined;

  if (keepCentered) {
    element.style.width = app.width + 'px';
    element.style.height = app.height + 'px';
  }

  var oldOnresize = window.onresize;
  window.onresize = function() { resize(); if (oldOnresize) oldOnresize() };
  window.addEventListener("orientationchange", orientationchange);
  adjust();

  function adjust() {
    document.body.style.display = 'hidden';
    console.log('adjust')
    if (keepCentered)
      element.style.margin = '';

    if (!isMobile) {
      if (!keepCentered) return;

      var visibleHeight = document.body.scrollHeight;
      var visibleWidth = document.body.scrollWidth;
      element.style.marginTop = Math.floor((visibleHeight - app.height) / 2) + 'px';
      element.style.marginLeft = Math.floor((visibleWidth - app.width) / 2) + 'px';
      return;
    }

    var angle = window.orientation || 0;
    var flipWidthHeight = angle in { '-90': 1, 90: 1}
    var scr = flipWidthHeight? { width: Screen.height, height: Screen.width } : screen;
    var screenRatio = scr.width/scr.height;
    var appRatio = app.width / app.height;
    var scaleToWidth = appRatio >= screenRatio;
    var content = [];
    if (scaleToWidth) {          
      content.push('width=' + app.width);
      if (keepCentered) {
        var visibleHeight = Math.floor((app.width / document.body.scrollWidth) * document.body.scrollHeight);
        visibleHeight = Math.min(visibleHeight, window.innerHeight);
        element.style.marginTop = Math.floor((visibleHeight - app.height) / 2) + 'px';
      }
    } else {
      content.push('height=' + app.height);
      if (keepCentered) {
        var visibleWidth = Math.floor((app.height / document.body.scrollHeight) * document.body.scrollWidth);
        visibleWidth = Math.min(visibleWidth, window.innerWidth);
        element.style.marginLeft = Math.floor((visibleWidth - app.width) / 2) + 'px';
      }
    }
    content.push('user-scalable=0')

    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', content.join(', '));
    document.body.style.display = '';
  }
  
  function orientationchange() {
    setTimeout(adjust, 400)
  }

  function resize() {
    if (!isMobile) adjust();
  }
};