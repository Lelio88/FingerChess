const video = document.getElementById('webcam');
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');
const debugInfo = document.getElementById('debug-info');
const gestureDebug = document.getElementById('gesture-debug');
const title = document.querySelector('h1');

let model = null;

// Configuration (résolution augmentée pour meilleure précision)
const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 480;

async function setupCamera() {
    video.width = VIDEO_WIDTH;
    video.height = VIDEO_HEIGHT;

    const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {
            facingMode: 'user',
            width: VIDEO_WIDTH,
            height: VIDEO_HEIGHT
        }
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadHandpose() {
    title.innerText = "Chargement du modèle IA (MediaPipe Hands v2)...";

    // Créer le détecteur avec MediaPipe Hands (plus précis que l'ancien handpose)
    const detectorConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
        modelType: 'full', // 'full' est plus précis que 'lite'
        maxHands: 1 // Une seule main pour de meilleures performances
    };

    model = await handPoseDetection.createDetector(
        handPoseDetection.SupportedModels.MediaPipeHands,
        detectorConfig
    );

    // Initialiser le reconnaisseur de gestes avec nos gestes customs + ThumbsUp
    const GE = new fp.GestureEstimator([
        fp.Gestures.ThumbsUpGesture,
        window.CustomGestures.IndexUpGesture,
        window.CustomGestures.IndexDownGesture,
        window.CustomGestures.IndexLeftGesture,
        window.CustomGestures.IndexRightGesture
    ]);

    title.innerText = "✅ Prêt ! Modèle MediaPipe Hands v2 chargé.";
    console.log("✅ Modèle MediaPipe Hands v2 chargé (plus précis).");

    return GE;
}

function drawKeypoints(predictions) {
    if (predictions.length > 0) {
        predictions.forEach(prediction => {
            const landmarks = prediction.landmarks;

            // Dessiner les points
            for (let i = 0; i < landmarks.length; i++) {
                const x = landmarks[i][0];
                const y = landmarks[i][1];

                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = "#00d2ff"; // Bleu cyan
                ctx.fill();
            }
            
            // Dessiner les doigts (lignes)
            const fingers = {
                thumb: [0, 1, 2, 3, 4],
                indexFinger: [0, 5, 6, 7, 8],
                middleFinger: [0, 9, 10, 11, 12],
                ringFinger: [0, 13, 14, 15, 16],
                pinky: [0, 17, 18, 19, 20],
            };

            ctx.lineWidth = 2;
            ctx.strokeStyle = "white";

            Object.keys(fingers).forEach(finger => {
                const points = fingers[finger];
                ctx.beginPath();
                ctx.moveTo(landmarks[points[0]][0], landmarks[points[0]][1]);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(landmarks[points[i]][0], landmarks[points[i]][1]);
                }
                ctx.stroke();
            });
        });
        // Le texte de debug est géré dans la boucle principale
    }
}

