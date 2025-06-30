const board = document.getElementById('board');
const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
let selectedSquare = null;
let turn = 'W';
let gameMode = 'beginner';

function createBoard() {
  board.innerHTML = '';
  for (let r = 8; r >= 1; r--) {
    for (let c = 1; c <= 8; c++) {
      const box = document.createElement('div');
      box.className = 'box';
      box.id = `b${r}0${c}`;
      box.innerText = '';
      box.addEventListener('click', () => handleBoxClick(box));
      board.appendChild(box);
    }
  }
  setupPieces();
  colorBoard();
}

function setupPieces() {
  for (let c = 1; c <= 8; c++) {
    document.getElementById(`b20${c}`).innerText = 'Wpawn';
    document.getElementById(`b70${c}`).innerText = 'Bpawn';
    document.getElementById(`b10${c}`).innerText = 'W' + pieceOrder[c-1];
    document.getElementById(`b80${c}`).innerText = 'B' + pieceOrder[c-1];
  }
  insertImages();
}

function colorBoard() {
  document.querySelectorAll('.box').forEach(sq => {
    let [r, c] = sq.id.slice(1).split('0').map(Number);
    sq.style.backgroundColor = (r + c) % 2 === 0 ? '#f0d9b5' : '#b58863';
  });
}

function insertImages() {
  document.querySelectorAll('.box').forEach(box => {
    if (box.innerText.length) {
      let piece = box.innerText;
      box.innerHTML = `<img class="all-img" src="${piece}.png" alt="">`;
    } else {
      box.innerHTML = '';
    }
  });
}

function handleBoxClick(box) {
  if (turn !== 'W') return;

  if (!box.innerText.startsWith('W')) return;

  colorBoard();
  box.style.backgroundColor = 'blue';
  selectedSquare = box;
  showMoves(box);
}

function showMoves(box) {
  let piece = box.innerText;
  let pos = box.id;
  let [r, c] = pos.slice(1).split('0').map(Number);
  const moves = {
    pawn: pawnMoves,
    rook: rookMoves,
    bishop: bishopMoves,
    knight: knightMoves,
    queen: queenMoves,
    king: kingMoves
  };
  const type = piece.slice(1);
  moves[type.toLowerCase()](r, c, piece[0]);
}

function pawnMoves(r, c, color) {
  let dir = color === 'W' ? 1 : -1;
  let startRow = color === 'W' ? 2 : 7;
  if (getBox(r+dir, c).innerText === '') highlight(r+dir, c);
  if (r === startRow && getBox(r+dir, c).innerText === '' && getBox(r+2*dir, c).innerText === '') highlight(r+2*dir, c);
  if (getBox(r+dir, c+1).innerText.startsWith(oppColor(color))) highlight(r+dir, c+1);
  if (getBox(r+dir, c-1).innerText.startsWith(oppColor(color))) highlight(r+dir, c-1);
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
      if (sq.innerText === '') highlight(nr,nc);
      else {
        if (sq.innerText.startsWith(oppColor(color))) highlight(nr,nc);
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
      if (sq.innerText === '' || sq.innerText.startsWith(oppColor(color))) highlight(nr,nc);
    }
  });
}

function getBox(r, c) {
  return document.getElementById(`b${r}0${c}`) || {innerText: 'x'};
}

function valid(r, c) {
  return r >= 1 && r <= 8 && c >= 1 && c <= 8;
}

function oppColor(color) {
  return color === 'W' ? 'B' : 'W';
}

function highlight(r,c) {
  let sq = getBox(r,c);
  if (sq.innerText !== 'x') {
    sq.style.backgroundColor = 'greenyellow';
    sq.onclick = () => movePiece(sq);
  }
}

function movePiece(targetBox) {
  if (selectedSquare) {
    targetBox.innerText = selectedSquare.innerText;
    selectedSquare.innerText = '';
    selectedSquare = null;
    colorBoard();
    insertImages();
    turn = 'B';
    document.getElementById('tog').innerText = "Black's Turn";
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  let moves = [];
  document.querySelectorAll('.box').forEach(box => {
    if (box.innerText.startsWith('B')) moves.push(box);
  });

  if (moves.length === 0) return;

  if (gameMode === 'beginner') {
    let pawns = moves.filter(b => b.innerText.includes('pawn'));
    let moveFrom = pawns.length ? pawns[Math.floor(Math.random() * pawns.length)] : moves[Math.floor(Math.random() * moves.length)];
    randomMove(moveFrom);
  } else {
    let moveFrom = moves[Math.floor(Math.random() * moves.length)];
    randomMove(moveFrom);
  }
}

function randomMove(fromBox) {
  let [r, c] = fromBox.id.slice(1).split('0').map(Number);
  let possibleMoves = [];

  const type = fromBox.innerText.slice(1);
  const color = 'B';
  const moves = {
    pawn: pawnMoves,
    rook: rookMoves,
    bishop: bishopMoves,
    knight: knightMoves,
    queen: queenMoves,
    king: kingMoves
  };

  colorBoard();
  selectedSquare = fromBox;
  moves[type.toLowerCase()](r, c, color);

  document.querySelectorAll('.box').forEach(box => {
    if (box.style.backgroundColor === 'greenyellow') possibleMoves.push(box);
  });

  if (possibleMoves.length) {
    let moveTo = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    moveTo.innerText = fromBox.innerText;
    fromBox.innerText = '';
  }

  selectedSquare = null;
  colorBoard();
  insertImages();
  turn = 'W';
  document.getElementById('tog').innerText = "White's Turn";
}

document.getElementById("reset-btn").onclick = createBoard;
document.getElementById("start-btn").onclick = () => {
  gameMode = document.getElementById("mode").value;
  createBoard();
};

createBoard();