let cokeImg, bgImg1, decor1, decor2;
let coke1Pos, coke2Pos;
let showSecondBottle = false;
let clinkAnimation = false;
let clinkProgress = 0;
let pulsateScale = 1;
let pulsateDirection = 1;
let youX, youY, youW, youH;
let fontSize = 32;

let bounceCap = false;
let bounceY = 0;
let bounceSpeed = 2;
let bounceDirection = 1;
let decor1X = 100;
let decor1Y = 400;

function preload() {
  cokeImg = loadImage('cokebottle.png');
  bgImg1 = loadImage('blankpage2.jpg');
  decor1 = loadImage('cokecap2.png');
  decor2 = loadImage('cokecap2.png');
}

function setup() {
  createCanvas(800, 600);
  textSize(fontSize);
  textAlign(CENTER, CENTER);
  coke1Pos = createVector(width / 2 - 50, height / 2 + 50);
  coke2Pos = createVector(width / 2 + 50, height / 2 + 50);
}

function draw() {
  background(bgImg1);

  if (bounceCap) {
    bounceY += bounceSpeed * bounceDirection;
    if (bounceY > 15 || bounceY < -15) bounceDirection *= -1;
  }

  image(decor1, decor1X, decor1Y + bounceY, 100, 100);
  image(decor2, width - 150, 100, 100, 100);

  fill(0);
  let sentence = "having a coke with you";
  let words = sentence.split(" ");
  let spacing = 10;
  let totalWidth = 0;
  let wordWidths = [];

  for (let word of words) {
    let w = textWidth(word);
    wordWidths.push(w);
    totalWidth += w + spacing;
  }
  totalWidth -= spacing;
  let startX = width / 2 - totalWidth / 2;
  let x = startX;
  let y = height / 2 - 100;

  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let w = wordWidths[i];
    let h = fontSize;

    if (word === "you") {
      youX = x;
      youY = y - h / 2;
      youW = w;
      youH = h;
      if (
        mouseX >= youX &&
        mouseX <= youX + youW &&
        mouseY >= youY &&
        mouseY <= youY + youH
      ) {
        fill(139, 0, 0);
      } else {
        fill(0);
      }
    } else {
      fill(0);
    }

    text(word, x + w / 2, y);
    x += w + spacing;
  }

  image(cokeImg, coke1Pos.x, coke1Pos.y, 100, 100);

  if (showSecondBottle) {
    push();
    translate(coke2Pos.x + 25, coke2Pos.y + 50);
    if (!clinkAnimation) {
      pulsateScale += 0.01 * pulsateDirection;
      if (pulsateScale > 1.1 || pulsateScale < 0.9) {
        pulsateDirection *= -1;
      }
    }
    scale(pulsateScale);
    imageMode(CENTER);
    image(cokeImg, 0, 0, 100, 100);
    pop();
  }

  if (clinkAnimation) {
    clinkProgress += 0.02;
    if (clinkProgress <= 0.5) {
      coke1Pos.x += 1;
      coke2Pos.x -= 1;
    } else if (clinkProgress <= 1) {
      coke1Pos.x -= 1;
      coke2Pos.x += 1;
    } else {
      clinkAnimation = false;
      clinkProgress = 0;
      bounceCap = true;
    }
  }
}

function mousePressed() {
  if (
    mouseX >= youX &&
    mouseX <= youX + youW &&
    mouseY >= youY &&
    mouseY <= youY + youH
  ) {
    showSecondBottle = true;
  }

  if (showSecondBottle) {
    let bx = coke2Pos.x;
    let by = coke2Pos.y;
    let bw = 100;
    let bh = 100;
    if (
      mouseX >= bx &&
      mouseX <= bx + bw &&
      mouseY >= by &&
      mouseY <= by + bh
    ) {
      clinkAnimation = true;
    }
  }

  if (bounceCap) {
    let cx = decor1X;
    let cy = decor1Y + bounceY;
    let cw = 100;
    let ch = 100;

    if (
      mouseX >= cx &&
      mouseX <= cx + cw &&
      mouseY >= cy &&
      mouseY <= cy + ch
    ) {
      goToSketch2();
    }
  }
}

function goToSketch2() {
  console.log("🎯 Switching to sketch2.js...");

  if (typeof remove === 'function') remove();
  document.querySelectorAll("canvas").forEach(c => c.remove());

  const oldScript = document.querySelector("script[src='sketch.js']");
  if (oldScript) oldScript.remove();

  const newScript = document.createElement("script");
  newScript.src = "sketch2.js";
  newScript.onload = () => console.log("✅ sketch2.js loaded");
  newScript.onerror = () => console.error("❌ sketch2.js failed to load");
  document.body.appendChild(newScript);
}
