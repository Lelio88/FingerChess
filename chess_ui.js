// Gestion de l'interface de l'échiquier avec Chess.js

const boardElement = document.getElementById('chessboard');
const BOARD_SIZE = 8;

// État du jeu (Instance de Chess.js)
// Note: Chess est exposé globalement par la librairie
let game = new Chess();

let cursorPosition = { row: 4, col: 4 }; // Position curseur
let selectedPosition = null; // Case source sélectionnée {row, col}

// Initialisation
function initBoard() {
    renderBoard();
}

// Utilitaire : Conversion Coordonnées (Row, Col) -> Notation Algébrique (ex: "e4")
function toSquare(row, col) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return files[col] + ranks[row];
}

function getPieceSymbol(pieceObj) {
    if (!pieceObj) return '';
    
    // Mapping des types chess.js (p, n, b, r, q, k) vers Unicode
    const map = {
        'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟', 
        'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙'
    };
    
    // Chess.js retourne { type: 'p', color: 'b' }
    let code = pieceObj.type;
    if (pieceObj.color === 'w') {
        code = code.toUpperCase(); // Blancs en majuscule pour mon mapping
    }
    
    return map[code] || '';
}

function renderBoard() {
    boardElement.innerHTML = ''; // Clear
    
    // Récupérer l'état du plateau depuis chess.js (Tableau 8x8)
    const boardData = game.board(); 
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            
            // Couleur de la case (Damier)
            if ((row + col) % 2 === 0) {
                square.classList.add('white');
            } else {
                square.classList.add('black');
            }
            
            // ID
            square.id = `square-${row}-${col}`;
            
            // Affichage Pièce
            const piece = boardData[row][col];
            if (piece) {
                const span = document.createElement('span');
                span.innerText = getPieceSymbol(piece);
                
                // Style spécifique
                if (piece.color === 'w') {
                    span.style.color = '#fff';
                    span.style.textShadow = '0 0 2px #000';
                } else {
                    span.style.color = '#000';
                }
                
                square.appendChild(span);
            }
            
            // Gestion Curseur (Case active)
            if (row === cursorPosition.row && col === cursorPosition.col) {
                square.classList.add('selected');
                
                // Indiquer si c'est un coup valide (Optionnel mais cool)
                if (selectedPosition) {
                    // Vérifier si un coup est possible vers cette case
                    const move = {
                        from: toSquare(selectedPosition.row, selectedPosition.col),
                        to: toSquare(row, col),
                        promotion: 'q' // Toujours promouvoir en dame pour simplifier
                    };
                    // move() modifie l'état, on veut juste vérifier.
                    // game.moves() donne la liste des coups légaux.
                    const moves = game.moves({ verbose: true });
                    const isLegal = moves.some(m => m.from === move.from && m.to === move.to);
                    
                    if (isLegal) {
                        square.style.backgroundColor = 'rgba(0, 255, 0, 0.3)'; // Vert si coup légal
                    } else if (selectedPosition.row !== row || selectedPosition.col !== col) {
                        // Rouge si pas légal (et pas la case elle-même)
                         square.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                    }
                }
            }

            // Gestion Sélection (Pièce en main - Case source)
            if (selectedPosition && row === selectedPosition.row && col === selectedPosition.col) {
                square.classList.add('piece-held');
            }
            
            // Marquer le dernier coup joué (Optionnel)
            // ...
            
            boardElement.appendChild(square);
        }
    }
    
    // Vérification état de partie
    if (game.in_checkmate()) {
        console.log("ÉCHEC ET MAT !");
        document.querySelector('h1').innerText = "ÉCHEC ET MAT !";
    } else if (game.in_check()) {
        console.log("ÉCHEC !");
    }
}

// --- API de Contrôle ---

function moveCursor(direction) {
    let newRow = cursorPosition.row;
    let newCol = cursorPosition.col;

    if (direction === 'up') newRow--;
    if (direction === 'down') newRow++;
    if (direction === 'left') newCol--;
    if (direction === 'right') newCol++;

    // Bornes
    if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
        cursorPosition = { row: newRow, col: newCol };
        renderBoard();
        return true;
    }
    return false;
}

function actionTriggered() {
    const { row, col } = cursorPosition;
    const piece = game.board()[row][col]; // null ou objet piece

    if (selectedPosition) {
        // --- TENTATIVE DE DÉPLACEMENT ---
        
        // Si on clique sur la même case, on annule
        if (selectedPosition.row === row && selectedPosition.col === col) {
            selectedPosition = null;
            console.log("Sélection annulée");
        } else {
            // Essayer de jouer le coup
            const moveConfig = {
                from: toSquare(selectedPosition.row, selectedPosition.col),
                to: toSquare(row, col),
                promotion: 'q' // Simplification : toujours Dame
            };
            
            const move = game.move(moveConfig);
            
            if (move) {
                console.log("Coup joué :", move.san);
                selectedPosition = null; // Succès
            } else {
                console.log("Coup ILLÉGAL !");
                // Feedback visuel possible ici (ex: flash rouge)
                // Pour l'instant on ne fait rien, on garde la pièce en main
            }
        }
    } else {
        // --- SÉLECTION ---
        // On ne peut sélectionner qu'une pièce de la couleur du trait (celui qui doit jouer)
        if (piece && piece.color === game.turn()) {
            selectedPosition = { row, col };
            console.log("Pièce sélectionnée :", piece.type);
        } else if (piece) {
            console.log("Ce n'est pas votre tour !");
        }
    }
    renderBoard();
}

// Initialisation
initBoard();

// Export
window.ChessGame = {
    moveCursor,
    actionTriggered
};