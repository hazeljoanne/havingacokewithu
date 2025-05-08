new p5(p => {
  let bgImg3;
  let sentenceStart = "partly because of my";
  let sentenceEnd = "for you";

  let loveImg;
  let loveScale = 1;
  let loveDirection = 1;
  let loveActive = false;

  let loveX, loveY, loveW = 110, loveH = 110; // ✅ Bigger size

  let heartData = [];
  let stamps = [];

  p.preload = () => {
    bgImg3 = p.loadImage('blankpage2.jpg');
    loveImg = p.loadImage('love4u.png');

    const heartFiles = [
      { name: 'heart1.png', w: 40, h: 40 },
      { name: 'heart2.png', w: 50, h: 50 },
      { name: 'heart3.png', w: 35, h: 35 },
      { name: 'heart4.png', w: 45, h: 45 },
      { name: 'heart5.png', w: 60, h: 60 },
      { name: 'heart6.png', w: 55, h: 55 },
      { name: 'heart7.png', w: 40, h: 40 },
      { name: 'heart9.png', w: 50, h: 50 },
      { name: 'heart10.png', w: 65, h: 65 },
      { name: 'heart11.png', w: 70, h: 70 }
    ];

    heartFiles.forEach(data => {
      const img = p.loadImage(data.name);
      heartData.push({ img, w: data.w, h: data.h });
    });
  };

  p.setup = () => {
    let cnv = p.createCanvas(p.windowWidth, p.windowHeight);
    cnv.parent(document.body);
    p.textFont("Times New Roman"); // ✅ Font set
    p.textSize(32);
    p.textAlign(p.LEFT, p.CENTER);
    loveY = p.height / 2 - 80;
    p.imageMode(p.CENTER);

    setTimeout(() => {
      loveActive = true;
    }, 2000);
  };

  p.draw = () => {
    p.imageMode(p.CORNER);
    if (bgImg3) {
      p.image(bgImg3, 0, 0, p.width, p.height); // ✅ Fullscreen background
    } else {
      p.background(255);
    }
    p.imageMode(p.CENTER);

    // Sentence layout
    p.fill(0);
    let padding = 20;
    let startX = p.width / 2 - 190;
    p.text(sentenceStart, startX, loveY);
    let endX = startX + p.textWidth(sentenceStart) + loveW + padding;
    p.text(sentenceEnd, endX, loveY);

    // Pulsating heart
    p.push();
    loveX = startX + p.textWidth(sentenceStart) + padding / 2 + loveW / 2;
    p.translate(loveX, loveY);
    if (loveActive) {
      loveScale += 0.01 * loveDirection;
      if (loveScale > 1.1 || loveScale < 0.9) loveDirection *= -1;
    }
    p.scale(loveScale);
    p.image(loveImg, 0, 0, loveW, loveH);
    p.pop();

    // Draw stamped hearts
    for (let s of stamps) {
      p.image(s.img, s.x, s.y, s.w, s.h);
    }
  };

  p.mousePressed = () => {
    if (
      p.mouseX >= loveX - loveW / 2 &&
      p.mouseX <= loveX + loveW / 2 &&
      p.mouseY >= loveY - loveH / 2 &&
      p.mouseY <= loveY + loveH / 2
    ) {
      console.log("💘 Love clicked — loading sketch4.js...");
      transitionToSketch4();
      return;
    }

    const heart = p.random(heartData);
    stamps.push({
      img: heart.img,
      x: p.mouseX,
      y: p.mouseY,
      w: heart.w,
      h: heart.h
    });
  };

  function transitionToSketch4() {
    if (typeof p.remove === 'function') p.remove();
    document.querySelectorAll("canvas").forEach(c => c.remove());

    const oldScript = document.querySelector("script[src='sketch3.js']");
    if (oldScript) oldScript.remove();

    const newScript = document.createElement("script");
    newScript.src = "sketch4.js";
    newScript.onload = () => console.log("✅ sketch4.js loaded");
    newScript.onerror = () => console.error("❌ sketch4.js failed to load");
    document.body.appendChild(newScript);
  }
});
