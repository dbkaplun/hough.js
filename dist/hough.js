'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hough;
exports.xyToRhoTheta = xyToRhoTheta;
exports.getRhoMax = getRhoMax;
exports.brightness = brightness;
exports.xyToIndex = xyToIndex;
exports.newCanvas = newCanvas;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var BANDWIDTH = exports.BANDWIDTH = 255;
var DEFAULT_THRESHOLD = exports.DEFAULT_THRESHOLD = .5;

// Translated from https://rosettacode.org/wiki/Hough_transform#Python
function hough(input, outputSize) {
  var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_THRESHOLD;

  if (typeof threshold === 'number') threshold = brightness.threshold(threshold);

  var width = input.width,
      height = input.height,
      data = input.data;


  var outputWidth = outputSize.width;
  var outputHeight = outputSize.height;
  var dest = newCanvas(outputWidth, outputHeight);
  var halfHeight = outputHeight / 2;
  var ctx = dest.getContext('2d');
  ctx.fillStyle = 'rgba(' + BANDWIDTH + ', ' + BANDWIDTH + ', ' + BANDWIDTH + ', 1)';
  ctx.fillRect(0, 0, outputWidth, outputHeight);
  var output = ctx.getImageData(0, 0, outputWidth, outputHeight);

  var dRho = getRhoMax(input) / halfHeight;
  var dTh = Math.PI / outputWidth;
  for (var inputY = 0; inputY < height; inputY++) {
    for (var inputX = 0; inputX < width; inputX++) {
      var inputI = xyToIndex(input, inputX, inputY);
      if (threshold.apply(undefined, _toConsumableArray(input.data.slice(inputI, inputI + 4)))) continue;
      for (var outputX = 0; outputX < outputWidth; outputX++) {
        var th = dTh * outputX;
        var rho = inputX * Math.cos(th) + inputY * Math.sin(th);
        var outputY = halfHeight - Math.round(rho / dRho);
        var outputI = xyToIndex(output, outputX, outputY);
        output.data[outputI + 0]--; // r
        output.data[outputI + 1]--; // g
        output.data[outputI + 2]--; // b
        // output.data[outputI+3] = BANDWIDTH; // a
      }
    }
  }

  return output;
};

function xyToRhoTheta(input, output, outputX, outputY) {
  // (rho, th) determines a line in Hough space
  // line equation is rho = cos(th)x + sin(th)y
  return {
    rho: getRhoMax(input) * (1 - 2 * outputY / output.height),
    th: Math.PI * outputX / output.width
  };
};

function getRhoMax(_ref) {
  var width = _ref.width,
      height = _ref.height;

  // return Math.hypot(width, height);
  return Math.sqrt(width * width + height * height);
};

function brightness(r, g, b, a) {
  return (r + g + b) / (3 * BANDWIDTH) * (a / BANDWIDTH);
};
brightness.threshold = function (threshold) {
  return function () {
    return brightness.apply(this, arguments) > threshold;
  };
};

function xyToIndex(_ref2, x, y) {
  var width = _ref2.width;

  return (y * width + x) * 4;
};

function newCanvas() {
  return newCanvas.factory.apply(this, arguments);
};
newCanvas.BROWSER_FACTORY = function (width, height) {
  return Object.assign(document.createElement('canvas'), { width: width, height: height });
};
newCanvas.NODE_FACTORY = function () {
  var Canvas = newCanvas.NODE_FACTORY.Canvas;

  if (!Canvas) Canvas = newCanvas.NODE_FACTORY.Canvas = require('canvas');
  return new (Function.prototype.bind.apply(Canvas, [null].concat(Array.prototype.slice.call(arguments))))();
};
newCanvas.DEFAULT_FACTORY = function () {
  return typeof document !== 'undefined' ? newCanvas.BROWSER_FACTORY.apply(this, arguments) : newCanvas.NODE_FACTORY.apply(this, arguments);
};
newCanvas.factory = newCanvas.DEFAULT_FACTORY;
