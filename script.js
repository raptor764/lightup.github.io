// Function to display the rules popup
function showRules() {
  document.getElementById("rulesPopup").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// Function to hide the rules popup
function hideRules() {
  document.getElementById("rulesPopup").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

const boardElement = document.getElementById("board");
let boardState = [];

// Preset puzzles
const puzzles = [
  {
    walls: [
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 5],
      [1, 6],
      [1, 8],
      [2, 2],
      [2, 7],
      [2, 8],
      [3, 1],
      [3, 8],
      [4, 1],
      [5, 8],
      [6, 1],
      [6, 8],
      [7, 1],
      [7, 2],
      [7, 7],
      [8, 1],
      [8, 3],
      [8, 4],
      [8, 6],
      [8, 7],
      [8, 8],
    ],
    wallNums: [
      { coords: [1, 5], num: 2 },
      { coords: [1, 8], num: 2 },
      { coords: [2, 2], num: 3 },
      { coords: [5, 8], num: 1 },
      { coords: [6, 1], num: 2 },
      { coords: [7, 7], num: 3 },
      { coords: [8, 1], num: 2 },
    ],
  },
  {
    walls: [
      [0, 0],
      [0, 2],
      [0, 3],
      [0, 5],
      [0, 6],
      [0, 9],
      [2, 5],
      [2, 6],
      [2, 9],
      [3, 0],
      [3, 2],
      [3, 9],
      [4, 0],
      [4, 2],
      [5, 7],
      [5, 9],
      [6, 0],
      [6, 7],
      [6, 9],
      [7, 0],
      [7, 3],
      [7, 4],
      [9, 0],
      [9, 3],
      [9, 4],
      [9, 6],
      [9, 7],
      [9, 9],
    ],
    wallNums: [
      { coords: [0, 2], num: 1 },
      { coords: [2, 6], num: 2 },
      { coords: [3, 0], num: 1 },
      { coords: [3, 9], num: 1 },
      { coords: [4, 0], num: 2 },
      { coords: [6, 9], num: 0 },
      { coords: [7, 3], num: 2 },
      { coords: [9, 4], num: 2 },
      { coords: [9, 9], num: 1 },
    ],
  },
  {
    walls: [
      [0, 2],
      [1, 3],
      [1, 5],
      [2, 3],
      [2, 9],
      [3, 3],
      [3, 6],
      [3, 7],
      [3, 8],
      [4, 1],
      [5, 8],
      [6, 1],
      [6, 2],
      [6, 3],
      [6, 6],
      [7, 0],
      [7, 6],
      [8, 4],
      [8, 6],
      [9, 7],
    ],
    wallNums: [
      { coords: [0, 2], num: 2 },
      { coords: [1, 5], num: 2 },
      { coords: [2, 9], num: 3 },
      { coords: [3, 3], num: 1 },
      { coords: [4, 1], num: 2 },
      { coords: [6, 3], num: 1 },
      { coords: [6, 6], num: 1 },
      { coords: [7, 0], num: 1 },
      { coords: [7, 6], num: 1 },
      { coords: [8, 4], num: 1 },
      { coords: [9, 7], num: 1 },
    ],
  },
  {
    walls: [
      [0, 8],
      [1, 0],
      [1, 2],
      [1, 3],
      [2, 3],
      [2, 8],
      [3, 4],
      [3, 7],
      [3, 8],
      [4, 8],
      [5, 3],
      [6, 1],
      [6, 2],
      [6, 5],
      [7, 1],
      [7, 6],
      [8, 6],
      [8, 7],
      [8, 9],
      [9, 1],
    ],
    wallNums: [
      { coords: [1, 2], num: 3 },
      { coords: [2, 8], num: 3 },
      { coords: [3, 4], num: 1 },
      { coords: [3, 7], num: 3 },
      { coords: [6, 5], num: 3 },
      { coords: [7, 1], num: 2 },
      { coords: [8, 9], num: 2 },
    ],
  },
];

// Initialize the board
function initializeBoard() {
  for (let i = 0; i < 10; i++) {
    boardState[i] = [];
    for (let j = 0; j < 10; j++) {
      boardState[i][j] = "empty";
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("data-row", i);
      cell.setAttribute("data-col", j);
      cell.addEventListener("click", toggleCell);
      boardElement.appendChild(cell);
    }
  }
  // Load the first puzzle automatically
  choosePuzzle();
}

// Function to toggle the state of a cell (lit, light, or empty)
function toggleCell(event) {
  const row = parseInt(event.target.getAttribute("data-row"));
  const col = parseInt(event.target.getAttribute("data-col"));

  if (boardState[row][col] === "empty") {
    // If the cell is empty, light up cells in the same row and column

    lightUpCells(row, col, true);
  } else if (boardState[row][col] === "light") {
    // If the cell is lit or light, remove light from cells in the same row and column

    lightUpCells(row, col, false);
  }

  updateBoardView();
}

// Function to update the visual representation of the board
function updateBoardView() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 10);
    const col = index % 10;

    if (boardState[row][col] === "lit") {
      cell.style.backgroundColor = "#ffd700";

      cell.textContent = "";
    } else if (boardState[row][col] === "light") {
      cell.style.backgroundColor = "#ffd700";
      cell.classList.add("light"); // Add light class
      cell.textContent = "";
    } else if (boardState[row][col] === "wall") {
      cell.className = "cell wall"; // Use black for wall cells
      cell.textContent = "";
    } else if (
      typeof boardState[row][col] === "string" &&
      /^numbered-wall-\d+$/.test(boardState[row][col])
    ) {
      // Check if it's a numbered wall using a regular expression
      cell.className = "cell numbered-wall";
      cell.textContent = boardState[row][col].split("-")[2]; // Extract the number
    } else {
      cell.classList.remove("light");
      cell.style.backgroundColor = "#fff";
      cell.textContent = "";
    }
  });
}
// Function to load the selected puzzle onto the board
function loadPuzzle(selectedPuzzle) {
  // Clear the board
  boardElement.innerHTML = "";

  // Set up the new puzzle on the board
  for (let i = 0; i < 10; i++) {
    boardState[i] = [];
    for (let j = 0; j < 10; j++) {
      boardState[i][j] = "empty";
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("data-row", i);
      cell.setAttribute("data-col", j);
      cell.addEventListener("click", toggleCell);
      boardElement.appendChild(cell);
    }
  }

  for (const wall of selectedPuzzle.walls) {
    const [row, col] = wall;
    boardState[row][col] = "wall";
  }
  for (const wallNum of selectedPuzzle.wallNums) {
    const { coords, num } = wallNum;
    const [row, col] = coords;
    boardState[row][col] = `numbered-wall-${num}`;
  }

  // Update the board view
  updateBoardView();
}

