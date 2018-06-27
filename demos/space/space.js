ship = Sprite('images/ship.png')
ship.goto(250, 450)
ship.size = 50
ship.z = 10;

laser = Sprite('images/laser.png')
laser.size = 30
laser.hide();

enemy = Sprite('images/enemy.png')
enemy.size = 40;
enemy.hide();

lasers = SpriteList();
enemies = SpriteList();

Screen.image = 'images/space.png'
Screen.pos = 1;

for (nr=1; nr<6; nr++) {
  enemies.add(enemy.clone(nr * 60 - 20, 40))
  enemies.add(enemy.clone(nr * 60 - 20, 100))
}

on.mousemove(function() {
  ship.x = Mouse.x;
  if (ship.left < 0) ship.left = 0;
  if (ship.right > Screen.right) ship.right = Screen.right;
})

on.click(function() { lasers.add(laser.clone(ship)) })

on.gameloop(function(e) {
  enemies.each(function(enemy) {
    enemy.move(5)
    if (enemy.touches(Screen)) {
      enemy.turn().move('y', 20);
    }
    if (enemy.touches(lasers))
      enemy.remove()
  })

  if (ship.touches(enemies))
    Ready.stop()

  lasers.each(function(laser) {
    laser.move('y', -10)
    if (laser.touches(Screen)) laser.remove();
  })
  Screen.style.backgroundPosition = 'center ' + Screen.pos++ + 'px'
})
