import { words } from "./words.js";
const wordText = document.querySelector(".word");
const questionText = document.querySelector(".question"),
  resultWord = document.querySelector(".result"),
  input = document.querySelector("input"),
  form = document.querySelector("form");

const timeText = document.querySelector(".time"),
  checkWord = document.querySelector(".check-word"),
  start = document.querySelector(".start"),
  hint = document.querySelector(".hint"),
  container = document.querySelector(".container"),
  box = document.querySelector(".box"),
  btnDragon = document.querySelector(".btn-dragon");

start.addEventListener("click", () => handleStart());
checkWord.addEventListener("click", () =>
  input.value ? handleCheck() : alert("không được spam kiểm tra đáp án")
);
btnDragon.addEventListener("click", () => handleDragon());
let index = 0;
// start
function handleStart() {
  setTime();
  appWord();
  start.classList.add("none");
  checkWord.classList.remove("none");
}
function handleDragon() {
  box.classList.add("none");
  form.classList.remove("none");
}
function handleCheck() {
  let inputValue = input.value.trim().toLowerCase().replace(/\s/g, "");
  let wordValue = words[index - 1].word
    .trim()
    .toLocaleLowerCase()
    .replace(/\s/g, "");
  if (wordValue === inputValue) {
    console.log("đúng");
    wordText.innerText = words[index - 1].word.trim().toUpperCase();
    questionText.innerText = words[index - 1].question;
    resultWord.innerText = "Chính xác !!";

    setTimeout(() => {
      appWord();
      wordText.innerText = "";
      questionText.innerText = words[index - 1].question;
      resultWord.innerText = "";
      input.value = "";
    }, 3000);
  } else {
    resultWord.innerText = "Sai rồi !!";
  }
}
function appWord() {
  hint.innerText = `Câu hỏi ${index + 1}:`;
  if (index < words.length) {
    questionText.innerText = words[index].question;
    wordText.innerText = "";
    resultWord.innerText = "";
  } else if (index === words.length) {
    container.classList.add("none");
    box.classList.remove("none");
  }
  index++;
}
function setTime() {
  let maxTime = 180;
  let time = setInterval(() => {
    if (maxTime > 0) {
      maxTime--;
      timeText.innerText = maxTime + "s";
    } else {
      resultWord.innerText = "Hết thời gian rồi ! Làm lại nhé";
      clearInterval(time);
    }
  }, 1000);

  return time;
}
("use strict");

let canvas, width, height, ctx;
let fireworks = [];
let particles = [];

function setup() {
  canvas = document.getElementById("canvas");
  setSize(canvas);
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);
  fireworks.push(new Firework(Math.random() * (width - 100) + 100));
  window.addEventListener("resize", windowResized);
  document.addEventListener("click", onClick);
}

setTimeout(setup, 1);

function loop() {
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1;

  for (let i = 0; i < fireworks.length; i++) {
    let done = fireworks[i].update();
    fireworks[i].draw();
    if (done) fireworks.splice(i, 1);
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].lifetime > 80) particles.splice(i, 1);
  }

  if (Math.random() < 1 / 60)
    fireworks.push(new Firework(Math.random() * (width - 200) + 100));
}
setInterval(loop, 1 / 60);
//setInterval(loop, 100/60);
class Particle {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.vel = randomVec(2);
    this.lifetime = 0;
  }

  update() {
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.vel.y += 0.02;
    this.vel.x *= 0.99;
    this.vel.y *= 0.99;
    this.lifetime++;
  }

  draw() {
    ctx.globalAlpha = Math.max(1 - this.lifetime / 80, 0);
    ctx.fillStyle = this.col;
    ctx.fillRect(this.x, this.y, 2, 2);
  }
}

class Firework {
  constructor(x) {
    this.x = x;
    this.y = height;
    this.isBlown = false;
    this.col = randomCol();
  }

  update() {
    this.y -= 3;
    if (this.y < 350 - Math.sqrt(Math.random() * 500) * 40) {
      this.isBlown = true;
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle(this.x, this.y, this.col));
      }
    }
    return this.isBlown;
  }

  draw() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.col;
    ctx.fillRect(this.x, this.y, 2, 2);
  }
}

function randomCol() {
  var letter = "0123456789ABCDEF";
  var nums = [];

  for (var i = 0; i < 3; i++) {
    nums[i] = Math.floor(Math.random() * 256);
  }

  let brightest = 0;
  for (var i = 0; i < 3; i++) {
    if (brightest < nums[i]) brightest = nums[i];
  }

  brightest /= 255;
  for (var i = 0; i < 3; i++) {
    nums[i] /= brightest;
  }

  let color = "#";
  for (var i = 0; i < 3; i++) {
    color += letter[Math.floor(nums[i] / 16)];
    color += letter[Math.floor(nums[i] % 16)];
  }
  return color;
}

function randomVec(max) {
  let dir = Math.random() * Math.PI * 2;
  let spd = Math.random() * max;
  return { x: Math.cos(dir) * spd, y: Math.sin(dir) * spd };
}

function setSize(canv) {
  canv.style.width = innerWidth + "px";
  canv.style.height = innerHeight + "px";
  width = innerWidth;
  height = innerHeight;

  canv.width = innerWidth * window.devicePixelRatio;
  canv.height = innerHeight * window.devicePixelRatio;
  canvas
    .getContext("2d")
    .scale(window.devicePixelRatio, window.devicePixelRatio);
}

function onClick(e) {
  fireworks.push(new Firework(e.clientX));
}

function windowResized() {
  setSize(canvas);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);
}
