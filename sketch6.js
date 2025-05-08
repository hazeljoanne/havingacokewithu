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
  
      // Typing animated text
      drawCenteredWrappedText(displayWords, p.width / 2, p.height / 2 - 200, p.width - 100, 42);
  
      if (currentWordIndex < words.length && p.millis() - wordTimer > wordDelay) {
        displayWords.push(words[currentWordIndex]);
        currentWordIndex++;
        wordTimer = p.millis();
      }
  
      // Draw bouncing frames
      for (let f of frameObjects) {
        p.push();
        p.imageMode(p.CENTER);
        let bounce = f.bouncing ? p.sin(p.frameCount * f.bounceSpeed) * 10 : 0;
        p.image(f.img, f.x, f.y + bounce, f.w, f.h);
        p.pop();
      }
    };
  
    function drawCenteredWrappedText(wordArray, centerX, startY, maxWidth, lineHeight) {
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(32);
      p.fill(0);
  
      let line = "";
      let lines = [];
  
      for (let word of wordArray) {
        let testLine = line + word + " ";
        if (p.textWidth(testLine) > maxWidth && line !== "") {
          lines.push(line);
          line = word + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line);
  
      for (let i = 0; i < lines.length; i++) {
        p.text(lines[i], centerX, startY + i * lineHeight);
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
  
  