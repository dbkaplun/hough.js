export const BANDWIDTH = 255;
export const DEFAULT_THRESHOLD = .5;

// Translated from https://rosettacode.org/wiki/Hough_transform#Python
export default function hough (input, outputSize, threshold=DEFAULT_THRESHOLD) {
  if (typeof threshold === 'number') threshold = thresholdByBrightness(threshold);

  let {width, height, data} = input;

  let outputWidth = outputSize.width;
  let outputHeight = outputSize.height;
  let dest = setCanvasFactory.canvasFactory(outputWidth, outputHeight);
  let halfHeight = outputHeight / 2;
  let ctx = dest.getContext('2d');
  ctx.fillStyle = `rgba(${BANDWIDTH}, ${BANDWIDTH}, ${BANDWIDTH}, 1)`;
  ctx.fillRect(0, 0, outputWidth, outputHeight);
  let output = ctx.getImageData(0, 0, outputWidth, outputHeight);

  let rhoMax = Math.sqrt(width*width + height*height);
  let dRho = rhoMax / halfHeight;
  let dTh = Math.PI / outputWidth;
  for (let inputY = 0; inputY < height; inputY++) {
    for (let inputX = 0; inputX < width; inputX++) {
      let inputI = xyToIndex(input, inputX, inputY);
      if (threshold(...input.data.slice(inputI, inputI+4))) continue;
      for (let outputX = 0; outputX < outputWidth; outputX++) {
        let th = dTh*outputX;
        let rho = inputX*Math.cos(th) + inputY*Math.sin(th);
        let outputY = halfHeight - Math.floor(rho/dRho+.5);
        let outputI = xyToIndex(output, outputX, outputY);
        output.data[outputI+0]--; // r
        output.data[outputI+1]--; // g
        output.data[outputI+2]--; // b
        // output.data[outputI+3] = BANDWIDTH; // a
      }
    }
  }

  return output;
};

export function thresholdByBrightness (threshold) {
  return (...args) => brightness(...args) > threshold;
};

export function brightness (r, g, b, a) {
  return (r+g+b)/(3*BANDWIDTH) * (a/BANDWIDTH);
};

export function xyToIndex ({width}, x, y) {
  return (y*width + x)*4;
};

export function defaultCanvasFactory (width, height) {
  if (typeof document !== 'undefined') {
    return Object.assign(document.createElement('canvas'), {width, height});
  } else {
    const Canvas = require('canvas');
    return new Canvas(...arguments);
  }
};
export function setCanvasFactory (fn) {
  setCanvasFactory.canvasFactory = fn;
};
setCanvasFactory(defaultCanvasFactory);
