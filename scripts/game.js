/**
 * Snake Game v2.00
 * Author: Jashan
 * Description: A polished, retro-inspired Snake game built with HTML, CSS, and JavaScript using Canvas and Howler.js.
 * Features: Animated sprites, smooth gameplay, background music, difficulty selection, mute toggle, volume slider,
 *           high score tracking, responsive UI, and death reason display.
 * Last updated: May 27, 2025
 */

// ✨ Difficulty Selector Inside Canvas
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const gameInfo = document.getElementById("game-info");
canvas.width = 595;
canvas.height = 455;

let gridSize = 35;
let cols = Math.floor(canvas.width / gridSize);
let rows = Math.floor(canvas.height / gridSize);
let snake = [];
let dx = gridSize;
let dy = 0;
let food = { x: 0, y: 0 };
let score = 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let gameInterval;
let currentSpeed = 150;
let wallMode = false;
let walls = [];
let gameStarted = false;
let tick = 0;
let deathReason = "";

// 🐍 Keyframe Sprites
const headFrames = [], bodyFrames = [], tailFrames = [];
for (let i = 1; i <= 8; i++) {
  const head = new Image(); head.src = `assets/images/snake-anim/head_${i}.png`; headFrames.push(head);
  const body = new Image(); body.src = `assets/images/snake-anim/body_${i}.png`; bodyFrames.push(body);
  const tail = new Image(); tail.src = `assets/images/snake-anim/tail_${i}.png`; tailFrames.push(tail);
}
const appleImg = new Image();
appleImg.src = 'assets/images/apple.png';

// 🔊 Sounds
const eatSound = new Howl({ src: ['assets/sounds/eat.mp3'] });
const gameOverSound = new Howl({ src: ['assets/sounds/gameover.mp3'] });
const moveSound = new Howl({ src: ['assets/sounds/move.mp3'] });

// 🎵 Background Music
const bgMusic = new Howl({
  src: ['assets/sounds/bg-music.mp3'],
  loop: true,
  volume: 0.4
});

// 🍏 Difficulty Buttons
const difficulties = [
  { label: "EASY", speed: 200 },
  { label: "MEDIUM", speed: 150 },
  { label: "HARD", speed: 100 }
];
let hovered = null;

// 🎯 Menu Interactions
canvas.addEventListener("mousemove", (e) => {
  if (gameStarted) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  hovered = null;
  const spacing = 160;
  const startX = canvas.width / 2 - spacing;
  const buttonY = 280;
  const w = 120;
  const h = 45;

  difficulties.forEach((btn, i) => {
    const bx = startX + i * spacing;
    if (x >= bx - w / 2 && x <= bx + w / 2 && y >= buttonY - h / 2 && y <= buttonY + h / 2) {
      hovered = i;
    }
  });

  drawStartMenu();
});

canvas.addEventListener("click", () => {
  if (hovered !== null && !gameStarted) {
    currentSpeed = difficulties[hovered].speed;
    startGame();
  }
});

function drawStartMenu() {
  ctx.fillStyle = "#cde888";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";

  ctx.font = "52px VT323";
  ctx.fillStyle = "#111";
  ctx.fillText("SNAKE", canvas.width / 2, 100);

  ctx.font = "20px VT323";
  ctx.fillStyle = "#333";
  ctx.fillText("Inspired by the classic Nokia Snake", canvas.width / 2, 140);

  ctx.font = "24px VT323";
  ctx.fillStyle = "#111";
  ctx.fillText("Choose Difficulty", canvas.width / 2, 200);

  const spacing = 160;
  const startX = canvas.width / 2 - spacing;
  const y = 280;

  difficulties.forEach((btn, i) => {
    const x = startX + i * spacing;
    const w = 120;
    const h = 45;

    ctx.textBaseline = "middle";
    ctx.font = "22px VT323";
    ctx.textAlign = "center";

    if (hovered === i) {
      ctx.fillStyle = "#111";
      ctx.fillRect(x - w / 2, y - h / 2, w, h);
      ctx.fillStyle = "#cde888";
    } else {
      ctx.fillStyle = "#cde888";
      ctx.fillRect(x - w / 2, y - h / 2, w, h);
      ctx.strokeStyle = "#111";
      ctx.strokeRect(x - w / 2, y - h / 2, w, h);
      ctx.fillStyle = "#111";
    }

    ctx.fillText(btn.label, x, y);
  });
}

