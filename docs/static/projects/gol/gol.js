

///////// Modal
// var infoModal = document.getElementById('infoModal')
// var myInput = document.getElementById('myInput')
// infoModal.addEventListener('shown.bs.modal', function () {
//   myInput.focus()
// })

var infoModal = new bootstrap.Modal(document.getElementById('infoModal'), {
  keyboard: false
})

infoModal.toggle()
/////
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let showNumbersButton = document.getElementById("showNumbersButton");
let speedRangeSlider = document.getElementById("speedRange");
let generationCountElem = document.getElementById("generationCount");
let periodicStateBlinker = document.getElementById("periodicStateBlinker");
let pauseButton = document.getElementById("pauseButton");
let boardSizeRadios = document.getElementsByName('boardSizeRadio');
let resetButton = document.getElementById("resetButton");
let gliderArmySpawnButton = document.getElementById("gliderArmySpawnButton");


showNumbersButton.onchange = updateShowNumber;
speedRangeSlider.onchange = updateCurrentSpeed;
resetButton.onclick = updateBoardSize;
gliderArmySpawnButton.onclick = gliderArmySpawn;


let boardSize = 16;
let tileSize = canvas.height / boardSize;
let paused = true;
let gridHistory = new Array();
let isPeriodic = false;
let markedAsPeriodic = false;
let generationCount = 0;
let slowestRate = 1000;
let currentSpeed = slowestRate - Number(speedRangeSlider.value);
let showNeighborCount = false;
let isToroidalGrid = true;

// tooltips
var toroidalToolTip = document.getElementById('toroidalToolTip');
var tooltip = new bootstrap.Tooltip(toroidalToolTip);
var periodicStateBlinkerToolTip = document.getElementById('periodicStateBlinker');
var tooltip = new bootstrap.Tooltip(periodicStateBlinkerToolTip);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~

let grid = initRandomGrid(nrows = boardSize, ncols = boardSize);
drawBoard(grid);
let interval = setInterval(updateBoard, currentSpeed);

$('#infoModal').on('hide.bs.modal', pauseOff)
$('#infoModal').on('show.bs.modal', pauseOn)

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~

function pauseOn() {
  paused = true;
}

function pauseOff() {
  paused = false;
}

function togglePause() {
  paused = !paused;
}

function updateIsToroidalGridButton() {
  isToroidalGrid = !isToroidalGrid
}

function getBoardSizeRadioVals() {
  return Number(Array.from(boardSizeRadios).filter(b => b.checked)[0].nextElementSibling.textContent);
}

function updateGenerationCount() {

  generationCountElem.textContent = generationCount

  }


function updateCurrentSpeed() {
  clearInterval(interval);
  currentSpeed = slowestRate - Number(speedRangeSlider.value);
  interval = setInterval(updateBoard, currentSpeed);
}

function updateShowNumber() {
  clearInterval(interval);
  showNeighborCount = showNumbersButton.checked;
  interval = setInterval(updateBoard, currentSpeed);
}

function reset() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  generationCount = 0;
  updateGenerationCount();
  isPeriodic = false;
  markedAsPeriodic = false;
  periodicStateBlinker.style.visibility = "hidden";
  clearInterval(interval);
}

function updateBoardSize() {

  boardSize = getBoardSizeRadioVals();

  if (boardSize > 64){
    showNumbersButton.checked = false;
    showNumbersButton.disabled = true;
    updateShowNumber()
  }
  else {
    showNumbersButton.disabled = false;
    updateShowNumber()
  }

  reset()
  tileSize = canvas.height / boardSize;
  grid = initRandomGrid(nrows = boardSize, ncols = boardSize);
  drawBoard(grid);
  interval = setInterval(updateBoard, currentSpeed);
}

function gliderArmySpawn() {
  reset()
  gridHistory = new Array();
  boardSize = getBoardSizeRadioVals();
  tileSize = canvas.height / boardSize;
  grid = initGliderArmyGrid(nrows = boardSize, ncols = boardSize);
  drawBoard(grid);
  interval = setInterval(updateBoard, currentSpeed);
}

function saveGrid(grid) {
  gridHistory.push(grid);
  gridHistory = gridHistory.slice(-65);
}

function checkIfPeriodic() {
  isPeriodic = gridHistory.some(g => g.toString() == grid.toString())
  if (isPeriodic && !markedAsPeriodic) {
    generationCountElem.textContent+='+'
    periodicStateBlinker.style.visibility = "visible";
    markedAsPeriodic = true
  } else if (!isPeriodic) {
    generationCount++;
    updateGenerationCount();
    markedAsPeriodic = false;
    periodicStateBlinker.style.visibility = "hidden";
  }
}

