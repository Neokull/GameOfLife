const canvas = document.getElementById("life");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 12; //ej1
const COLS = Math.floor(canvas.width / CELL_SIZE);
const ROWS = Math.floor(canvas.height / CELL_SIZE);

// Crea una cuadrícula vacía (0 = muerta, 1 = viva)
function createGrid(rows, cols, fill = false) {
  const g = new Array(rows);
  for (let r = 0; r < rows; r++) {
    g[r] = new Array(cols).fill(fill ? 1 : 0);
  }
  return g;
}

let grid = createGrid(ROWS, COLS, false);

function randomize(p = 0.2) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      grid[r][c] = Math.random() < p ? 1 : 0;
    }
  }
}
randomize(0.2); // 20% vivas

function draw(showGrid = true) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "limegreen"; //ej1
  // Celdas vivas
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c]) {
        ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

draw();

function neighbors(r, c) {
  let n = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const rr = (r + dr + ROWS) % ROWS;
      const cc = (c + dc + COLS) % COLS;
      n += grid[rr][cc];
    }
  }
  return n;
}
//ej4
let generations = 0;

function step() {
  const next = createGrid(ROWS, COLS, false);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const alive = grid[r][c] === 1;
      const n = neighbors(r, c);
      next[r][c] =
        (alive && (n === 2 || n === 3)) || (!alive && n === 3) ? 1 : 0;
    }
  }
  grid = next;
  draw();
  generations++;
  document.getElementById("info").textContent = generations;
}

step(); // prueba una generación

let running = true;
function loop() {
  if (running) {
    step();
  }
  setTimeout(loop, 100);
}

loop();
// (Espacio) para pausar/reanudar
document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    running = !running;
    //ej2
    if (running) {
      console.log("Simulación en ejecución");
    } else {
      console.log("Simulación pausada");
    }
    e.preventDefault();
  }
});
//ej3
/*
const button = document.getElementById("button");

/function reboot() {
  grid = createGrid(ROWS, COLS, false);
  randomize(0.2);
  draw();
  generations = 0;
  document.getElementById("info").textContent = generations;
}

button.addEventListener("click", reboot);
*/
//ej5
const button = document.getElementById("button");
const buttonReset = document.getElementById("empty");

function reboot(event) {
  let random;

  if (event.currentTarget.id === "button") {
    random = 0.2;
  } else if (event.currentTarget.id === "empty") {
    random = 0;
  }
  grid = createGrid(ROWS, COLS, false);
  randomize(random);
  draw();
  generations = 0;
  document.getElementById("info").textContent = generations;
}

button.addEventListener("click", reboot);
buttonReset.addEventListener("click", reboot);

const blinker = document.getElementById("blinker");

function setBlinker(r, c) {
  grid[r][c - 1] = 1;
  grid[r][c] = 1;
  grid[r][c + 1] = 1;
}

blinker.addEventListener("click", () => {
  setBlinker(5, 5);
  draw();
});

const toad = document.getElementById("toad");

function setToad(r, c) {
  grid[r][c - 1] = 1;
  grid[r][c] = 1;
  grid[r][c + 1] = 1;
  grid[r - 1][c] = 1;
  grid[r - 1][c + 1] = 1;
  grid[r - 1][c + 2] = 1;
}

toad.addEventListener("click", () => {
  setToad(30, 10);
  draw();
});

const beacon = document.getElementById("beacon");
//La busque en internet esta combinacion porque la que copie me daba error.
function setBeacon(r, c) {
  // Bloque 1 (arriba-izquierda)
  grid[r][c] = 1;
  grid[r][c + 1] = 1;
  grid[r + 1][c] = 1;

  // Bloque 2 (abajo-derecha)
  grid[r + 2][c + 3] = 1;
  grid[r + 3][c + 2] = 1;
  grid[r + 3][c + 3] = 1;
}
beacon.addEventListener("click", () => {
  setBeacon(10, 30);
  draw();
});

const glider = document.getElementById("glider");

function setGlider(r, c) {
  grid[r][c] = 1;
  grid[r][c + 1] = 1;
  grid[r][c + 2] = 1;
  grid[r - 1][c + 2] = 1;
  grid[r - 2][c + 1] = 1;
}

glider.addEventListener("click", () => {
  setGlider(30, 30);
  draw();
});

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();

  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const c = Math.floor(mouseX / CELL_SIZE);
  const r = Math.floor(mouseY / CELL_SIZE);

  if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
    grid[r][c] = grid[r][c] ? 0 : 1;

    draw();
  }
});
