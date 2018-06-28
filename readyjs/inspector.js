Ready.Inspector = new (function(){

  function clear() {
    $('.inspector-selected').removeClass('inspector-selected');
  }

  function isEnabled() {
    return !Ready.started && Screen.$el[0];
  }

  function mousemove(evt, x, y) {
    if (!isEnabled()) return; // always allow mouse move

    window.parent.postMessage({
      action: 'pointer',
      position: { x: x, y: y }
    }, '*')
  }

  function click(evt, sprite) {
    if (!isEnabled()) return;

    if (sprite) {
      $('.inspector-selected').removeClass('inspector-selected');
      sprite.$el.addClass('inspector-selected');

      window.parent.postMessage({
        action: 'selectSprite',
        sprite: sprite.state
      }, '*')
    }
  }

  this.mousemove = mousemove;
  this.click = click;
  this.clear = clear;
});
