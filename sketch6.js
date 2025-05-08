new p5(p => {
  let bgImg6;
  let frames = [];
  let altFrames = [];
  let frameMap = [
    { from: "frame1paint.png", to: "frame2.png" },
    { from: "frame2paint.png", to: "frame3.png" },
    { from: "frame3paint.png", to: "frame6.png" },
    { from: "frame4paint.png", to: "frame8.png" },
    { from: "frame5paint.png", to: "frame1.png" },
    { from: "frame6paint.png", to: "frame6p.png" }
  ];
  let frameObjects = [];

  let sentence = "you suddenly wonder why in the world anyone ever did them";
  let words = [];
  let displayWords = [];
  let wordTimer = 0;
  let wordDelay = 300;
  let currentWordIndex = 0;

  let fadeTimes = [];

  p.preload = () => {
    bgImg6 = p.loadImage("blankpage2.jpg");
    frameMap.forEach(m => {
      frames.push(p.loadImage(m.from));
      altFrames.push(p.loadImage(m.to));
    });
  };

  p.setup = () => {
    let cnv = p.createCanvas(p.windowWidth, p.windowHeight);
    cnv.parent(document.body);
    p.textFont("Times New Roman");
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    words = sentence.split(" ");
    wordTimer = p.millis();

    const positions = [
      { x: p.width / 4, y: p.height / 2 - 60 },
      { x: p.width / 2, y: p.height / 2 - 60 },
      { x: (3 * p.width) / 4, y: p.height / 2 - 60 },
      { x: p.width / 4, y: p.height / 2 + 80 },
      { x: p.width / 2, y: p.height / 2 + 80 },
      { x: (3 * p.width) / 4, y: p.height / 2 + 80 }
    ];

    for (let i = 0; i < frames.length; i++) {
      frameObjects.push({
        img: frames[i],
        alt: altFrames[i],
        x: positions[i].x,
        y: positions[i].y,
        w: 120,
        h: 120,
        bouncing: true,
        bounceSpeed: p.random(0.01, 0.03),
        revealed: false
      });
    }
  };

  p.draw = () => {
    p.imageMode(p.CORNER);
    p.image(bgImg6, 0, 0, p.width, p.height);

    drawFadingWrappedText(displayWords, p.width / 2, p.height / 2 - 200, p.width - 100, 42);

    if (currentWordIndex < words.length && p.millis() - wordTimer > wordDelay) {
      displayWords.push(words[currentWordIndex]);
      fadeTimes.push(p.millis());
      currentWordIndex++;
      wordTimer = p.millis();
    }

    for (let f of frameObjects) {
      p.push();
      p.imageMode(p.CENTER);
      let bounce = f.bouncing ? p.sin(p.frameCount * f.bounceSpeed) * 10 : 0;
      p.image(f.img, f.x, f.y + bounce, f.w, f.h);
      p.pop();
    }
  };

  function drawFadingWrappedText(wordArray, centerX, startY, maxWidth, lineHeight) {
    p.textAlign(p.CENTER, p.CENTER);
    p.textFont("Times New Roman");
    p.textSize(32);

    let line = "";
    let lines = [];
    let fadeLineGroups = [];

    for (let i = 0; i < wordArray.length; i++) {
      const word = wordArray[i];
      const testLine = line + word + " ";
      if (p.textWidth(testLine) > maxWidth && line !== "") {
        lines.push(line.trim());
        fadeLineGroups.push([]);
        line = word + " ";
      } else {
        line += word + " ";
      }
    }
    lines.push(line.trim());

    let index = 0;
    for (let i = 0; i < lines.length; i++) {
      const wordsInLine = lines[i].split(" ");
      let lineWidth = p.textWidth(lines[i]);
      let startX = centerX - lineWidth / 2;
      let wordX = startX;
      let lineY = startY + i * lineHeight;

      for (let j = 0; j < wordsInLine.length; j++) {
        if (index >= fadeTimes.length) continue;
        const word = wordsInLine[j];
        let alpha = p.map(p.millis() - fadeTimes[index], 0, 500, 0, 255);
        alpha = p.constrain(alpha, 0, 255);
        p.fill(0, alpha);
        p.text(word, wordX + p.textWidth(word) / 2, lineY);
        wordX += p.textWidth(word + " ");
        index++;
      }
    }
  }

  p.mousePressed = () => {
    for (let i = 0; i < frameObjects.length; i++) {
      let f = frameObjects[i];
      if (
        p.mouseX >= f.x - f.w / 2 &&
        p.mouseX <= f.x + f.w / 2 &&
        p.mouseY >= f.y - f.h / 2 &&
        p.mouseY <= f.y + f.h / 2
      ) {
        if (!f.revealed) {
          f.img = f.alt;
          f.bouncing = false;
          f.revealed = true;

          if (i === 5) {
            console.log("🖼️ Final frame revealed — transitioning to sketch7.js...");
            setTimeout(transitionToSketch7, 500);
          }
        }
      }
    }
  };

  function transitionToSketch7() {
    if (typeof p.remove === 'function') p.remove();
    document.querySelectorAll("canvas").forEach(c => c.remove());

    const oldScript = document.querySelector("script[src='sketch6.js']");
    if (oldScript) oldScript.remove();

    const newScript = document.createElement("script");
    newScript.src = "sketch7.js";
    newScript.onload = () => console.log("✅ sketch7.js loaded");
    newScript.onerror = () => console.error("❌ sketch7.js failed to load");
    document.body.appendChild(newScript);
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
