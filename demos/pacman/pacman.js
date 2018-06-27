Screen.background = '#000'

sprites = SpriteSheet('images/pacman.png', 3, 4)
pacmanLeft = sprites.getSprite(1)

level = Level()
level.setTileSize(40, 40)
level.setTile('x', 'images/maze.png', { solid: true })
level.setTile('@', pacmanLeft, { solid: true, size: 40, z: 10 })
level.load(
'xxxxxxxxx',
'x       x',
'x x x x x',
'x x x x x',
'x   @   x',
'x x x x x',
'x x x x x',
'x       x',
'xxxxxxxxx',
)
level.draw()

player = level.getSprite('@')

// beweeg de speler een andere kant op als je een knop indrukt
rotation = null
repeat(function() {
	if (rotation !== null) {
		player.rotation = rotation;
		player.move(2);
	}
})

on.keypress('left', function() { rotation = 180 });
on.keypress('right', function() { rotation = 0 });
on.keypress('up', function() { rotation = 270 });
on.keypress('down', function() { rotation = 90 });
