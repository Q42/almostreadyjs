/**
 * Als eerst gaan we ons ruimteschip tekenen. 
 * Daarvoor gebruiken we een Sprite. 
 * Een Sprite kan vanalles zijn, denk aan een auto die rijdt, 
 * een ridder die rondspringt of een ruimteschip, een vijand of een laser.
 *
 * In de code hieronder zie je var schip = Sprite('images/schip.png')
 * Daarmee tekenen we ons eerste ding op het scherm en we geven het de naam schip. 
 * Wat voor ding is het? Een Sprite met een plaatje 'images/ship.png'.
 *
 * Bij programmeren spreek je niet over dingen maar over variabelen. 
 * Dus ship is een variabele, van het type Sprite.
 * 
 * De regels daar onder bepalen de plaats op het speelveld.
 * Het speelveld is zo groot als het witte vlak dat je in je browser ziet.
 * Het speelveld is 360 pixels breed en 540 pixels hoog. Dat past op de meeste telefoons.
 * x is van links (0) naar rechts (360)
 * y is van boven (0) naar beneden (540)
 * 
 * Opdracht 1
 * 
 * Verplaats het schip door de x en y een andere waarde te geven
 * 
 * Opdracht 2
 * 
 * Geef het schip een ander uiterlijk, je kunt hiervoor een willekeurig plaatje 
 * van je computer pakken, bijvoorbeeld 'images/raket.png'
 * 
 */
 
var schip = Sprite('images/schip.png')

schip.x = 100
schip.y = 100