function updateBoard() {
  if (!paused) {
    saveGrid(grid)
    grid = updateGrid(grid);
    checkIfPeriodic();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard(grid);
  }
}

function make2DArray(nrows, ncols) {

  let arr = new Array(ncols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(nrows)
  }
  return arr
}

function initRandomGrid(nrows, ncols) {

  let grid = make2DArray(nrows, ncols);
  for (let i = 0; i < ncols; i++) {
    for (let j = 0; j < ncols; j++) {
      grid[i][j] = Math.floor(Math.random() * 2);
    }
  }
  return grid
}

function initGliderArmyGrid(nrows, ncols) {

  let repeatSquareSize = 5;
  let lastRowIndex = nrows - (nrows % repeatSquareSize);

  let grid = make2DArray(nrows, ncols);
  for (let i = 0; i < ncols; i++) {
    for (let j = 0; j < nrows; j++) {

      if (i >= lastRowIndex || j >= lastRowIndex) continue;

      i_ = i % repeatSquareSize;
      j_ = j % repeatSquareSize;

      if ((j_ == 0 || j_ == 4) ||
        (i_ >= 3) ||
        (j_ == 1 && i_ < 2) ||
        (j_ == 2 && i_ == 1) ||
        (j_ == 3 && i_ == 0)) {
        grid[i][j] = 0;
      } else {
        grid[i][j] = 1
      }
    }
  }
  return grid
}


function getTileNeighbors(grid, x, y) {

  let left_neighbor_col_index = isToroidalGrid ? (boardSize + (x - 1)) % boardSize : x - 1;
  let right_neighbor_col_index = isToroidalGrid ? (boardSize + (x + 1)) % boardSize : x + 1;

  let left_neighbor_col = grid[left_neighbor_col_index];
  let right_neighbor_col = grid[right_neighbor_col_index];

  let bottom_row_index = isToroidalGrid ? (boardSize + (y - 1)) % boardSize : y - 1;
  let upper_row_index = isToroidalGrid ? (boardSize + (y + 1)) % boardSize : y + 1;
  //
  let cb = grid[x][bottom_row_index]; // center bottom
  let cu = grid[x][upper_row_index]; //center upper

  let lu, lm, lb, ru, rm, rb;

  if (left_neighbor_col) {
    lu = left_neighbor_col[upper_row_index]; //left upper
    lm = left_neighbor_col[y]; //left middle
    lb = left_neighbor_col[bottom_row_index]; // left bottom
  }

  if (right_neighbor_col) {
    ru = right_neighbor_col[upper_row_index]; //right upper
    rm = right_neighbor_col[y]; //right middle
    rb = right_neighbor_col[bottom_row_index]; // right bottom
  }
  return [lu, lm, lb, cu, cb, ru, rm, rb].reduce((a, b) => a + (b || 0), 0)
}

function updateGrid(grid) {

  new_grid = make2DArray(grid.length, grid[0].length);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {

      let n_neighbors = getTileNeighbors(grid, i, j);

      switch (true) {

        case (grid[i][j] && (n_neighbors < 2)):
          //Any live cell with fewer than two live neighbours dies, as if by underpopulation.
          new_grid[i][j] = 0
          break;

        case (grid[i][j] && ((n_neighbors == 2) || (n_neighbors == 3))):
          //Any live cell with two or three live neighbours lives on to the next generation.
          new_grid[i][j] = 1
          break;

        case (grid[i][j] && (n_neighbors > 3)):
          //Any live cell with more than three live neighbours dies, as if by overpopulation.
          new_grid[i][j] = 0
          break;

        case ((!grid[i][j]) && (n_neighbors == 3)):
          //Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
          new_grid[i][j] = 1
          break;
      }
    }
  }
  return new_grid
}

function drawBoard(grid) {

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j]) {
        n_neighbors = getTileNeighbors(grid, i, j)
        drawSquare(i, j, tileSize, n_neighbors, showNeighborCount);
      }
    }
  }
}

function drawSquare(x, y, tileSize, n_neighbors, showNeighborCount) {

  ctx.beginPath();
  ctx.rect(tileSize * x, tileSize * y, tileSize, tileSize);
  ctx.fillStyle = "#ffc107";
  ctx.fill();
  ctx.lineWidth = tileSize / 10;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.closePath();

  if (showNeighborCount) {
    ctx.beginPath();
    ctx.font = tileSize + "px Arial";
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = "#ffffff";
    ctx.fillText(n_neighbors, tileSize * (x + 1 / 4), tileSize * (y + 1.1));
    ctx.closePath();
  }
}
