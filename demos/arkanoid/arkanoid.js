paddle = Sprite('images/paddle.png')
paddle.size = 20
paddle.goto(Screen.x, Screen.bottom - 15)

ball = Sprite('images/ball.png')
ball.size = 20
ball.goto(paddle.x, paddle.y - 20)

block = Sprite('images/block-yellow.png')
block.size = 30
block.hide()

speedX = 3
speedY = -3
blocks = SpriteList()

Screen.background = '#45598b'

for (x=1; x<=6; x++) {
	blocks.add(block.clone(x * 60 - 30, 30))
	blocks.add(block.clone(x * 60 - 30, 60))
	blocks.add(block.clone(x * 60 - 30, 90))
}

function spel() {
	//console.log(Mouse.x)
	paddle.x = Mouse.x
	if (ball.right > Screen.right) speedX = -speedX
	if (ball.left < Screen.left) speedX = -speedX
	if (ball.top < Screen.top) speedY = -speedY
	if (ball.bottom > Screen.bottom) speedY = -speedY

	if (ball.touches(paddle) && speedY > 0) {
		speedX = 3 * (ball.x - paddle.x) / (paddle.width / 2)
		speedY = -speedY
	}

	var hitBlock = ball.touches(blocks)
	if (hitBlock) {
		hitBlock.remove()
		speedY = -speedY
	}

	ball.move(speedX, speedY)
}

repeat(spel)
