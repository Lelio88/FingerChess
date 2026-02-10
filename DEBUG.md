# 🔧 Guide de Dépannage

## Problème : Le bot ne joue pas

### Diagnostic
1. Ouvrez la console du navigateur (F12)
2. Jouez un coup avec les blancs
3. Observez les messages dans la console

### Messages attendus :
```
🎮 playBotMove() appelée
✅ Conditions OK, le bot va réfléchir...
🤖 Le bot commence à réfléchir...
Évaluation: e5 = ...
Évaluation: Nf6 = ...
...
Meilleur coup: e5 (valeur: 10)
✅ Bot a trouvé un coup: {from: "e7", to: "e5", ...}
📥 Réponse du bot reçue: {from: "e7", to: "e5", ...}
✅ Bot a joué: e5
```

### Solutions possibles :

#### Si vous voyez "⚠️ Ce n'est pas le tour des noirs"
- Le bot joue uniquement les noirs (pièces en noir)
- Vous jouez les blancs (pièces en blanc)
- Vérifiez que vous avez bien joué un coup valide avant

#### Si vous voyez "❌ Coup illégal du bot"
- Le bot a calculé un coup mais le jeu le refuse
- Vérifiez dans la console le coup suggéré
- C'est probablement un bug dans l'algorithme Minimax

#### Si rien ne s'affiche
- Le script bot.js n'est peut-être pas chargé
- Vérifiez dans la console s'il y a des erreurs de chargement
- Rechargez la page complètement (Ctrl+F5)

---

## Problème : Difficultés de détection de l'index

### Paramètres actuels (plus permissifs) :
- **Seuil de confiance** : 6.5/10 minimum
- **Seuil d'estimation** : 7.0/10
- **Consensus requis** : 2 détections consécutives
- **Stabilité** : 50 pixels max de mouvement
- **Cooldown** : 600ms

### Conseils pratiques :

#### Éclairage
- ✅ Lumière frontale ou latérale
- ❌ Éviter le contre-jour (fenêtre derrière vous)
- ✅ Lumière uniforme sans ombres fortes

#### Position de la main
- Distance : 30-60cm de la webcam
- Main bien visible, pas coupée par le cadre
- Fond contrasté (pas de main chair sur mur beige)

#### Gestes pour chaque direction

**☝️ HAUT**
```
Index tendu vers le haut
Autres doigts repliés (peuvent être semi-repliés)
Pouce : libre (tendu ou replié, peu importe)
```

**👇 BAS**
```
Index tendu vers le bas
Autres doigts repliés
Pouce : libre
```

**👈 GAUCHE** / **👉 DROITE**
```
Index pointé horizontalement
Autres doigts repliés
Pouce : libre
```

**👍 VALIDATION**
```
Pouce levé verticalement
Autres doigts repliés
```

### Astuces
1. **Maintenez le geste 1-2 secondes** pour que le consensus se fasse
2. **Observez l'affichage de debug** en bas de l'écran :
   - `[1/2]` : Première détection
   - `[2/2]` : Consensus atteint → action !
3. **Regardez les scores** de tous les gestes détectés
4. Si un mauvais geste a un score plus élevé, ajustez votre main

### Ajustements manuels possibles

Si vraiment la détection ne fonctionne pas bien, vous pouvez modifier `logic.js` :

```javascript
// Ligne ~108-110
const CONSENSUS_THRESHOLD = 1; // Réduire à 1 (plus réactif mais moins précis)
const COOLDOWN_DELAY = 400;     // Réduire pour plus de réactivité
const STABILITY_THRESHOLD = 100; // Augmenter pour accepter plus de mouvement
```

```javascript
// Ligne ~152
const MIN_CONFIDENCE = 5.0; // Abaisser le seuil (attention aux faux positifs !)
```

---

## Tests rapides dans la console

### Vérifier que le bot est chargé
```javascript
console.log(window.ChessBot);
// Devrait afficher: {init: ƒ, getMove: ƒ, setDifficulty: ƒ, isThinking: ƒ}
```

### Forcer le bot à jouer
```javascript
window.ChessGame.getGame().load('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
// Position où c'est au tour des noirs
// Puis attendez ~1 seconde
```

### Vérifier l'état du jeu
```javascript
const game = window.ChessGame.getGame();
console.log('Tour:', game.turn()); // 'w' ou 'b'
console.log('FEN:', game.fen());
console.log('Partie terminée?', game.game_over());
```

### Test manuel d'un geste
```javascript
// Simuler un déplacement vers le haut
window.ChessGame.moveCursor('up');
```

---

## Problèmes courants

### La webcam ne se lance pas
- Vérifiez les permissions du navigateur
- Testez avec un autre navigateur (Chrome recommandé)
- Vérifiez qu'aucune autre application n'utilise la webcam

### "Erreur de chargement de Handpose"
- Vérifiez votre connexion internet (CDN requis)
- Rechargez la page
- Videz le cache du navigateur

### Les pièces d'échecs ne s'affichent pas
- Problème de police Unicode
- Les emojis devraient fonctionner sur tous les navigateurs modernes
- Sinon, modifier chess_ui.js pour utiliser des images

---

## Logs utiles pour le débogage

Activez tous les logs en ajoutant au début de `logic.js` :
```javascript
const DEBUG_MODE = true;
```

Puis dans le code, ajouter des logs conditionnels :
```javascript
if (DEBUG_MODE) console.log('Info de debug...');
```
