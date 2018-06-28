# ReadyJS handleiding

## Een Sprite

## Het scherm

## Gebruik je muis

Als je op een laptop of computer zit heb je een muis (of trackpad).

- `Mouse.x` en `Mouse.y` geven de plek van de muis op het scherm aan.
- `Mouse.isDown` geeft terug of de muis ingedrukt is.

Voorbeeld:
```javascript
var schip = Sprite('images/schip.png')
if (Mouse.isDown) {
  schip.x = Mouse.x
  schip.y = Mouse.y
}
```

## Gebruik je toetsenbord



Op een mobieltje heb je natuurlijk geen toetsenbord met pijltjes. Om wel pijltjes te kunnen gebruiken kun je deze op het scherm aanzetten hiermee:

- `Controls.left.show()` toont het pijltje naar links
- `Controls.right.show()` toont het pijltje naar rechts
- `Controls.up.show()` toont het pijltje naar boven
- `Controls.down.show()` toont het pijltje naar beneden

## Maak een level

Voor veel spellen heb je een level nodig waar de speler doorheen kan bewegen. Die heeft muren waar je niet tegenaan mag lopen, en vijanden die bewegen.

Een level is een rechthoek die bestaat uit blokken, die `Tiles` heten. Elke `Tile` kan een `Sprite` zijn, bijvoorbeeld een muur, je speler of een vijand.

Hieronder een voorbeeld uit [de Arkanoid 2 demo](https://q42.github.io/almostreadyjs/demos/arkanoid2/arkanoid2.html).

```javascript
level = Level()
level.setTileSize(60, 30)
level.setTile('r', 'images/block-red.png')
level.setTile('w', 'images/block-grey.png')
level.load(
'r     ',
'rrr   ',
'rrrrr ',
'wwwwww',
)
level.draw()
```