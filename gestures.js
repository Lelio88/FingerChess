// Définition des gestes personnalisés pour Fingerpose (Version Assouplie)

const { GestureDescription, Finger, FingerCurl, FingerDirection } = window.fp;

// --- Geste : Index Pointé vers le HAUT ---
const IndexUpGesture = new GestureDescription('up');

// L'index doit être tendu (on accepte même un peu de courbure)
IndexUpGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
IndexUpGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.5); // Tolérance si légèrement plié

// Directions acceptées (très permissif)
IndexUpGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
IndexUpGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0);
IndexUpGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 1.0);

// Les autres doigts doivent être pliés (très permissif)
[Finger.Middle, Finger.Ring, Finger.Pinky].forEach(finger => {
    IndexUpGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    IndexUpGesture.addCurl(finger, FingerCurl.HalfCurl, 1.0);
});
// Le pouce n'est pas contraint


// --- Geste : Index Pointé vers le BAS ---
const IndexDownGesture = new GestureDescription('down');

IndexDownGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
IndexDownGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.5);

IndexDownGesture.addDirection(Finger.Index, FingerDirection.VerticalDown, 1.0);
IndexDownGesture.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 1.0);
IndexDownGesture.addDirection(Finger.Index, FingerDirection.DiagonalDownRight, 1.0);

[Finger.Middle, Finger.Ring, Finger.Pinky].forEach(finger => {
    IndexDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    IndexDownGesture.addCurl(finger, FingerCurl.HalfCurl, 1.0);
});


// --- Geste : Index Pointé vers la GAUCHE ---
const IndexLeftGesture = new GestureDescription('left');

IndexLeftGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
IndexLeftGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.5);

IndexLeftGesture.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1.0);
IndexLeftGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0);
IndexLeftGesture.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 1.0);

[Finger.Middle, Finger.Ring, Finger.Pinky].forEach(finger => {
    IndexLeftGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    IndexLeftGesture.addCurl(finger, FingerCurl.HalfCurl, 1.0);
});


// --- Geste : Index Pointé vers la DROITE ---
const IndexRightGesture = new GestureDescription('right');

IndexRightGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
IndexRightGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.5);

IndexRightGesture.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1.0);
IndexRightGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 1.0);
IndexRightGesture.addDirection(Finger.Index, FingerDirection.DiagonalDownRight, 1.0);

[Finger.Middle, Finger.Ring, Finger.Pinky].forEach(finger => {
    IndexRightGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    IndexRightGesture.addCurl(finger, FingerCurl.HalfCurl, 1.0);
});

// Export des gestes pour utilisation dans logic.js
window.CustomGestures = {
    IndexUpGesture,
    IndexDownGesture,
    IndexLeftGesture,
    IndexRightGesture
};