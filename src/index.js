const Knot = require('./knot');

const inputFile = document.getElementById("inputFile");
const imgOriginal = document.getElementById("imgOriginal");
const canvasOutput = document.getElementById("canvasOutput");
const inputWidth = document.getElementById("inputWidth");
const inputThreshold = document.getElementById("inputThreshold");
const inputKnots = document.getElementById("inputKnots");
const inputBlack = document.getElementById("inputBlack");
const btnDownload = document.getElementById("btnDownload");

const state = {
  imageLoaded: false,
  imageDataGrayscale: null,
  knotData: null,
  desiredWidth: +inputWidth.value,
  threshold: +inputThreshold.value,
  numKnots: +inputKnots.value,
  knotOnBlack: inputBlack.checked
};

const getIndex = (x, y, width, height) => {
  if (x < 0) x = 0;
  if (x >= width) x = width - 1;
  if (y < 0) y = 0;
  if (y >= height) y = height - 1;
  return y * width * 4 + x * 4;
}

const drawImage = () => {
  const scale = 16;
  const imageData = state.knotData;
  canvasOutput.width = imageData.width * scale;
  canvasOutput.height = imageData.height * scale;
  const context = canvasOutput.getContext("2d");

  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const value = imageData.data[y][x] ? 255 : 0;
      context.fillStyle = `rgba(${value},${value},${value},1)`;
      context.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

const thresholdImage = () => {
  const input = state.imageDataGrayscale;
  const width = input.width;
  const height = input.height;
  const threshold = state.threshold;

  const data = new Array(height);

  for (var y = 0; y < height; y++) {
    data[y] = new Array(width);
    for (var x = 0; x < width; x++) {
      data[y][x] = input.data[y * width * 4 + x * 4] > threshold;
    }
  }
  state.knotData = {width, height, data};
  drawImage();
}

const grayscaleImage = () => {
  const scaleFactor =  state.desiredWidth / imgOriginal.width;
  const width = state.desiredWidth;
  const height = Math.ceil(imgOriginal.height * scaleFactor);
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d");
  context.scale(scaleFactor, scaleFactor);
  context.drawImage(imgOriginal, 0, 0);

  const imageData = context.getImageData(
    0,
    0,
    width,
    height
  );
  const data = imageData.data;

  // convert to grayscale
  for (var i = 0; i < data.length; i += 4) {
    const avg = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }

  state.imageDataGrayscale = imageData;
  thresholdImage();
};

inputFile.addEventListener("change", e => {
  if (e.target.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      imgOriginal.onload = () => {
        console.log("Image Successfullyl Loaded");
        state.imageLoaded = true;
        grayscaleImage();
      };
      imgOriginal.src = e.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  } else {
    state.imageLoaded = false;
  }
});

inputWidth.addEventListener("change", e => {
  state.desiredWidth = +e.target.value;
  if (state.imageLoaded) {
    grayscaleImage();
  }
});

inputThreshold.addEventListener("change", e => {
  state.threshold = +e.target.value;
  if (state.imageLoaded) {
    thresholdImage();
  }
});

inputKnots.addEventListener("change", e => {
  state.numKnots = +e.target.value;
});

inputBlack.addEventListener("change", e => {
  state.knotOnBlack = e.target.checked;
});

btnDownload.addEventListener("click", e => {
  if (state.imageLoaded) {
    const knitoutStr = Knot(state.knotData, state.knotOnBlack, state.numKnots);
    const a = document.createElement("a");
    a.style = "display: none";
    const blob = new Blob([knitoutStr], {type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "my-knot.knitout";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } else {
    alert("Please choose an image first");
  }
});
