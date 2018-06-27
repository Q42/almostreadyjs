/**
 * 
 * 
 * Opdracht 1
 * 
 * Laat het schip sneller bewegen
 * 
 * Opdracht 2
 * 
 * Laat het schip naar links bewegen door het pijltje naar links ('left') in te drukken
 * 
 */
 
var schip = Sprite('images/schip.png')

schip.x = 100
schip.y = 500

on.gameloop(beweegSchip)

function beweegSchip(){
  schip.y = schip.y - 1
}

// door op het pijltje naar rechts ('right') te drukken, beweegt het schip naar rechts (x + 1)
on.keypress('right', beweegRechts)

function beweegRechts() {
  schip.x = schip.x + 5
}

// schrijf nu de code om het schip naar links te laten bewegen

on.keypress('left', beweegLinks)

function beweegLinks(){
  // wat gebeurt er als het pijltje naar links wordt ingedrukt?
  
}
