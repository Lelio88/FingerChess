const video = document.getElementById('webcam');
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');
const debugInfo = document.getElementById('debug-info');
const title = document.querySelector('h1');

let model = null;

// Configuration
const VIDEO_WIDTH = 480;
const VIDEO_HEIGHT = 360;

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
    title.innerText = "Chargement du modèle IA...";
    model = await handpose.load();
    
    // Initialiser le reconnaisseur de gestes avec nos gestes customs + ThumbsUp
    const GE = new fp.GestureEstimator([
        fp.Gestures.ThumbsUpGesture,
        window.CustomGestures.IndexUpGesture,
        window.CustomGestures.IndexDownGesture,
        window.CustomGestures.IndexLeftGesture,
        window.CustomGestures.IndexRightGesture
    ]);

    title.innerText = "Prêt ! Montrez votre main.";
    console.log("Modèle Handpose chargé.");
    
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
    const COOLDOWN_DELAY = 1000; // ms (Temps d'attente entre deux actions)

    // Boucle de détection
    async function frame() {
        // Dessiner la vidéo en fond
        ctx.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

        // Détecter la main
        if(model) {
            const predictions = await model.estimateHands(video);
            
            if (predictions.length > 0) {
                drawKeypoints(predictions);

                // Estimation du geste
                const estimatedGestures = await gestureEstimator.estimate(predictions[0].landmarks, 7.5);
                
                if (estimatedGestures.gestures.length > 0) {
                    // Trouver le geste avec le meilleur score
                    const bestGesture = estimatedGestures.gestures.reduce((p, c) => {
                        return (p.score > c.score) ? p : c;
                    });
                    
                    const confidence = Math.round(bestGesture.score * 10) / 10;
                    
                    // --- Logique de Contrôle ---
                    const now = Date.now();
                    if (now - lastActionTime > COOLDOWN_DELAY) {
                        
                        let actionTaken = false;

                        if (bestGesture.name === 'thumbs_up') {
                            window.ChessGame.actionTriggered();
                            debugInfo.innerText = `Action : VALIDATION !`;
                            actionTaken = true;
                        } else if (bestGesture.name === 'up') {
                            window.ChessGame.moveCursor('up');
                            debugInfo.innerText = `Action : HAUT`;
                            actionTaken = true;
                        } else if (bestGesture.name === 'down') {
                            window.ChessGame.moveCursor('down');
                            debugInfo.innerText = `Action : BAS`;
                            actionTaken = true;
                        } else if (bestGesture.name === 'left') {
                            window.ChessGame.moveCursor('right'); // Inversion Miroir
                            debugInfo.innerText = `Action : DROITE`;
                            actionTaken = true;
                        } else if (bestGesture.name === 'right') {
                            window.ChessGame.moveCursor('left'); // Inversion Miroir
                            debugInfo.innerText = `Action : GAUCHE`;
                            actionTaken = true;
                        }

                        if (actionTaken) {
                            lastActionTime = now;
                        } else {
                             // Si on détecte un geste mais qu'il n'est pas mappé (ex: Victory)
                             debugInfo.innerText = `Geste : ${bestGesture.name} (${confidence})`;
                        }
                    } else {
                        // En cooldown
                        const waitTime = Math.ceil((COOLDOWN_DELAY - (now - lastActionTime)) / 100);
                        debugInfo.innerText = `Pause... ${waitTime}`;
                    }
                    
                } else {
                    debugInfo.innerText = "Main stable (aucun geste)";
                }

            } else {
                debugInfo.innerText = "En attente de la main...";
            }
        }

        requestAnimationFrame(frame);
    }

    frame();
}

main();
