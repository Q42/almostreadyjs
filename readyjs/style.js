(function(){
  var css = `
  html, body {
    padding: 0; margin: 0;
    background: #000; color: #fff;
  }
  #meta {
    position: absolute;
    left: -999999px; top: -999999px;
    pointer-events: none;
    visibility: hidden;
  }
  .sprite {
    position: absolute;
    left: 0; top: 0;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility:    hidden;
    -ms-backface-visibility:     hidden;
    backface-visibility: hidden;
  }
  .sprite.inspector-selected {
    z-index: 100 !important;
  }
  .sprite.inspector-selected:before {
    content: '';
    display: block;
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    background: rgba(80,80,255, .7);
  }
  .sprite.inspector-selected:after {
    content: '';
    display: block;
    position: absolute;
    left: -2px; top: -2px; right: -2px; bottom: -2px;
    border: solid red 2px;
  }
  #game {
    position: relative;
    overflow: hidden;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -moz-touch-callout: none;
    -ms-touch-callout: none;
    touch-callout: none;
    /*
    top: 50%; left: 50%;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility:    hidden;
    -ms-backface-visibility:     hidden;
    backface-visibility: hidden;
    */
  }
  #world {
    position: absolute;
  }
  `;

  setTimeout(init);

  function init() {
    var head = document.getElementsByTagName('head')[0];
    if (!head) return setTimeout(init, 0);
    var style = document.createElement('style');
    style.innerHTML = css;
    head.appendChild(style);
  }
})();