// Function to choose a puzzle randomly when the player clicks the "Choose Puzzle" button
function choosePuzzle() {
  const randomPuzzleIndex = Math.floor(Math.random() * puzzles.length);
  const selectedPuzzle = puzzles[randomPuzzleIndex];
  loadPuzzle(selectedPuzzle);
}

// Function to light up or remove light from cells in the same row and column
function lightUpCells(row, col, shouldLight) {
  // Light up or remove light in the same cell
  boardState[row][col] = shouldLight ? "light" : "empty";

  // Light up or remove light in the same row
  for (
    let i = col - 1;
    i >= 0 && (shouldLight || boardState[row][i] === "lit");
    i--
  ) {
    if (
      boardState[row][i] === "wall" ||
      /^numbered-wall-\d+$/.test(boardState[row][i])
    ) {
      break;
    }
    boardState[row][i] = shouldLight ? "lit" : "empty";
    if (shouldLight == false) {
      refreshBoard();
    }
  }
  for (
    let i = col + 1;
    i < 10 && (shouldLight || boardState[row][i] === "lit");
    i++
  ) {
    if (
      boardState[row][i] === "wall" ||
      /^numbered-wall-\d+$/.test(boardState[row][i])
    ) {
      break;
    }
    boardState[row][i] = shouldLight ? "lit" : "empty";
    if (shouldLight == false) {
      refreshBoard();
    }
  }

  // Light up or remove light in the same column
  for (
    let j = row - 1;
    j >= 0 && (shouldLight || boardState[j][col] === "lit");
    j--
  ) {
    if (
      boardState[j][col] === "wall" ||
      /^numbered-wall-\d+$/.test(boardState[j][col])
    ) {
      break;
    }
    boardState[j][col] = shouldLight ? "lit" : "empty";
    if (shouldLight == false) {
      refreshBoard();
    }
  }
  for (
    let j = row + 1;
    j < 10 && (shouldLight || boardState[j][col] === "lit");
    j++
  ) {
    if (
      boardState[j][col] === "wall" ||
      /^numbered-wall-\d+$/.test(boardState[j][col])
    ) {
      break;
    }
    boardState[j][col] = shouldLight ? "lit" : "empty";
    if (shouldLight == false) {
      refreshBoard();
    }
  }

  // Update the board view
  updateBoardView();
}

