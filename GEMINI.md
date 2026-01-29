# Projet Jeu d'Échecs IA - R602

## Objectif
Réaliser un démonstrateur pour la fête de la science permettant de jouer aux échecs sans souris ni clavier, uniquement à l'aide de gestes de la main captés par une webcam.

## Stack Technique
- **Frontend** : HTML5, CSS3, JavaScript (Vanilla).
- **IA / Computer Vision** : 
  - `TensorFlow.js`
  - `MediaPipe Handpose` (Détection squelette main)
  - `Fingerpose` (Reconnaissance de gestes personnalisés)
- **Logique Jeu** : Implémentation custom (Plateau libre dans un premier temps) puis intégration potentielle de `chess.js` pour les règles strictes.

## Expérience Utilisateur (UX) - Option B
L'interaction repose sur une **navigation directionnelle** sur la grille.

1.  **Curseur** : Une case est sélectionnée (en surbrillance) sur l'échiquier.
2.  **Navigation** : L'utilisateur fait des gestes pour déplacer ce curseur :
    - 👆 **Haut** (Index levé, autres fermés ?)
    - 👇 **Bas** (Pouce vers le bas ou Index vers le bas ?)
    - 👈 **Gauche** (Pouce vers la gauche ?)
    - 👉 **Droite** (Pouce vers la droite ?)
3.  **Action** : 
    - 👍 **Valider / Sélectionner** : Pour saisir une pièce ou la déposer sur la case cible.

## Roadmap

### Étape 1 : Définition et Reconnaissance des Gestes
- Créer les définitions de gestes pour `fingerpose` (Haut, Bas, Gauche, Droite, Valider).
- Intégrer ces gestes dans `logic.js`.
- Afficher le geste reconnu en temps réel pour debug.

### Étape 2 : Interface de l'Échiquier
- Créer une grille 8x8 en HTML/CSS (`display: grid`).
- Afficher les pièces (Unicode ou Images) à leurs positions initiales.
- Gérer un style visuel pour la "Case active" (curseur).

### Étape 3 : Liaison IA ↔ Interface
- Faire bouger le curseur CSS quand un geste directionnel est détecté.
- Ajouter un "Debounce" (délai) pour éviter que le curseur ne file trop vite d'une case à l'autre.

### Étape 4 : Logique de Jeu (Mode "Plateau Libre")
- État "Sélectionné" : Quand on valide sur une pièce, elle est "en main".
- État "Déposé" : Quand on valide sur une case vide (ou occupée), la pièce se déplace.

### Étape 5 : Règles Réelles (Bonus/Futur)
- Intégrer la validation des coups (Cavalier en L, Diagonales fous...).
- Gestion de la prise de pièce adverse.
