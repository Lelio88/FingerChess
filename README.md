# 🎮 Jeu d'Échecs contrôlé par Gestes - Projet R602

Démonstrateur pour la fête de la science : jouez aux échecs contre une IA uniquement avec les gestes de votre main, sans souris ni clavier !

## 🎯 Objectif du Projet

Réaliser une application de démonstration de l'usage de l'intelligence artificielle pour la fête de la science, permettant de jouer aux échecs en utilisant la détection de gestes de la main via webcam.

## 📋 Fonctionnalités Implémentées

### ✅ Étape 1 : Détection de la Main
- Capture du flux vidéo de la webcam
- Détection du squelette de la main avec **MediaPipe Handpose** (TensorFlow.js)
- Affichage du squelette superposé sur le flux vidéo en temps réel

### ✅ Étape 2 : Reconnaissance de Gestes
- Gestes directionnels personnalisés avec **Fingerpose** :
  - ☝️ **Haut** : Index pointé vers le haut
  - 👇 **Bas** : Index pointé vers le bas
  - 👈 **Gauche** : Index pointé vers la gauche
  - 👉 **Droite** : Index pointé vers la droite
  - 👍 **Validation** : Pouce levé (ThumbsUp)

### ✅ Étape 3 : Jeu d'Échecs Interactif
- Jeu d'échecs complet avec toutes les règles (chess.js)
- Contrôle par gestes de la main
- **Bot adversaire** avec algorithme **Minimax + Alpha-Beta**
- 3 niveaux de difficulté : Facile / Moyen / Difficile

### 🎯 Système de Détection Robuste
Pour réduire les faux positifs et améliorer la précision :
- **Seuil de confiance élevé** : Minimum 8.0/10
- **Système de consensus** : 3 détections identiques consécutives requises
- **Détection de stabilité** : La main doit être immobile (< 30px de mouvement)
- **Cooldown intelligent** : 800ms entre chaque action
- **Feedback visuel** : Indicateurs de progression et emojis

## 🚀 Utilisation

### Prérequis
- Navigateur moderne (Chrome, Edge, Firefox)
- Webcam fonctionnelle
- Connexion internet (pour les CDN)

### Lancer l'application
1. Ouvrir `index.html` dans votre navigateur
2. Autoriser l'accès à la webcam
3. Attendre le chargement du modèle IA
4. Montrer votre main devant la caméra

### Comment Jouer
1. **Naviguer** : Utilisez les gestes directionnels pour déplacer le curseur (case bleue)
2. **Sélectionner** : Faites 👍 pour sélectionner une pièce
3. **Déplacer** : Naviguez vers la destination, puis 👍 pour valider le coup
4. **Le bot joue automatiquement** après votre coup

### Conseils pour une Meilleure Détection
- Maintenez votre main **stable** pendant le geste
- Gardez la main **bien visible** dans le cadre
- Évitez les mouvements brusques
- Faites des gestes **clairs et distincts**
- Attendez le feedback visuel avant de changer de geste

## 🏗️ Architecture Technique

### Stack Technique
- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **IA / Computer Vision** :
  - TensorFlow.js
  - MediaPipe Handpose (Détection du squelette de la main)
  - Fingerpose (Reconnaissance de gestes personnalisés)
- **Logique du Jeu** :
  - chess.js (Règles des échecs)
  - Algorithme Minimax avec élagage Alpha-Beta (Bot)

### Fichiers Principaux
- `index.html` : Interface utilisateur
- `style.css` : Styles et mise en page
- `logic.js` : Capture webcam + détection des gestes
- `gestures.js` : Définitions des gestes directionnels
- `chess_ui.js` : Interface de l'échiquier + logique de jeu
- `bot.js` : Intelligence artificielle du bot (Minimax)

## 🎓 Contexte Pédagogique

Ce projet fait partie du module **R602 - Web & IA** du BUT MMI (Métiers du Multimédia et de l'Internet) en troisième année.

### Compétences Développées
- Vision par ordinateur (Computer Vision)
- Machine Learning / Deep Learning
- Algorithmique (Minimax, Alpha-Beta)
- Développement web JavaScript
- Intégration de modèles IA pré-entraînés
- Gestion d'événements temps réel

## 🔧 Améliorations Futures Possibles
- [ ] Ajout de sons pour les coups et la validation
- [ ] Enregistrement des parties jouées
- [ ] Statistiques de reconnaissance des gestes
- [ ] Support multi-mains
- [ ] Mode entraînement avec indices visuels
- [ ] Intégration de Stockfish.js pour un bot encore plus fort

## 👥 Auteurs
Projet R602 - BUT MMI 3ème année

## 📜 Licence
Ce projet est à usage éducatif.
