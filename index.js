const size = 4;
let board, score = 0;

function init() {
  board = Array.from({length: size}, () => Array(size).fill(0));
  score = 0;
  addTile();
  addTile();
  update();
  document.getElementById('message').textContent = '';
}

function addTile() {
  let empty = [];
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (board[r][c] === 0) empty.push([r, c]);
  if (empty.length) {
    let [r, c] = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
}

function update() {
  let grid = document.getElementById('grid');
  grid.innerHTML = '';
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      let value = board[r][c];
      let cell = document.createElement('div');
      cell.className = 'cell';
      if (value) {
        cell.textContent = value;
        cell.setAttribute('data-value', value);
      }
      grid.appendChild(cell);
    }
  document.getElementById('score').textContent = 'Score: ' + score;
}

function slide(row) {
  row = row.filter(x => x);
  for (let i = 0; i < row.length-1; i++) {
    if (row[i] === row[i+1]) {
      row[i] *= 2;
      score += row[i];
      row[i+1] = 0;
    }
  }
  return row.filter(x => x).concat(Array(size).fill(0)).slice(0, size);
}

function rotate(board) {
  // Transpose + reverse rows
  let n = board.length;
  let ret = Array.from({length: n}, () => Array(n).fill(0));
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      ret[c][n-1-r] = board[r][c];
  return ret;
}

function move(direction) {
  let changed = false;
  for (let i = 0; i < direction; i++) board = rotate(board);
  for (let r = 0; r < size; r++) {
    let original = board[r].slice();
    let newRow = slide(board[r]);
    board[r] = newRow;
    if (newRow.toString() !== original.toString()) changed = true;
  }
  for (let i = 0; i < (4 - direction) % 4; i++) board = rotate(board);
  if (changed) {
    addTile();
    update();
    checkGameOver();
  }
}

function hasMoves() {
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (board[r][c] === 0) return true;
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size-1; c++)
      if (board[r][c] === board[r][c+1]) return true;
  for (let c = 0; c < size; c++)
    for (let r = 0; r < size-1; r++)
      if (board[r][c] === board[r+1][c]) return true;
  return false;
}

function checkGameOver() {
  if (!hasMoves()) {
    document.getElementById('message').textContent = 'Game Over!';
    document.removeEventListener('keydown', handler);
  }
  if (board.flat().includes(2048)) {
    document.getElementById('message').textContent = 'You Win!';
    document.removeEventListener('keydown', handler);
  }
}

function handler(e) {
  switch (e.key) {
    case 'ArrowLeft': move(0); break;
    case 'ArrowUp': move(3); break;
    case 'ArrowRight': move(2); break;
    case 'ArrowDown': move(1); break;
    case 'r': init(); break;
  }
}

document.addEventListener('keydown', handler);
window.onload = init;