// Resets the Board
function resetBoard() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (boardState[i][j] === "lit" || boardState[i][j] === "light") {
        boardState[i][j] = "empty";
      }
    }
  }
  // Update the board view
  updateBoardView();
}

//to Refresh the board after removing Lights
function refreshBoard() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (boardState[i][j] === "light") {
        lightUpCells(i, j, true);
      }
    }
  }
  // Update the board view
  updateBoardView();
}

//Check if Solution is Correct
function checkSolution() {
  // Iterate through the entire board
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Check if any cell is empty
      if (boardState[i][j] === "empty") {
        setResultMessage("Not Solved!");
        return;
      }

      // Check if the numbered walls have the correct number of adjacent light cells
      if (/^numbered-wall-\d+$/.test(boardState[i][j])) {
        const num = parseInt(boardState[i][j].split("-")[2]);
        const count = countAdjacentLights(i, j);

        if (count !== num) {
          setResultMessage("Not Solved!");
          return;
        }
      }
    }
  }

  // If all conditions are met, the puzzle is solved
  setResultMessage("Solved!");
}

// Function to count the number of adjacent light cells for a numbered wall
function countAdjacentLights(row, col) {
  let count = 0;

  // Check left
  if (col > 0 && boardState[row][col - 1] === "light") {
    count++;
  }

  // Check right
  if (col < 9 && boardState[row][col + 1] === "light") {
    count++;
  }

  // Check up
  if (row > 0 && boardState[row - 1][col] === "light") {
    count++;
  }

  // Check down
  if (row < 9 && boardState[row + 1][col] === "light") {
    count++;
  }

  return count;
}

function hideResult(event) {
  const resultOverlay = document.getElementById("resultOverlay");
  const overlay = document.getElementById("overlay");

  // Check if the click target is not the "Done" button or the result overlay
  if (
    event.target.tagName !== "BUTTON" &&
    !resultOverlay.contains(event.target)
  ) {
    resultOverlay.style.display = "none";
    overlay.style.display = "none";
  }
}

// Add this event listener to your existing JavaScript code
document.body.addEventListener("click", hideResult);

function setResultMessage(message, color) {
  const resultMessageElement = document.getElementById("resultMessage");
  resultMessageElement.textContent = message;
  resultMessageElement.style.color = color;

  const resultOverlay = document.getElementById("resultOverlay");
  resultOverlay.style.display = "block";

  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  overlay.style.zIndex = "800";
}
// Initialize the board when the page loads
window.onload = initializeBoard;
