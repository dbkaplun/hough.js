export const BANDWIDTH = 255;
export const DEFAULT_THRESHOLD = .5;

// Translated from https://rosettacode.org/wiki/Hough_transform#Python
export default function hough (input, outputSize, threshold=DEFAULT_THRESHOLD) {
  if (typeof threshold === 'number') threshold = brightness.threshold(threshold);

  let {width, height, data} = input;

  let outputWidth = outputSize.width;
  let outputHeight = outputSize.height;
  let dest = newCanvas(outputWidth, outputHeight);
  let halfHeight = outputHeight / 2;
  let ctx = dest.getContext('2d');
  ctx.fillStyle = `rgba(${BANDWIDTH}, ${BANDWIDTH}, ${BANDWIDTH}, 1)`;
  ctx.fillRect(0, 0, outputWidth, outputHeight);
  let output = ctx.getImageData(0, 0, outputWidth, outputHeight);

  let dRho = getRhoMax(input) / halfHeight;
  let dTh = Math.PI / outputWidth;
  for (let inputY = 0; inputY < height; inputY++) {
    for (let inputX = 0; inputX < width; inputX++) {
      let inputI = xyToIndex(input, inputX, inputY);
      if (threshold(...input.data.slice(inputI, inputI+4))) continue;
      for (let outputX = 0; outputX < outputWidth; outputX++) {
        let th = dTh*outputX;
        let rho = inputX*Math.cos(th) + inputY*Math.sin(th);
        let outputY = halfHeight - Math.round(rho/dRho);
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

export function xyToRhoTheta (input, output, outputX, outputY) {
  // (rho, th) determines a line in Hough space
  // line equation is rho = cos(th)x + sin(th)y
  return {
    rho: getRhoMax(input)*(1 - 2*outputY/output.height),
    th: Math.PI * outputX/output.width,
  };
};

export function getRhoMax ({width, height}) {
  // return Math.hypot(width, height);
  return Math.sqrt(width*width + height*height);
};

export function brightness (r, g, b, a) {
  return (r+g+b)/(3*BANDWIDTH) * (a/BANDWIDTH);
};
brightness.threshold = (threshold) => function () {
  return brightness.apply(this, arguments) > threshold;
};

export function xyToIndex ({width}, x, y) {
  return (y*width + x)*4;
};

export function newCanvas () {
  return newCanvas.factory.apply(this, arguments);
};
newCanvas.BROWSER_FACTORY = (width, height) => Object.assign(document.createElement('canvas'), {width, height});
newCanvas.NODE_FACTORY = function () {
  let {Canvas} = newCanvas.NODE_FACTORY;
  if (!Canvas) Canvas = newCanvas.NODE_FACTORY.Canvas = require('canvas');
  return new Canvas(...arguments);
};
newCanvas.DEFAULT_FACTORY = function () {
  return typeof document !== 'undefined'
    ? newCanvas.BROWSER_FACTORY.apply(this, arguments)
    : newCanvas.NODE_FACTORY.apply(this, arguments);
};
newCanvas.factory = newCanvas.DEFAULT_FACTORY;
