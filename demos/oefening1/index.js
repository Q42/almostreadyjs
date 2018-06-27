/**
 * Als het goed is zie je nu een ruimteschip in je browser.
 * Die wordt getekend door de code hieronder. 
 * 
 * De eerste regel maakt een variabele aan
 * en zegt welk plaatje gebruikt wordt (images/schip.png). 
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