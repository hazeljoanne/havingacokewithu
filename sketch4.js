new p5(p => {
  let bgImg, orangeTulip, tulipImgs = [];
  let blooming = false;
  let clickCount = 0;

  let sentence = "partly because of the fluorescent orange tulips around the birches";
  let words = [], wordPositions = [];
  let fallSpeeds = [];

  let colorfulWords = ["fluorescent", "orange", "tulips"];
  let tulipColors = [
    [255, 102, 178], [255, 165, 0], [255, 0, 255], [255, 255, 0]
  ];
  let currentColor = 0;

  let showOrangeTulip = false;
  let orangeX, orangeY, orangeW = 200, orangeH = 340;

  let tulipPositions = [], tulipScales = [], tulipNames = [
    "tulippink.png", "tulipgreen.png", "tulipblue.png"
  ];

  p.preload = () => {
    bgImg = p.loadImage("blankpage2.jpg");
    orangeTulip = p.loadImage("tulipindi.png"); // ✅ your tulip PNG
    tulipNames.forEach(name => tulipImgs.push(p.loadImage(name)));
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textFont("Times New Roman");
    p.textSize(32);
    p.textAlign(p.LEFT, p.CENTER);
    words = sentence.split(" ");
    calculateWordPositions();
  };

  p.draw = () => {
    p.image(bgImg, 0, 0, p.width, p.height);
    drawWords();

    if (showOrangeTulip) {
      p.imageMode(p.CENTER);
      p.image(orangeTulip, orangeX, orangeY, orangeW, orangeH);
    }

    if (blooming) {
      for (let i = 0; i < tulipImgs.length; i++) {
        for (let j = 0; j < tulipPositions[i].length; j++) {
          let scale = tulipScales[i][j];
          if (scale < 1) tulipScales[i][j] += 0.03;

          let pos = tulipPositions[i][j];
          p.push();
          p.translate(pos.x, pos.y);
          p.scale(scale);
          p.imageMode(p.CENTER);
          p.image(tulipImgs[i], 0, 0, 100, 160);
          p.pop();
        }
      }
    }

    if (p.frameCount % 20 === 0) {
      currentColor = (currentColor + 1) % tulipColors.length;
    }
  };

  function drawWords() {
    let x = 60, y = p.height / 2; // ✅ Centered vertically
    wordPositions = [];
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      let w = p.textWidth(word + " ");

      if (fallSpeeds.length === words.length) {
        y += fallSpeeds[i];
        fallSpeeds[i] += 1.5;
      }

      if (colorfulWords.includes(word)) {
        let c = tulipColors[currentColor];
        p.fill(c[0], c[1], c[2]);
      } else {
        p.fill(0);
      }

      p.text(word, x, y);
      wordPositions.push({ word, x, y, w });
      x += w;
    }
  }

  p.mousePressed = () => {
    if (!showOrangeTulip) {
      for (let pos of wordPositions) {
        if (
          colorfulWords.includes(pos.word) &&
          p.mouseX >= pos.x && p.mouseX <= pos.x + pos.w &&
          p.mouseY >= pos.y - 20 && p.mouseY <= pos.y + 20
        ) {
          showOrangeTulip = true;
          orangeX = p.width / 2;
          orangeY = p.height / 2;
          fallSpeeds = Array(words.length).fill(0);
          return;
        }
      }
    } else {
      let d = p.dist(p.mouseX, p.mouseY, orangeX, orangeY);
      if (d < orangeW / 2) {
        clickCount++;
        bloomTulips();
        if (clickCount >= 5) {
          transitionToSketch5();
        }
      }
    }
  };

  function bloomTulips() {
    blooming = true;
    for (let i = 0; i < tulipImgs.length; i++) {
      if (!tulipPositions[i]) tulipPositions[i] = [];
      if (!tulipScales[i]) tulipScales[i] = [];
      for (let j = 0; j < 5; j++) {
        tulipPositions[i].push(p.createVector(p.random(p.width), p.random(p.height)));
        tulipScales[i].push(0);
      }
    }
  }

  function calculateWordPositions() {
    let x = 60, y = p.height / 2; // ✅ Match vertical center
    wordPositions = [];
    for (let word of words) {
      let w = p.textWidth(word + " ");
      wordPositions.push({ word, x, y, w });
      x += w;
    }
  }

  function transitionToSketch5() {
    if (typeof p.remove === 'function') p.remove();
    document.querySelectorAll("canvas").forEach(c => c.remove());

    const oldScript = document.querySelector("script[src='sketch4.js']");
    if (oldScript) oldScript.remove();

    const newScript = document.createElement("script");
    newScript.src = "sketch5.js";
    newScript.onload = () => console.log("✅ sketch5.js loaded");
    newScript.onerror = () => console.error("❌ sketch5.js failed to load");
    document.body.appendChild(newScript);
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    calculateWordPositions();
  };
});
