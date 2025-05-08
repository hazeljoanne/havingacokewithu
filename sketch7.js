new p5(p => {
  let bgImg;
  let sentence = "I look at you and I would rather look at you than all the portraits in the world";
  let words = [];
  let displayWords = [];
  let wordIndex = 0;
  let wordTimer = 0;
  let wordDelay = 300;

  let redPinks = [
    [255, 102, 102],
    [255, 51, 102],
    [255, 0, 127],
    [255, 77, 166],
    [255, 153, 204]
  ];
  let currentColorIndex = 0;
  let colorInterval = 30;

  let portraits = [];
  let portraitPositions = [];
  let portraitSize = 120;

  let flyingYous = [];

  p.preload = () => {
    bgImg = p.loadImage("blankpage2.jpg");

    const initialFrames = [
      "frame1.png", "frame2.png", "frame3.png",
      "frame6.png", "frame8.png", "frame6p.png"
    ];
    const swapFrames = [
      "frame5pic.png", "frame2pic.png", "frame4pic.png",
      "frame3pic.png", "frame1pic.png", "frame6pic.png"
    ];

    for (let i = 0; i < initialFrames.length; i++) {
      portraits.push({
        current: p.loadImage(initialFrames[i]),
        next: p.loadImage(swapFrames[i]),
        alpha: 0,
        showNext: false
      });
    }
  };

  p.setup = () => {
    let cnv = p.createCanvas(p.windowWidth, p.windowHeight);
    cnv.parent(document.body);
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    p.textFont('Times New Roman');
    words = sentence.split(" ");
    wordTimer = p.millis();
    p.frameRate(60);
  };

  p.draw = () => {
    p.background(255);
    p.image(bgImg, 0, 0, p.width, p.height);

    if (wordIndex < words.length && p.millis() - wordTimer > wordDelay) {
      displayWords.push(words[wordIndex]);
      wordIndex++;
      wordTimer = p.millis();
    }

    if (p.frameCount % colorInterval === 0) {
      currentColorIndex = (currentColorIndex + 1) % redPinks.length;
    }

    const textBottomY = displayText();

    setupPortraitPositions(textBottomY + 40);

    for (let i = 0; i < portraits.length; i++) {
      let pos = portraitPositions[i];
      let port = portraits[i];

      p.image(port.current, pos.x - portraitSize / 2, pos.y - portraitSize / 2, portraitSize, portraitSize);

      if (port.showNext) {
        port.alpha += 8;
        port.alpha = p.constrain(port.alpha, 0, 255);
        p.tint(255, port.alpha);
        p.image(port.next, pos.x - portraitSize / 2, pos.y - portraitSize / 2, portraitSize, portraitSize);
        p.noTint();
      }
    }

    // Update and draw flying "you" words
    for (let i = flyingYous.length - 1; i >= 0; i--) {
      let fy = flyingYous[i];
      fy.x += fy.vx;
      fy.y += fy.vy;
      fy.alpha -= 2;
      if (fy.alpha <= 0) {
        flyingYous.splice(i, 1);
      } else {
        p.fill(0, fy.alpha);
        p.text("you", fy.x, fy.y);
      }
    }
  };

  function displayText() {
    let x = p.width / 2;
    let y = p.height / 2 - 200;
    let lineHeight = 40;
    let maxWidth = p.width - 100;
    let lines = [];
    let tempLine = "";
    let youCounter = 0;

    for (let i = 0; i < displayWords.length; i++) {
      let word = displayWords[i];
      let testLine = tempLine + word + " ";
      if (p.textWidth(testLine) > maxWidth) {
        lines.push(tempLine);
        tempLine = word + " ";
      } else {
        tempLine = testLine;
      }
    }
    lines.push(tempLine);

    for (let i = 0; i < lines.length; i++) {
      let lineY = y + i * lineHeight;
      let wordsInLine = lines[i].trim().split(" ");
      let lineWidth = p.textWidth(lines[i]);
      let startX = x - lineWidth / 2;
      let wordX = startX;
      youCounter = 0;

      for (let j = 0; j < wordsInLine.length; j++) {
        let word = wordsInLine[j];
        let w = p.textWidth(word + " ");

        if (word.toLowerCase() === "you") {
          youCounter++;
          if (youCounter === 2) {
            let c = redPinks[currentColorIndex];
            p.fill(c[0], c[1], c[2]);
          } else {
            p.fill(0);
          }
        } else {
          p.fill(0);
        }

        p.text(word, wordX + w / 2, lineY);
        wordX += w;
      }
    }

    return y + lines.length * lineHeight;
  }

  function setupPortraitPositions(startY) {
    if (portraitPositions.length === 6) return;
    let spacingX = p.width / 4;
    portraitPositions = [
      { x: spacingX, y: startY },
      { x: 2 * spacingX, y: startY },
      { x: 3 * spacingX, y: startY },
      { x: spacingX, y: startY + 160 },
      { x: 2 * spacingX, y: startY + 160 },
      { x: 3 * spacingX, y: startY + 160 }
    ];
  }

  p.mousePressed = () => {
    let x = p.width / 2;
    let y = p.height / 2 - 200;
    let lineHeight = 40;
    let maxWidth = p.width - 100;
    let lines = [];
    let tempLine = "";
    let youCounter = 0;

    for (let i = 0; i < displayWords.length; i++) {
      let word = displayWords[i];
      let testLine = tempLine + word + " ";
      if (p.textWidth(testLine) > maxWidth) {
        lines.push(tempLine);
        tempLine = word + " ";
      } else {
        tempLine = testLine;
      }
    }
    lines.push(tempLine);

    for (let i = 0; i < lines.length; i++) {
      let lineY = y + i * lineHeight;
      let wordsInLine = lines[i].trim().split(" ");
      let lineWidth = p.textWidth(lines[i]);
      let startX = x - lineWidth / 2;
      let wordX = startX;

      for (let j = 0; j < wordsInLine.length; j++) {
        let word = wordsInLine[j];
        let w = p.textWidth(word + " ");

        if (word.toLowerCase() === "you") {
          youCounter++;
          if (youCounter === 2) {
            if (
              p.mouseX >= wordX &&
              p.mouseX <= wordX + w &&
              p.mouseY >= lineY - 20 &&
              p.mouseY <= lineY + 20
            ) {
              for (let port of portraits) {
                port.showNext = true;
                port.alpha = 0;
              }
              return;
            }
          } else {
            // Add flying "you" word
            if (
              p.mouseX >= wordX &&
              p.mouseX <= wordX + w &&
              p.mouseY >= lineY - 20 &&
              p.mouseY <= lineY + 20
            ) {
              flyingYous.push({
                x: wordX + w / 2,
                y: lineY,
                vx: p.random(-2, 2),
                vy: p.random(-2, -5),
                alpha: 255
              });
            }
          }
        }

        wordX += w;
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    portraitPositions = [];
  };
});
