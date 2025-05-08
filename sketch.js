let cokeImg, bgImg1, decor1, decor2;
let coke1Pos, coke2Pos;
let showSecondBottle = false;
let clinkAnimation = false;
let clinkProgress = 0;
let pulsateScale = 1;
let pulsateDirection = 1;
let fontSize = 32;
let bottlesShifted = false;

let bounceCap = false;
let bounceY = 0;
let bounceSpeed = 2;
let bounceDirection = 1;
let decor1X = 100;
let decor1Y = 400;

let words = ["having", "a", "coke", "with", "you"];
let wordPositions = [];
let youX, youY, youW, youH;

function preload() {
  cokeImg = loadImage('cokebottle.png');
  bgImg1 = loadImage('blankpage2.jpg');
  decor1 = loadImage('cokecap2.png');
  decor2 = loadImage('cokecap2.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Times New Roman");
  textSize(fontSize);
  textAlign(CENTER, CENTER);
  coke1Pos = createVector(width / 2 - 50, height / 2 + 50);
  coke2Pos = createVector(width / 2 + 50, height / 2 + 50);

  let spacing = 10;
  let totalWidth = 0;
  let wordWidths = [];

  for (let w of words) {
    wordWidths.push(textWidth(w));
    totalWidth += textWidth(w) + spacing;
  }
  totalWidth -= spacing;
  let startX = width / 2 - totalWidth / 2;
  let x = startX;

  for (let i = 0; i < words.length; i++) {
    wordPositions.push({
      word: words[i],
      x: x + wordWidths[i] / 2,
      y: -random(50, 300),
      targetY: height / 2 - 100,
      width: wordWidths[i],
      falling: true,
      speed: random(3, 5)
    });
    x += wordWidths[i] + spacing;
  }
}

function draw() {
  image(bgImg1, 0, 0, width, height);

  if (bounceCap) {
    bounceY += bounceSpeed * bounceDirection;
    if (bounceY > 15 || bounceY < -15) bounceDirection *= -1;
  }

  image(decor1, decor1X, decor1Y + bounceY, 150, 150);
  image(decor2, width - 200, 100, 150, 150);

  for (let wp of wordPositions) {
    if (wp.falling) {
      wp.y += wp.speed;
      if (wp.y >= wp.targetY) {
        wp.y = wp.targetY;
        wp.falling = false;
      }
    }

    if (wp.word === "you") {
      youX = wp.x - wp.width / 2;
      youY = wp.y - fontSize / 2;
      youW = wp.width;
      youH = fontSize;

      if (
        mouseX >= youX &&
        mouseX <= youX + youW &&
        mouseY >= youY &&
        mouseY <= youY + youH
      ) {
        fill(139, 0, 0); // dark red
      } else {
        fill(0);
      }
    } else {
      fill(0);
    }

    text(wp.word, wp.x, wp.y);
  }

  // ⬅️ Reposition bottles to center when second bottle is shown
  if (showSecondBottle && !bottlesShifted) {
    coke1Pos.x = width / 2 - 90;
    coke2Pos.x = width / 2 + 10;
    bottlesShifted = true;
  }

  image(cokeImg, coke1Pos.x, coke1Pos.y, 150, 150);

  if (showSecondBottle) {
    push();
    translate(coke2Pos.x + 75, coke2Pos.y + 75);
    if (!clinkAnimation) {
      pulsateScale += 0.01 * pulsateDirection;
      if (pulsateScale > 1.1 || pulsateScale < 0.9) {
        pulsateDirection *= -1;
      }
    }
    scale(pulsateScale);
    imageMode(CENTER);
    image(cokeImg, 0, 0, 150, 150);
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
    let bw = 150;
    let bh = 150;
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
    let cw = 150;
    let ch = 150;

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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
