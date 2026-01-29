// Définition des gestes personnalisés pour Fingerpose (Version Assouplie)

const { GestureDescription, Finger, FingerCurl, FingerDirection } = window.fp;

// --- Geste : Index Pointé vers le HAUT ---
const IndexUpGesture = new GestureDescription('up');

// L'index doit être tendu
IndexUpGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);

// Directions acceptées (Haut + un peu de diagonale)
IndexUpGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
IndexUpGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.9);
IndexUpGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.9);

// Les autres doigts (Majeur, Annulaire, Auriculaire) doivent être pliés
[Finger.Middle, Finger.Ring, Finger.Pinky].forEach(finger => {
    IndexUpGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    IndexUpGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9); // On accepte s'ils sont un peu détendus
});
// NOTE : On ne contraint PAS le pouce. Il peut être plié ou tendu, ça ne gène plus.


// --- Geste : Index Pointé vers le BAS ---
const IndexDownGesture = new GestureDescription('down');

IndexDownGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);

IndexDownGesture.addDirection(Finger.Index, FingerDirection.VerticalDown, 1.0);
IndexDownGesture.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 0.9);
IndexDownGesture.addDirection(Finger.Index, FingerDirection.DiagonalDownRight, 0.9);

[Finger.Middle, Finger.Ring, Finger.Pinky].forEach(finger => {
    IndexDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    IndexDownGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
});


// --- Geste : Index Pointé vers la GAUCHE ---
const IndexLeftGesture = new GestureDescription('left');

IndexLeftGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);

IndexLeftGesture.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1.0);
IndexLeftGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.9);
IndexLeftGesture.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 0.9);

[Finger.Middle, Finger.Ring, Finger.Pinky].forEach(finger => {
    IndexLeftGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    IndexLeftGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
});


// --- Geste : Index Pointé vers la DROITE ---
const IndexRightGesture = new GestureDescription('right');

IndexRightGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);

IndexRightGesture.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1.0);
IndexRightGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.9);
IndexRightGesture.addDirection(Finger.Index, FingerDirection.DiagonalDownRight, 0.9);

[Finger.Middle, Finger.Ring, Finger.Pinky].forEach(finger => {
    IndexRightGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    IndexRightGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
});

// Export des gestes pour utilisation dans logic.js
window.CustomGestures = {
    IndexUpGesture,
    IndexDownGesture,
    IndexLeftGesture,
    IndexRightGesture
};