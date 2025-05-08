new p5(p => {
    let bgImg2;
    let sentence = "Is even more fun than going to";
    let currentText = "";
    let index = 0;
    let typeSpeed = 100;
    let lastTypedTime = 0;
  
    let images = [];
    let imageNames = [
      'oldpolaroid.png',
      'sansebaspolaroid.png',
      'irunpolaroid.png',
      'hendayepolaroid.png',
      'biarritzpolaroid.png',
      'bayonnepolaroid.png'
    ];
    let currentImgIndex = 0;
    let imgX, imgY, imgW, imgH;
  
    let wiggling = true;
    let wiggleAngle = 0;
    let wiggleSpeed = 0.05;
    let wiggleMax = 0.1;
  
    p.preload = () => {
      console.log("🌀 sketch2.js preload running");
  
      bgImg2 = p.loadImage('blankpage2.jpg',
        () => console.log("✅ Background image loaded"),
        () => {
          console.error("❌ Failed to load background image");
          bgImg2 = null;
        }
      );
  
      imageNames.forEach(name => {
        p.loadImage(name,
          img => {
            console.log(`✅ Loaded ${name}`);
            images.push(img);
          },
          () => {
            console.error(`❌ Failed to load ${name}`);
            let placeholder = p.createGraphics(200, 300);
            placeholder.background(220);
            placeholder.textAlign(p.CENTER, p.CENTER);
            placeholder.text("Missing Image", 100, 150);
            images.push(placeholder);
          }
        );
      });
    };
  
    p.setup = () => {
      console.log("✅ [sketch2] setup called");
      let cnv = p.createCanvas(800, 600);
      cnv.parent(document.body);
      p.textSize(32);
      p.textAlign(p.CENTER, p.CENTER);
  
      imgW = 200;
      imgH = 300;
      imgX = p.width / 2;
      imgY = p.height / 2 + imgH / 2;
    };
  
    p.draw = () => {
      if (bgImg2) {
        p.background(bgImg2);
      } else {
        p.background(240);
      }
  
      // Typewriter effect
      p.fill(0);
      if (index < sentence.length && p.millis() - lastTypedTime > typeSpeed) {
        currentText += sentence[index];
        index++;
        lastTypedTime = p.millis();
      }
      p.text(currentText, p.width / 2, p.height / 2 - 100);
  
      // Draw current image
      if (images.length > 0 && images[currentImgIndex]) {
        p.push();
        p.translate(imgX, imgY);
        if (wiggling) {
          wiggleAngle = p.sin(p.frameCount * wiggleSpeed) * wiggleMax;
          p.rotate(wiggleAngle);
        }
        p.imageMode(p.CENTER);
        p.image(images[currentImgIndex], 0, 0, imgW, imgH);
        p.pop();
      } else {
        p.fill(100);
        p.text("🖼️ No images loaded", p.width / 2, p.height / 2 + 150);
      }
    };
  
    p.mousePressed = () => {
      if (
        p.mouseX >= imgX - imgW / 2 &&
        p.mouseX <= imgX + imgW / 2 &&
        p.mouseY >= imgY - imgH / 2 &&
        p.mouseY <= imgY + imgH / 2
      ) {
        if (images.length > 0) {
          // If current is bayonne, transition to sketch3.js
          if (imageNames[currentImgIndex] === 'bayonnepolaroid.png') {
            console.log("🛫 Loading sketch3.js...");
            transitionToSketch3();
          } else {
            currentImgIndex = (currentImgIndex + 1) % images.length;
            wiggling = false;
          }
        }
      }
    };
  
    function transitionToSketch3() {
      if (typeof p.remove === 'function') p.remove();
  
      document.querySelectorAll("canvas").forEach(c => c.remove());
  
      const oldScript = document.querySelector("script[src='sketch2.js']");
      if (oldScript) oldScript.remove();
  
      const newScript = document.createElement("script");
      newScript.src = "sketch3.js";
      newScript.onload = () => console.log("✅ sketch3.js loaded");
      newScript.onerror = () => console.error("❌ sketch3.js failed to load");
      document.body.appendChild(newScript);
    }
  });
  