function drawGame() {
  ctx.fillStyle = "#cde888";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (appleImg.complete) ctx.drawImage(appleImg, food.x, food.y, gridSize, gridSize);

  snake.forEach((part, index) => {
    let frame = index === 0 ? headFrames[tick % headFrames.length]
              : index === snake.length - 1 ? tailFrames[(tick + index) % tailFrames.length]
              : bodyFrames[(tick + index) % bodyFrames.length];
    if (frame.complete) {
      ctx.drawImage(frame, part.x, part.y, gridSize, gridSize);
    } else {
      frame.onload = () => ctx.drawImage(frame, part.x, part.y, gridSize, gridSize);
    }
  });

  updateHUD();
}

function updateHUD() {
  if (!gameStarted) return;
  document.getElementById("score-display").textContent = `Score: ${score}`;
  document.getElementById("highscore-display").textContent = `High Score: ${highScore}`;
  const currentLabel = difficulties.find(d => d.speed === currentSpeed)?.label || "???";
  document.getElementById("difficulty-display").textContent = currentLabel;
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    deathReason = "Wall Collision";
    return gameOver();
  }

  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    deathReason = "Self Collision";
    return gameOver();
  }

  snake.unshift(head);
  moveSound.play();

  if (head.x === food.x && head.y === food.y) {
    eatSound.play();
    score++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
    food = getRandomFoodPosition();
  } else {
    snake.pop();
  }
}

function drawHUD() {
  ctx.font = "22px VT323";
  ctx.fillStyle = "#111";
  ctx.textAlign = "left";
  ctx.fillText(score, 10, canvas.height - 10);

  ctx.textAlign = "right";
  const currentLabel = difficulties.find(d => d.speed === currentSpeed)?.label || "???";
  ctx.fillText(`${currentLabel}`, canvas.width - 10, canvas.height - 10);
}

function getRandomFoodPosition() {
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * cols) * gridSize;
    const y = Math.floor(Math.random() * rows) * gridSize;
    if (!snake.some(s => s.x === x && s.y === y)) return { x, y };
  }
  return { x: 0, y: 0 };
}

function gameOver() {
  clearInterval(gameInterval);
  gameOverSound.play();
  gameStarted = false;
  document.body.classList.remove("playing");

  if (bgMusic.playing()) {
    bgMusic.stop();
  }
  bgMusic.play();

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  let alpha = 0;
  function fadeGameOver() {
    drawGame();
    ctx.fillStyle = `rgba(17, 17, 17, ${alpha})`;
    ctx.font = "48px VT323";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    if (deathReason) {
      ctx.font = "20px VT323";
      ctx.fillText(deathReason, canvas.width / 2, canvas.height / 2 + 40);
    }

    if (alpha < 1) {
      alpha += 0.02;
      requestAnimationFrame(fadeGameOver);
    } else {
      setTimeout(() => drawStartMenu(), 1500);
    }
  }

  fadeGameOver();
}

function gameLoop() {
  moveSnake();
  drawGame();
  tick++;
}

function startGame() {
  gameStarted = true;
  document.body.classList.add("playing");
  score = 0;
  deathReason = "";

  cols = Math.floor(canvas.width / gridSize);
  rows = Math.floor(canvas.height / gridSize);
  snake = [{ x: Math.floor(cols / 2) * gridSize, y: Math.floor(rows / 2) * gridSize }];
  dx = gridSize;
  dy = 0;
  food = getRandomFoodPosition();
  tick = 0;

  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, currentSpeed);

  if (!bgMusic.playing()) {
    bgMusic.play();
  }

  updateHUD();
}

window.addEventListener("load", drawStartMenu);

document.addEventListener("keydown", e => {
  const k = e.key;
  if (k === "ArrowUp" && dy === 0) { dx = 0; dy = -gridSize; }
  else if (k === "ArrowDown" && dy === 0) { dx = 0; dy = gridSize; }
  else if (k === "ArrowLeft" && dx === 0) { dx = -gridSize; dy = 0; }
  else if (k === "ArrowRight" && dx === 0) { dx = gridSize; dy = 0; }
});

// 🔇 Mute toggle
const slider = document.getElementById('volume-slider');
const volumeIcon = document.querySelector('.volume-icon');

let lastVolume = parseFloat(slider.value) || 0.4;
Howler.volume(lastVolume);

slider.addEventListener('input', function () {
  lastVolume = parseFloat(this.value);
  Howler.volume(lastVolume);
  if (lastVolume > 0) {
    volumeIcon.classList.remove('muted');
  }
});

volumeIcon.addEventListener('click', () => {
  const isMuted = Howler.volume() === 0;
  if (isMuted) {
    Howler.volume(lastVolume || 0.4);
    slider.value = lastVolume || 0.4;
    volumeIcon.classList.remove('muted');
  } else {
    Howler.volume(0);
    slider.value = 0;
    volumeIcon.classList.add('muted');
  }
});


