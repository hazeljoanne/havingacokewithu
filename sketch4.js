new p5(p => {
    let bgImg4;
    let tulipImgs = [];
    let tulipNames = ["tulipindi.png", "tulippink.png", "tulipgreen.png", "tulipblue.png"];
    let tulipPositions = [];
    let tulipScales = [];
  
    let showTulip = false;
    let tulipAlpha = 0;
    let fadeDirection = 1;
    let tulipX, tulipY;
    let tulipW = 100;
    let tulipH = 170;
  
    let sentence = "partly because of the fluorescent orange tulips around the birches";
    let words = [];
    let wordPositions = [];
  
    let waveAmplitude = 10;
    let waveFrequency = 0.05;
  
    let tulipColors = [];
    let currentColorIndex = 0;
    let colorChangeInterval = 30;
    let frameCounter = 0;
  
    p.preload = () => {
      bgImg4 = p.loadImage('blankpage2.jpg');
  
      tulipNames.forEach(name => {
        tulipImgs.push(p.loadImage(name));
        tulipPositions.push([]);
        tulipScales.push([]);
      });
  
      words = sentence.split(" ");
      tulipColors = [
        p.color(255, 20, 147), p.color(255, 255, 0), p.color(0, 255, 0),
        p.color(0, 255, 255), p.color(255, 0, 255), p.color(255, 165, 0)
      ];
    };
  
    p.setup = () => {
      let cnv = p.createCanvas(p.windowWidth, p.windowHeight);
      cnv.parent(document.body);
      p.textSize(32);
      p.textAlign(p.LEFT, p.CENTER);
      calculateWordPositions();
  
      // Show tulip after 2 seconds
      setTimeout(() => {
        showTulip = true;
        tulipX = p.width / 2;
        tulipY = 180;
      }, 2000);
    };
  
    p.draw = () => {
      p.image(bgImg4, 0, 0, p.width, p.height);
      drawWavyText();
  
      if (showTulip) {
        tulipAlpha += fadeDirection * 2;
        if (tulipAlpha >= 255 || tulipAlpha <= 0) {
          fadeDirection *= -1;
          tulipAlpha = p.constrain(tulipAlpha, 0, 255);
        }
  
        p.push();
        p.tint(255, tulipAlpha);
        p.imageMode(p.CENTER);
        p.image(tulipImgs[0], tulipX, tulipY, tulipW, tulipH);
        p.pop();
      }
  
      for (let i = 0; i < tulipImgs.length; i++) {
        for (let j = 0; j < tulipPositions[i].length; j++) {
          let pos = tulipPositions[i][j];
          tulipScales[i][j] = Math.min(tulipScales[i][j] + 0.05, 1);
          p.push();
          p.translate(pos.x, pos.y);
          p.scale(tulipScales[i][j]);
          p.imageMode(p.CENTER);
          p.image(tulipImgs[i], 0, 0, tulipW, tulipH);
          p.pop();
        }
      }
  
      frameCounter++;
      if (frameCounter % colorChangeInterval === 0) {
        currentColorIndex = (currentColorIndex + 1) % tulipColors.length;
      }
    };
  
    function drawWavyText() {
      let x = 50;
      let y = 100;
      wordPositions = [];
  
      for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let wordWidth = p.textWidth(word + " ");
        let yOffset = p.sin((p.frameCount + i * 10) * waveFrequency) * waveAmplitude;
  
        if (["fluorescent", "orange", "tulips"].includes(word)) {
          p.fill(tulipColors[currentColorIndex]);
        } else {
          p.fill(0);
        }
  
        p.text(word, x, y + yOffset);
        wordPositions.push({ word, x, y: y + yOffset, w: wordWidth });
        x += wordWidth;
      }
    }
  
    p.mousePressed = () => {
      // 1️⃣ Click on tulip: trigger bloom
      if (showTulip) {
        let d = p.dist(p.mouseX, p.mouseY, tulipX, tulipY);
        if (d < tulipW / 2) {
          for (let i = 0; i < tulipImgs.length; i++) {
            for (let j = 0; j < 5; j++) {
              tulipPositions[i].push(p.createVector(p.random(p.width), p.random(p.height)));
              tulipScales[i].push(0);
            }
          }
          return;
        }
      }
  
      // 2️⃣ Click on special words → go to sketch5.js
      for (let pos of wordPositions) {
        if (
          ["fluorescent", "orange", "tulips"].includes(pos.word) &&
          p.mouseX >= pos.x && p.mouseX <= pos.x + pos.w &&
          p.mouseY >= pos.y - 16 && p.mouseY <= pos.y + 16
        ) {
          console.log("🌷 Word clicked — loading sketch5.js...");
          transitionToSketch5();
          return;
        }
      }
    };
  
    function calculateWordPositions() {
      let x = 50;
      let y = 100;
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
  