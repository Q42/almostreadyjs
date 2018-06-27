/**
 * 
 * Als je deze oefening in de browser laadt, begint het schip meteen te vliegen.
 * Dat doet de "beweegSchip" functie hieronder, die on.gameloop wordt uitgevoerd.
 * De gameloop is waar veel gebeurt van je spel. 
 * De gameloop wordt de hele tijd opnieuw uitgevoerd zolang je spel gespeeld wordt.
 *
 * Als het schip boven is, vliegt het uit het scherm. Je moet de browser dan verversen
 * om het schip weer op zijn beginstand te krijgen.
 * 
 * Opdracht 1
 * 
 * Laat het schip sneller naar boven bewegen
 * 
 * Opdracht 2
 * 
 * Had je al gemerkt dat als je je toetsenbord pijltje naar rechts indrukt, het schip
 * naar rechts verplaatst?
 * Laat het schip nu ook naar links bewegen door het pijltje naar links ('left') in te drukken
 * 
 */
 
var schip = Sprite('images/schip.png')

schip.x = 100
schip.y = 500

// de gameloop wordt de hele tijd uitgevoerd
// vandaar dat het schip nu de hele tijd naar boven verplaatst!
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
