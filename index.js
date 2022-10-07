const btn = document.querySelector("button");
const video = document.querySelector("video");

// options for bodyPix.load()
const architecture = "ResNet50";
const outputStride = 16;
const multiplier = 0.75;
const quantBytes = 2;
// options for segmentation
const segmentationThreshold = 0.7;
const flipHorizontal = true;
const internalResolution = "medium";

const startSegmentation = async () => {
  const canvas = document.querySelector("canvas");
  canvas.width = video.width;
  canvas.height = video.height;
  const performSegmentation = async (net) => {
    while (true) {
      const segmentation = await net.segmentPerson(video);
      const opacity = 0.7;
      const maskBlurAmount = 3;
      const pixelCellWidth = 5.0;
      // options for bodyPix.toMask()
      const foregroundColor = { r: 0, g: 0, b: 0, a: 255 };
      const backgroundColor = { r: 0, g: 0, b: 0, a: 0 };
      const drawContour = true;
      // options for BokehEffect
      const backgroundBlurAmount = 10;
      const edgeBlurAmount = 6;

      const coloredPartImage = bodyPix.toMask(
        segmentation,
        foregroundColor,
        backgroundColor,
        drawContour
      );
      bodyPix.drawBokehEffect(
        canvas,
        video,
        // coloredPartImage,
        segmentation,
        backgroundBlurAmount,
        edgeBlurAmount
        // opacity,
        // maskBlurAmount,
        // flipHorizontal
        // pixelCellWidth
      );
    }
  };

  bodyPix
    .load()
    .then((net) => performSegmentation(net))
    .catch((err) => console.log(err));
  // const canvasStream = () => Promise.resolve(canvas.captureStream());

  // load the model
  // const net = await bodyPix.load();
  // const segmentation = await net.segmentPerson(video, { flipHorizontal });
  // console.log(segmentation);

  // const coloredPartImage = bodyPix.toMask(segmentation);
  // const opacity = 0.7;
  // const maskBlurAmount = 0;
  // const pixelCellWidth = 5.0;

  // bodyPix.drawPixelatedMask(
  //   canvas,
  //   video,
  //   coloredPartImage,
  //   opacity,
  //   maskBlurAmount,
  //   flipHorizontal,
  //   pixelCellWidth
  // );
};

const constraints = {
  audio: false,
  video: { width: 1280, height: 720, frameRate: { ideal: 25, max: 30 } },
};

btn.addEventListener("click", startSegmentation);

// vid.addEventListener("play", (e) => {
//   changeBackground();
//   console.log("play");
// });

// function random(number) {
//   return Math.floor(Math.random() * (number + 1));
// }

// function changeBackground() {
//   const rndCol = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
//   document.body.style.backgroundColor = rndCol;
// }

navigator.mediaDevices
  .getUserMedia(constraints)
  .then((mediaStream) => {
    video.srcObject = mediaStream;
    video.onloadedmetadata = () => {
      video.play();
      startSegmentation();
    };
  })
  .catch((err) => {
    // always check for errors at the end.
    console.error(`${err.name}: ${err.message}`);
  });
