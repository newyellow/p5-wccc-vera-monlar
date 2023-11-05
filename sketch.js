//
// Weekly Creative Coding Challenge Topic 'Vera Molnar'
//
//
// Check the challenge page if you would like to join:
// https://openprocessing.org/curation/78544 
//

// It was fascinating to learn that Vera Molnar was a pioneer
// in generative art. I had a lot of fun experimenting with simple 
// randomness. Thanks Rubén for suggesting this topic!
//
// For this week's challenge, I simply played with various variables,
// such as position offset randomness, line count, and layer count.
// Each variable was subjected to a random transition method, which could
// either be through the position x (xt), the position y (yt), a noise map (noise),
// or just purely random.
//
// I really enjoyed this week!

let parameterTypes = [
  'CONSTANT',
  'XT',
  'YT',
  'NOISE',
  '1-XT',
  '1-YT',
  'RANDOM'
];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  background(10);

  colorMode(HSB);


  let xCount = int(random(6, 24));
  let yCount = int(random(6, 24));

  let shapeType = int(random(0, 2)); // 0: lines, 1: rectangles
  let lineCountMax = int(random(6, 24));
  let layerCountMax = int(random(6, 12));
  let blockLevelMax = int(random(4, 24));

  // a ValueParameter class is use to randomize the transition type
  // it's in object.js, and it's a simple class to understand (I think)
  let paramRandomness = new ValueParameter(0, 1.4, random(parameterTypes));

  // no randomness in line position is an interesting style
  // but the chance is too low with ValueParameter class
  // so make it easier to appear here
  if(random() < 0.1)
    paramRandomness = new ValueParameter(0, 0.0, 'CONSTANT');

  let paramLayersCount = new ValueParameter(1, layerCountMax, random(parameterTypes));
  let paramLineCount = new ValueParameter(2, lineCountMax, random(parameterTypes));
  let paramBlockLevel = new ValueParameter(2, blockLevelMax, random(parameterTypes));

  let fromHue = random(0, 360);
  let fromSat = random(20, 80);
  let fromBri = random(60, 100);
  let fromColor = new NYColor(fromHue, fromSat, fromBri);

  let toHue = processHue(fromHue + random(60, 180));
  let toSat = random(20, 80);
  let toBri = random(60, 100);
  let toColor = new NYColor(toHue, toSat, toBri);

  let canvasPadding = 0.06 * min(width, height);
  let rectWidth = (width - 2 * canvasPadding) / xCount;
  let rectHeight = (height - 2 * canvasPadding) / yCount;

  let blockWidth = min(rectWidth, rectHeight);
  let blockPadding = random(0.05, 0.1) * blockWidth;
  let blockInnerWidth = blockWidth - 2 * blockPadding;

  let xPadding = (width - blockWidth * xCount) / 2;
  let yPadding = (height - blockWidth * yCount) / 2;

  strokeWeight(min(width, height) * 0.001);
  strokeWeight(0.6);

  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      let xt = x / xCount;
      let yt = y / yCount;

      let nowX = x * blockWidth + blockPadding + xPadding;
      let nowY = y * blockWidth + blockPadding + yPadding;

      let noiseValue = noise(nowX * 0.006, nowY * 0.006);

      let pointRandomness = paramRandomness.getValue(xt, yt, noiseValue);
      let layersCount = paramLayersCount.getValue(xt, yt, noiseValue);
      let lineCount = paramLineCount.getValue(xt, yt, noiseValue);
      let blockLevel = paramBlockLevel.getValue(xt, yt, noiseValue);

      for (let i = 0; i < layersCount; i++) {
        let layerT = i / (xCount - 1);
        let layerColor = NYLerpColor(fromColor, toColor, layerT);
        layerColor.h = processHue(layerColor.h + 330 * i);

        if (random() < 0.12)
          layerColor.h = processHue(layerColor.h + 180);

        if (random() < 0.06) {
          layerColor.s = 0;
          layerColor.b = 100;
        }

        let newBlock = new MonlarBlock(
          nowX,
          nowY,
          blockInnerWidth,
          blockInnerWidth,
          lineCount,
          pointRandomness,
          layerColor,
          blockLevel,
          shapeType
        );
        newBlock.draw();
      }
    }
  }
}

// async sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}