async function main() {
    await setupCamera();
    video.play();
    
    canvas.width = VIDEO_WIDTH;
    canvas.height = VIDEO_HEIGHT;

    // Charger Handpose et récupérer l'estimateur
    const gestureEstimator = await loadHandpose();

    // Variables pour le Cooldown (anti-spam de gestes)
    let lastActionTime = 0;
    const COOLDOWN_DELAY = 600; // ms (Réduit pour plus de réactivité)

    // Variables pour la détection robuste (consensus)
    let gestureHistory = []; // Historique des derniers gestes détectés
    const CONSENSUS_THRESHOLD = 10; // Augmenté : il faut maintenir le geste ~1-2 secondes
    const HISTORY_SIZE = 15; // Taille de l'historique augmentée

    // Variables pour la stabilité de la main
    let previousHandPosition = null;
    const STABILITY_THRESHOLD = 50; // Augmenté pour accepter plus de mouvement

    // Boucle de détection
    async function frame() {
        // Dessiner la vidéo en fond
        ctx.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

        // Détecter la main
        if(model) {
            const predictions = await model.estimateHands(video);

            if (predictions.length > 0) {
                // Convertir les keypoints du nouveau format au format attendu par fingerpose
                // Nouveau format: keypoints = [{x, y, z}, ...]
                // Format attendu: landmarks = [[x, y, z], ...]
                const landmarks = predictions[0].keypoints.map(kp => [kp.x, kp.y, kp.z || 0]);

                // Créer un objet au format de l'ancien handpose pour drawKeypoints
                const formattedPredictions = [{
                    landmarks: landmarks,
                    handInViewConfidence: predictions[0].score
                }];

                drawKeypoints(formattedPredictions);

                // Afficher la qualité de détection (score de confiance du modèle)
                const detectionQuality = Math.round(predictions[0].score * 100);
                if (detectionQuality < 70) {
                    console.warn(`⚠️ Qualité de détection faible: ${detectionQuality}%`);
                }

                // Calculer la position du centre de la main pour la stabilité
                const handCenter = {
                    x: landmarks.reduce((sum, point) => sum + point[0], 0) / landmarks.length,
                    y: landmarks.reduce((sum, point) => sum + point[1], 0) / landmarks.length
                };

                // Vérifier la stabilité de la main
                let isHandStable = false;
                if (previousHandPosition) {
                    const movement = Math.sqrt(
                        Math.pow(handCenter.x - previousHandPosition.x, 2) +
                        Math.pow(handCenter.y - previousHandPosition.y, 2)
                    );
                    isHandStable = movement < STABILITY_THRESHOLD;
                } else {
                    isHandStable = true; // Première détection
                }
                previousHandPosition = handCenter;

                // Estimation du geste avec seuil assoupli
                const estimatedGestures = await gestureEstimator.estimate(landmarks, 7.0);

                // Afficher tous les gestes détectés pour le debug
                if (estimatedGestures.gestures.length > 0) {
                    const allGestures = estimatedGestures.gestures
                        .map(g => `${g.name}: ${Math.round(g.score * 10) / 10}`)
                        .join(' | ');
                    gestureDebug.innerText = `Détections: ${allGestures}`;
                } else {
                    gestureDebug.innerText = 'Aucun geste détecté';
                }

                if (estimatedGestures.gestures.length > 0) {
                    // Trouver le geste avec le meilleur score
                    const bestGesture = estimatedGestures.gestures.reduce((p, c) => {
                        return (p.score > c.score) ? p : c;
                    });

                    const confidence = Math.round(bestGesture.score * 10) / 10;

                    // Seuil de confiance minimum assoupli
                    const MIN_CONFIDENCE = 6.5;

                    if (confidence < MIN_CONFIDENCE) {
                        debugInfo.innerText = `Geste incertain (${confidence})`;
                        gestureHistory = []; // Reset l'historique
                        return;
                    }

                    // Ajouter à l'historique
                    gestureHistory.push(bestGesture.name);
                    if (gestureHistory.length > HISTORY_SIZE) {
                        gestureHistory.shift(); // Garder seulement les N derniers
                    }

                    // Vérifier le consensus (même geste détecté plusieurs fois)
                    const recentGestures = gestureHistory.slice(-CONSENSUS_THRESHOLD);
                    const hasConsensus = recentGestures.length === CONSENSUS_THRESHOLD &&
                                        recentGestures.every(g => g === bestGesture.name);

                    // --- Logique de Contrôle avec Robustesse ---
                    const now = Date.now();
                    const inCooldown = (now - lastActionTime) < COOLDOWN_DELAY;

                    // Affichage du statut avec plus de détails
                    const stabilityInfo = isHandStable ? '✅' : '⚠️';

                    if (!hasConsensus) {
                        const progress = Math.min(recentGestures.filter(g => g === bestGesture.name).length, CONSENSUS_THRESHOLD);
                        debugInfo.innerText = `${stabilityInfo} ${bestGesture.name} [${progress}/${CONSENSUS_THRESHOLD}] Score: ${confidence}`;
                    } else if (inCooldown) {
                        const waitTime = Math.ceil((COOLDOWN_DELAY - (now - lastActionTime)) / 100);
                        debugInfo.innerText = `⏳ Cooldown... ${waitTime}`;
                    } else if (!isHandStable && bestGesture.name !== 'thumbs_up') {
                        // Pour les gestes directionnels, on demande la stabilité
                        // Mais pour thumbs_up, on l'accepte même si la main bouge
                        debugInfo.innerText = `⚠️ Main instable - Gardez la main immobile`;
                    } else {
                        // Toutes les conditions sont remplies : exécuter l'action
                        let actionTaken = false;

                        if (bestGesture.name === 'thumbs_up') {
                            window.ChessGame.actionTriggered();
                            debugInfo.innerText = `✅ VALIDATION !`;
                            actionTaken = true;
                        } else if (bestGesture.name === 'up') {
                            window.ChessGame.moveCursor('up');
                            debugInfo.innerText = `⬆️ HAUT`;
                            actionTaken = true;
                        } else if (bestGesture.name === 'down') {
                            window.ChessGame.moveCursor('down');
                            debugInfo.innerText = `⬇️ BAS`;
                            actionTaken = true;
                        } else if (bestGesture.name === 'left') {
                            window.ChessGame.moveCursor('right'); // Inversion Miroir
                            debugInfo.innerText = `➡️ DROITE`;
                            actionTaken = true;
                        } else if (bestGesture.name === 'right') {
                            window.ChessGame.moveCursor('left'); // Inversion Miroir
                            debugInfo.innerText = `⬅️ GAUCHE`;
                            actionTaken = true;
                        }

                        if (actionTaken) {
                            lastActionTime = now;
                            gestureHistory = []; // Reset après action réussie
                        } else {
                            debugInfo.innerText = `❓ Geste inconnu : ${bestGesture.name}`;
                        }
                    }


                } else {
                    debugInfo.innerText = "✋ Main détectée (aucun geste reconnu)";
                    gestureHistory = []; // Reset l'historique si pas de geste
                }

            } else {
                debugInfo.innerText = "👀 En attente de la main...";
                gestureHistory = []; // Reset l'historique
                previousHandPosition = null; // Reset la position
            }
        }

        requestAnimationFrame(frame);
    }

    frame();
}

main();
