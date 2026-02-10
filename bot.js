// Gestionnaire du bot d'échecs avec algorithme Minimax

let isThinking = false;

// Configuration du niveau de difficulté
const DIFFICULTY_LEVELS = {
    easy: { depth: 1, randomness: 0.3 },
    medium: { depth: 2, randomness: 0.1 },
    hard: { depth: 3, randomness: 0.0 }
};

let currentDifficulty = 'medium';

// Évaluation simple de la position
const PIECE_VALUES = {
    'p': 10,
    'n': 30,
    'b': 30,
    'r': 50,
    'q': 90,
    'k': 900
};

function evaluateBoard(game) {
    if (game.in_checkmate()) {
        return game.turn() === 'b' ? 10000 : -10000;
    }
    if (game.in_draw()) {
        return 0;
    }

    let score = 0;
    const board = game.board();

    // Compter le matériel
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece) {
                const value = PIECE_VALUES[piece.type];
                score += piece.color === 'b' ? value : -value;
            }
        }
    }

    // Bonus pour la mobilité (nombre de coups possibles)
    const moveCount = game.moves().length;
    score += (game.turn() === 'b' ? moveCount : -moveCount) * 0.1;

    return score;
}

// Algorithme Minimax avec élagage Alpha-Beta
function minimax(game, depth, alpha, beta, isMaximizing) {
    if (depth === 0 || game.game_over()) {
        return evaluateBoard(game);
    }

    const moves = game.moves();

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of moves) {
            game.move(move);
            const evaluation = minimax(game, depth - 1, alpha, beta, false);
            game.undo();
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break; // Élagage
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            game.move(move);
            const evaluation = minimax(game, depth - 1, alpha, beta, true);
            game.undo();
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break; // Élagage
        }
        return minEval;
    }
}

// Trouver le meilleur coup
function findBestMove(game, depth, randomness) {
    const moves = game.moves({ verbose: true }); // Obtenir les coups en format détaillé

    if (moves.length === 0) {
        console.error('❌ Aucun coup légal disponible !');
        return null;
    }

    let bestMove = null;
    let bestValue = -Infinity;

    // Ajouter de l'aléatoire pour les niveaux faciles
    if (randomness > 0 && Math.random() < randomness) {
        const randomIndex = Math.floor(Math.random() * moves.length);
        bestMove = moves[randomIndex];
        console.log('🎲 Coup aléatoire choisi:', bestMove.san);
        return bestMove;
    }

    // Évaluer tous les coups
    for (const move of moves) {
        game.move(move);
        const value = minimax(game, depth - 1, -Infinity, Infinity, false);
        game.undo();

        console.log(`Évaluation: ${move.san} = ${value}`);

        if (value > bestValue) {
            bestValue = value;
            bestMove = move;
        }
    }

    console.log(`Meilleur coup: ${bestMove.san} (valeur: ${bestValue})`);
    return bestMove;
}

// Initialisation du bot
function initBot() {
    console.log('✅ Bot d\'échecs initialisé (Minimax)');
    return true;
}

// Changer la difficulté
function setDifficulty(level) {
    if (!DIFFICULTY_LEVELS[level]) {
        console.error('Niveau inconnu:', level);
        return;
    }

    currentDifficulty = level;
    console.log(`Difficulté réglée sur: ${level}`);
}

// Demander un coup au bot
function getBotMove(game, callback) {
    if (isThinking) {
        console.warn('⚠️ Le bot réfléchit déjà...');
        return;
    }

    isThinking = true;
    console.log('🤖 Le bot commence à réfléchir...');

    const config = DIFFICULTY_LEVELS[currentDifficulty];

    // Simuler un délai de réflexion pour plus de réalisme
    setTimeout(() => {
        try {
            const bestMove = findBestMove(game, config.depth, config.randomness);

            if (bestMove) {
                console.log('✅ Bot a trouvé un coup:', bestMove);
                isThinking = false;
                callback(bestMove);
            } else {
                console.error('❌ Aucun coup trouvé !');
                isThinking = false;
            }
        } catch (error) {
            console.error('❌ Erreur dans le calcul du bot:', error);
            isThinking = false;
        }
    }, 500); // Délai de 500ms pour simuler la réflexion
}

// Export
window.ChessBot = {
    init: initBot,
    getMove: getBotMove,
    setDifficulty: setDifficulty,
    isThinking: () => isThinking
};
