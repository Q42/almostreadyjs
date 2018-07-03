# Arkanoid

## Wat gaan we maken?

Je kent het spel wel: een bal die rondstuitert en blokjes wegtikt. En jij bestuurt een plankje onderin die de bal moet opvangen. Dat gaan we maken!

Het uiteindelijke spel ziet er zo uit:

![screenshot](images/arkanoid.png)

## Wat leer je in deze les?

* Dingen op het scherm tekenen met "Sprites", zoals een bal en blokken
* Hoe je een bal laat rondvliegen en stuiteren tegen de rand van het scherm
* Hoe je met de muis jouw paddle kunt besturen
* Wat een gameloop is en waarom je die nodig hebt
* De achtergrond van het scherm een kleur geven
* Hoe je blokken kunt raken met een bal
* En vast veel meer!

Laten we beginnen!

## Beginnen

Begin met een nieuw bestand in Kladblok (Windows) of TextEdit (Mac) waarin je ReadyJS en de afbeeldingen inlaadt. Dat doe je met deze regels code:

`<script src="https://q42.github.io/almostreadyjs/ready.js"/></script><script>`

`Game.path = 'https://storage.googleapis.com/readyjs-filesimages/_demos'`

`// Jouw code gaat hier!`

`</script>`


## Stap 1: Een bal op het scherm zetten

Bijna elk ding wat je op het scherm wilt zetten is een `Sprite`. Een `Sprite` kun je verplaatsen, laten ronddraaien, groter of kleiner maken en noem maar op. Je geeft je `Sprite` meestal een plaatje. Kijk zo:
```javascript
var ball = Sprite('images/ball.png')
```
Daarmee tekenen we dus ons eerste ding op het scherm en we geven het de naam `ball`. Wat voor ding is het? Een `Sprite` met een plaatje `'images/ball.png'`.
> Bij programmeren spreek je niet over *dingen* maar over *variabelen*. Dus `ball` is een *variabele*, van het type `Sprite`.
Daarna zeggen we hoe groot de bal is. Dat doe je met `size`:
```javascript
ball.size = 20
```
In de volgende stap gaan we de bal ergens op het scherm zetten.

### Zo ziet je code er nu uit
```javascript
var ball = Sprite('images/ball.png')
ball.size = 20
```


## Stap 2: x en y

Alles op je scherm heeft een plek. Die geef je aan met `x` en `y`.

> `x` is horizontaal, dus ergens tussen links en rechts.
`y` is verticaal, dus ergens tussen boven en beneden.

De bal neerzetten doen we zo:

```
ball.x = 20
ball.y = 350
```

Als je de getallen verandert staat het schip telkens op een andere plek.
Probeer maar eens!

> Je kunt `x` en `y` ook in één keer veranderen met `ball.goto(x,y)`. Je zou dus ook `ball.goto(20, 350)` kunnen schrijven.

### Zo ziet je code er nu uit
```javascript
var ball = Sprite('images/ball.png')
ball.size = 20
ball.x = 20
ball.y = 350
```

## Stap 3: De bal bewegen.

Je hebt geleerd dat je een `Sprite` op een plek kunt zetten door zijn `x` en `y` te veranderen. Als je bij de `x` telkens `1` zou optellen dan verschuift de bal naar rechts. Doe je dat bij de `y` dan gaat de bal omlaag. Trek je telkens `1` af van de `y` dan gaat de bal omhoog.

Zullen we dat gaan doen? Voeg dit toe:
```javascript
on.gameloop(function moveBall() {
  ball.move(1, -1)
})
```
Dat ziet er wat moeilijk uit, toch? Wat gebeurt hier nou eigenlijk?

Als je maar één keer je bal zou verplaatsen dan zie je hem niet echt op je beeld bewegen. Je wilt dat de bal *de hele tijd* beweegt. Daarvoor heb je de `gameloop` nodig. De `gameloop` wordt de hele tijd in je spel opnieuw uitgevoerd!

> Een `gameloop` is de gebeurtenis waar alles van je spel gebeurt. De `gameloop` wordt de hele tijd opnieuw uitgevoerd zolang je spel gespeeld wordt.

Een lege `gameloop` schrijf je zo:

```javascript
on.gameloop(function spel() {
  // doe hier wat je wilt
})
```

Met `on.` kun je luisteren naar iets dat gebeurt. Een klik van de muis, een druk op een toets, of in dit geval het opnieuw uitvoeren van een `gameloop`. Met `function() {` start je een nieuw stuk code en sluit je af met `}`. Omdat we beginnen met`on.gameloop(` is het laatste `)` haakje ook nodig.

### Zo ziet je code er nu uit
```javascript
ball = Sprite('images/ball.png')
ball.size = 20
ball.x = 20
ball.y = 350

on.gameloop(function moveBall() {
  ball.move(1, -1)
})
```
