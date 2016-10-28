'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hough;
exports.thresholdByBrightness = thresholdByBrightness;
exports.brightness = brightness;
exports.xyToIndex = xyToIndex;
exports.defaultCanvasFactory = defaultCanvasFactory;
exports.setCanvasFactory = setCanvasFactory;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var BANDWIDTH = exports.BANDWIDTH = 255;
var DEFAULT_THRESHOLD = exports.DEFAULT_THRESHOLD = .5;

// Translated from https://rosettacode.org/wiki/Hough_transform#Python
function hough(input, outputSize) {
  var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_THRESHOLD;

  if (typeof threshold === 'number') threshold = thresholdByBrightness(threshold);

  var width = input.width,
      height = input.height,
      data = input.data;


  var outputWidth = outputSize.width;
  var outputHeight = outputSize.height;
  var dest = setCanvasFactory.canvasFactory(outputWidth, outputHeight);
  var halfHeight = outputHeight / 2;
  var ctx = dest.getContext('2d');
  ctx.fillStyle = 'rgba(' + BANDWIDTH + ', ' + BANDWIDTH + ', ' + BANDWIDTH + ', 1)';
  ctx.fillRect(0, 0, outputWidth, outputHeight);
  var output = ctx.getImageData(0, 0, outputWidth, outputHeight);

  var rhoMax = Math.sqrt(width * width + height * height);
  var dRho = rhoMax / halfHeight;
  var dTh = Math.PI / outputWidth;
  for (var inputY = 0; inputY < height; inputY++) {
    for (var inputX = 0; inputX < width; inputX++) {
      var inputI = xyToIndex(input, inputX, inputY);
      if (threshold.apply(undefined, _toConsumableArray(input.data.slice(inputI, inputI + 4)))) continue;
      for (var outputX = 0; outputX < outputWidth; outputX++) {
        var th = dTh * outputX;
        var rho = inputX * Math.cos(th) + inputY * Math.sin(th);
        var outputY = halfHeight - Math.floor(rho / dRho + .5);
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

function thresholdByBrightness(threshold) {
  return function () {
    return brightness.apply(undefined, arguments) > threshold;
  };
};

function brightness(r, g, b, a) {
  return (r + g + b) / (3 * BANDWIDTH) * (a / BANDWIDTH);
};

function xyToIndex(_ref, x, y) {
  var width = _ref.width;

  return (y * width + x) * 4;
};

function defaultCanvasFactory(width, height) {
  if (typeof document !== 'undefined') {
    return Object.assign(document.createElement('canvas'), { width: width, height: height });
  } else {
    var Canvas = require('canvas');
    return new (Function.prototype.bind.apply(Canvas, [null].concat(Array.prototype.slice.call(arguments))))();
  }
};
function setCanvasFactory(fn) {
  setCanvasFactory.canvasFactory = fn;
};
setCanvasFactory(defaultCanvasFactory);
