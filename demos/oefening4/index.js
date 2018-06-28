/**
 * Pas op! Je schip vliegt nu tegen een vijand aan!
 * 
 * We gaan een laser schieten naar de vijand!
 * 
 * Opdracht
 * 
 * schiet een laser
 * 
 * Opdracht
 * 
 * Als je schip de bovenkant van het scherm raakt
 * heb je gewonnen
 * 
 */
 
var schip = Sprite('images/schip.png')
schip.x = 100
schip.y = 500

var vijand = Sprite('images/vijand.png')
vijand.x = 100
vijand.y = 100

// de gameloop wordt de hele tijd uitgevoerd
// vandaar dat het schip nu de hele tijd naar boven verplaatst!
on.gameloop(beweegSchip)

function beweegSchip(){
  schip.y = schip.y - 1

  if (schip.touches(vijand)) {
    Ready.stop()
  }
}

