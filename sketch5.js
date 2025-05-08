new p5(p => {
    let bgImg5;
    let frames = [];
    let frameNames = [
      "frame1paint.png", "frame2paint.png", "frame3paint.png",
      "frame4paint.png", "frame5paint.png", "frame6paint.png"
    ];
    let framePositions = [];
  
    let sentence = "and the portrait show seems to have no faces in it at all, just paint";
    let words = [];
    let displayWords = [];
    let wordTimer = 0;
    let wordDelay = 400;
    let currentWordIndex = 0;
  
    let paintBox = null;
  
    let framesVisible = false;
    let frameRevealIndex = 0;
    let frameRevealTimer = 0;
    let frameRevealDelay = 300;
  
    let pulseFrameIndex = 5; // frame6paint.png (index 5)
  
    p.preload = () => {
      bgImg5 = p.loadImage("blankpage2.jpg");
      frameNames.forEach(name => {
        frames.push(p.loadImage(name));
      });
    };
  
    p.setup = () => {
      let cnv = p.createCanvas(p.windowWidth, p.windowHeight);
      cnv.parent(document.body);
      p.textSize(28);
      p.textAlign(p.LEFT, p.CENTER);
      words = sentence.split(" ");
      wordTimer = p.millis();
      frameRevealTimer = p.millis();
  
      framePositions = [
        { x: p.width / 4 - 60, y: p.height / 2 + 80 },
        { x: p.width / 2 - 60, y: p.height / 2 + 80 },
        { x: (3 * p.width) / 4 - 60, y: p.height / 2 + 80 },
        { x: p.width / 4 - 60, y: p.height / 2 + 220 },
        { x: p.width / 2 - 60, y: p.height / 2 + 220 },
        { x: (3 * p.width) / 4 - 60, y: p.height / 2 + 220 }
      ];
    };
  
    p.draw = () => {
      p.imageMode(p.CORNER);
      p.image(bgImg5, 0, 0, p.width, p.height);
  
      let x = 50;
      let y = p.height / 2 - 100;
      let lineHeight = 40;
      paintBox = null;
  
      for (let i = 0; i < displayWords.length; i++) {
        let word = displayWords[i];
        let isPaint = word === "paint";
        let wordWidth = p.textWidth(word + " ");
  
        if (x + wordWidth > p.width - 50) {
          x = 50;
          y += lineHeight;
        }
  
        if (isPaint) {
          let pulse = 1 + p.sin(p.frameCount * 0.1) * 0.1;
          p.textSize(28 * pulse);
          p.fill(255, 100, 100);
          paintBox = { x: x, y: y, w: p.textWidth(word), h: 32 };
        } else {
          p.textSize(28);
          p.fill(0);
        }
  
        p.text(word, x, y);
        x += p.textWidth(word + " ");
      }
  
      // Typewriter word appearance
      if (currentWordIndex < words.length && p.millis() - wordTimer > wordDelay) {
        displayWords.push(words[currentWordIndex]);
        currentWordIndex++;
        wordTimer = p.millis();
      }
  
      // Frame-by-frame reveal
      if (framesVisible && frameRevealIndex < frames.length && p.millis() - frameRevealTimer > frameRevealDelay) {
        frameRevealIndex++;
        frameRevealTimer = p.millis();
      }
  
      // Draw revealed frames
      for (let i = 0; i < frameRevealIndex; i++) {
        let pos = framePositions[i];
        p.imageMode(p.CENTER);
  
        // Animate frame6 with a bounce
        if (i === pulseFrameIndex && i === frameRevealIndex - 1) {
          let bounce = 1 + 0.05 * p.sin(p.frameCount * 0.2);
          p.push();
          p.translate(pos.x, pos.y);
          p.scale(bounce);
          p.image(frames[i], 0, 0, 120, 120);
          p.pop();
        } else {
          p.image(frames[i], pos.x, pos.y, 120, 120);
        }
      }
    };
  
    p.mousePressed = () => {
      if (paintBox) {
        if (
          p.mouseX >= paintBox.x &&
          p.mouseX <= paintBox.x + paintBox.w &&
          p.mouseY >= paintBox.y - paintBox.h / 2 &&
          p.mouseY <= paintBox.y + paintBox.h / 2
        ) {
          framesVisible = true;
          frameRevealIndex = 0;
          frameRevealTimer = p.millis();
          return;
        }
      }
  
      // If animated frame is visible and clicked
      if (framesVisible && frameRevealIndex >= frames.length) {
        let pos = framePositions[pulseFrameIndex];
        let d = p.dist(p.mouseX, p.mouseY, pos.x, pos.y);
        if (d < 70) {
          console.log("🖼️ Clicked final frame — transitioning to sketch6.js...");
          transitionToSketch6();
        }
      }
    };
  
    function transitionToSketch6() {
      if (typeof p.remove === 'function') p.remove();
      document.querySelectorAll("canvas").forEach(c => c.remove());
  
      const oldScript = document.querySelector("script[src='sketch5.js']");
      if (oldScript) oldScript.remove();
  
      const newScript = document.createElement("script");
      newScript.src = "sketch6.js";
      newScript.onload = () => console.log("✅ sketch6.js loaded");
      newScript.onerror = () => console.error("❌ sketch6.js failed to load");
      document.body.appendChild(newScript);
    }
  
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  });
  