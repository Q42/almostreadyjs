Screen.background = '#d0f4f7'

level = Level()
level.setTileSize(50, 50)
level.setTile('-', 'images/grassMid.png', { solid: true })
level.setTile('/', 'images/grassCenter.png', { solid: true })
level.setTile('!', 'images/boxItem.png', { solid: true })
level.setTile('%', 'images/castleCenter_rounded.png', { solid: true })
level.setTile('@', { images: ['images/spider_walk1.png', 'images/spider_walk2.png'], gravity: true, size: 30 })
level.setTile('X', { gravity: true, size: 65, z: 10 })
level.load(
'                ',
'                ',
'                ',
'      %%        ',
'  %             ',
'     %          ',
'@       %       ',
'%!%   %%%%%%%   ',
'                ',
'    %           ',
'         %      ',
'X % %!%         ',
'         %%     ',
'- @     %%% %   ',
'/---------- ----',
'/////////// ////',
'/////////// ////',
'/////////// ////',
'/              /',
'/              /',
'////////////////',
)
level.draw(0, Screen.bottom - 8 * 50)

player = level.getSprite('X')
enemies = level.getSpriteList('@')
for (nr=1; nr<10; nr++) player.images.push('images/p1_walk0' + nr + '.png')

// // Controls.left.show()
// // Controls.right.show()
// // Controls.up.show()
// // Controls.down.show()
// // Controls.button2.set('image', 'controls/flatDark44.png').bind('up').show()

on.keydown(function(e) {
  if (e.key == 'left' && player.left > 0) player.move(-3).set('flip', 1).nextImage(2)
  if (e.key == 'right' && player.right < level.sprites.right) player.move(3).set('flip', 0).nextImage(2)
})
on.keyup('left right', function(e) { player.image = 'images/p1_walk08.png' })
on.keypress('up', function(e) { player.jump(3) })

function platformer(e) {
  Screen.center(player)
  enemies.each(function(e) {
    if (!e.isDead) {
      e.move(2)
      e.nextImage(15)
      if (e.touchedSolid) e.turn()
    }
  })
  if (player.touches('left right', enemies)) die(player)
  var killedEnemy = player.touches('top', enemies);
  if (killedEnemy) die(killedEnemy);
}

repeat(platformer)

function die(sprite) {
  sprite.isDead = true;
  sprite.z = 2;
  sprite.pointTo(0).flipY = true;
  sprite.slideTo(sprite.x, sprite.y + 100, 0.4, function(e) { sprite.remove() })
}
