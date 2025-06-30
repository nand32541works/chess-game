const board = document.getElementById('board');
const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
let selectedSquare = null;
let turn = 'W';

function createBoard() {
  board.innerHTML = '';
  for (let r = 8; r >= 1; r--) {
    for (let c = 1; c <= 8; c++) {
      const box = document.createElement('div');
      box.className = 'box';
      box.id = `b${r}0${c}`;
      box.addEventListener('click', () => handleBoxClick(box));
      board.appendChild(box);
    }
  }
  setupPieces();
  colorBoard();
}

function setupPieces() {
  for (let c = 1; c <= 8; c++) {
    setPiece(`b20${c}`, 'W', 'pawn');
    setPiece(`b70${c}`, 'B', 'pawn');
    setPiece(`b10${c}`, 'W', pieceOrder[c-1]);
    setPiece(`b80${c}`, 'B', pieceOrder[c-1]);
  }
}

function setPiece(id, color, type) {
  const box = document.getElementById(id);
  box.dataset.piece = type;
  box.dataset.color = color;
  box.innerHTML = `<img class="all-img" src="${color}${type}.png" alt="">`;
}

function colorBoard() {
  document.querySelectorAll('.box').forEach(sq => {
    let [r, c] = sq.id.slice(1).split('0').map(Number);
    sq.style.backgroundColor = (r + c) % 2 === 0 ? '#f0d9b5' : '#b58863';
  });
}

function handleBoxClick(box) {
  if (box.style.backgroundColor === 'greenyellow') {
    if (selectedSquare) {
      box.dataset.piece = selectedSquare.dataset.piece;
      box.dataset.color = selectedSquare.dataset.color;
      box.innerHTML = `<img class="all-img" src="${box.dataset.color}${box.dataset.piece}.png" alt="">`;
      clearSquare(selectedSquare);
      colorBoard();
      turn = turn === 'W' ? 'B' : 'W';
      document.getElementById('tog').innerText = (turn === 'W' ? "White's Turn" : "Black's Turn");
    }
    selectedSquare = null;
    return;
  }

  if (box.dataset.color !== turn) {
    colorBoard();
    selectedSquare = null;
    return;
  }

  colorBoard();
  box.style.backgroundColor = 'blue';
  selectedSquare = box;
  showMoves(box);
}

function clearSquare(box) {
  delete box.dataset.piece;
  delete box.dataset.color;
  box.innerHTML = '';
}

function showMoves(box) {
  let { piece, color } = box.dataset;
  let [r, c] = box.id.slice(1).split('0').map(Number);
  const moves = {
    pawn: pawnMoves,
    rook: rookMoves,
    bishop: bishopMoves,
    knight: knightMoves,
    queen: queenMoves,
    king: kingMoves
  };
  moves[piece](r, c, color);
}

function pawnMoves(r, c, color) {
  let dir = color === 'W' ? 1 : -1;
  let startRow = color === 'W' ? 2 : 7;
  if (!getBox(r+dir, c).dataset.piece) highlight(r+dir, c);
  if (r === startRow && !getBox(r+dir, c).dataset.piece && !getBox(r+2*dir, c).dataset.piece) highlight(r+2*dir, c);
  if (getBox(r+dir, c+1).dataset.color === oppColor(color)) highlight(r+dir, c+1);
  if (getBox(r+dir, c-1).dataset.color === oppColor(color)) highlight(r+dir, c-1);
}

function rookMoves(r, c, color) {
  lineMoves(r, c, color, [[1,0], [-1,0], [0,1], [0,-1]]);
}

function bishopMoves(r, c, color) {
  lineMoves(r, c, color, [[1,1], [1,-1], [-1,1], [-1,-1]]);
}

function queenMoves(r, c, color) {
  lineMoves(r, c, color, [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]]);
}

function kingMoves(r, c, color) {
  singleMoves(r, c, color, [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]]);
}

function knightMoves(r, c, color) {
  singleMoves(r, c, color, [[2,1], [2,-1], [-2,1], [-2,-1], [1,2], [1,-2], [-1,2], [-1,-2]]);
}

function lineMoves(r, c, color, directions) {
  directions.forEach(([dr,dc]) => {
    let nr = r + dr, nc = c + dc;
    while (valid(nr,nc)) {
      let sq = getBox(nr,nc);
      if (!sq.dataset.piece) highlight(nr,nc);
      else {
        if (sq.dataset.color === oppColor(color)) highlight(nr,nc);
        break;
      }
      nr += dr;
      nc += dc;
    }
  });
}

function singleMoves(r, c, color, directions) {
  directions.forEach(([dr,dc]) => {
    let nr = r + dr, nc = c + dc;
    if (valid(nr,nc)) {
      let sq = getBox(nr,nc);
      if (!sq.dataset.piece || sq.dataset.color === oppColor(color)) highlight(nr,nc);
    }
  });
}

function getBox(r, c) {
  return document.getElementById(`b${r}0${c}`) || {};
}

function valid(r, c) {
  return r >= 1 && r <= 8 && c >= 1 && c <= 8;
}

function oppColor(color) {
  return color === 'W' ? 'B' : 'W';
}

function highlight(r,c) {
  let sq = getBox(r,c);
  if (sq) sq.style.backgroundColor = 'greenyellow';
}

document.getElementById("reset-btn").onclick = createBoard;
createBoard();