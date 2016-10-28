'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = hough;
exports.xyToIndex = xyToIndex;
exports.defaultCanvasFactory = defaultCanvasFactory;
exports.setCanvasFactory = setCanvasFactory;
var BANDWIDTH = exports.BANDWIDTH = 255;

// Translated from https://rosettacode.org/wiki/Hough_transform#Python
function hough(input, outputSize) {
  var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : .5;
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

      var _input$data$slice = input.data.slice(inputI, inputI + 4),
          _input$data$slice2 = _slicedToArray(_input$data$slice, 4),
          r = _input$data$slice2[0],
          g = _input$data$slice2[1],
          b = _input$data$slice2[2],
          a = _input$data$slice2[3];

      var brightness = (r + g + b) / (3 * BANDWIDTH) * (a / BANDWIDTH);
      if (brightness > threshold) continue;
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
