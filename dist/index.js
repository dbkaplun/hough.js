/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(1);

	var _2 = _interopRequireDefault(_);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var inputImage = document.querySelector('#input');
	inputImage.addEventListener('load', function () {
	  var width = inputImage.width,
	      height = inputImage.height;

	  var inputCtx = (0, _.defaultCanvasFactory)(width, height).getContext('2d');
	  inputCtx.drawImage(inputImage, 0, 0, width, height);
	  var inputData = inputCtx.getImageData(0, 0, width, height);

	  var outputCanvas = document.querySelector('#output');
	  outputCanvas.getContext('2d').putImageData((0, _2.default)(inputData, outputCanvas), 0, 0);
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
	      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;_e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }return _arr;
	  }return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if (Symbol.iterator in Object(arr)) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	}();

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
	    var Canvas = __webpack_require__(2);
	    return new (Function.prototype.bind.apply(Canvas, [null].concat(Array.prototype.slice.call(arguments))))();
	  }
	};
	function setCanvasFactory(fn) {
	  setCanvasFactory.canvasFactory = fn;
	};
	setCanvasFactory(defaultCanvasFactory);

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	/*!
	 * Canvas
	 * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var canvas = require('./bindings'),
	    Canvas = canvas.Canvas,
	    Image = canvas.Image,
	    cairoVersion = canvas.cairoVersion,
	    Context2d = require('./context2d'),
	    PNGStream = require('./pngstream'),
	    PDFStream = require('./pdfstream'),
	    JPEGStream = require('./jpegstream'),
	    FontFace = canvas.FontFace,
	    fs = require('fs'),
	    packageJson = require("../package.json"),
	    FORMATS = ['image/png', 'image/jpeg'];

	/**
	 * Export `Canvas` as the module.
	 */

	var Canvas = exports = module.exports = Canvas;

	/**
	 * Library version.
	 */

	exports.version = packageJson.version;

	/**
	 * Cairo version.
	 */

	exports.cairoVersion = cairoVersion;

	/**
	 * jpeglib version.
	 */

	if (canvas.jpegVersion) {
	  exports.jpegVersion = canvas.jpegVersion;
	}

	/**
	 * gif_lib version.
	 */

	if (canvas.gifVersion) {
	  exports.gifVersion = canvas.gifVersion.replace(/[^.\d]/g, '');
	}

	/**
	 * freetype version.
	 */

	if (canvas.freetypeVersion) {
	  exports.freetypeVersion = canvas.freetypeVersion;
	}

	/**
	 * Expose constructors.
	 */

	exports.Context2d = Context2d;
	exports.PNGStream = PNGStream;
	exports.PDFStream = PDFStream;
	exports.JPEGStream = JPEGStream;
	exports.Image = Image;
	exports.ImageData = canvas.ImageData;

	if (FontFace) {
	  var Font = function Font(name, path, idx) {
	    this.name = name;
	    this._faces = {};

	    this.addFace(path, 'normal', 'normal', idx);
	  };

	  Font.prototype.addFace = function (path, weight, style, idx) {
	    style = style || 'normal';
	    weight = weight || 'normal';

	    var face = new FontFace(path, idx || 0);
	    this._faces[weight + '-' + style] = face;
	  };

	  Font.prototype.getFace = function (weightStyle) {
	    return this._faces[weightStyle] || this._faces['normal-normal'];
	  };

	  exports.Font = Font;
	}

	/**
	 * Context2d implementation.
	 */

	require('./context2d');

	/**
	 * Image implementation.
	 */

	require('./image');

	/**
	 * Inspect canvas.
	 *
	 * @return {String}
	 * @api public
	 */

	Canvas.prototype.inspect = function () {
	  return '[Canvas ' + this.width + 'x' + this.height + ']';
	};

	/**
	 * Get a context object.
	 *
	 * @param {String} contextId
	 * @return {Context2d}
	 * @api public
	 */

	Canvas.prototype.getContext = function (contextId) {
	  if ('2d' == contextId) {
	    var ctx = this._context2d || (this._context2d = new Context2d(this));
	    this.context = ctx;
	    ctx.canvas = this;
	    return ctx;
	  }
	};

	/**
	 * Create a `PNGStream` for `this` canvas.
	 *
	 * @return {PNGStream}
	 * @api public
	 */

	Canvas.prototype.pngStream = Canvas.prototype.createPNGStream = function () {
	  return new PNGStream(this);
	};

	/**
	 * Create a synchronous `PNGStream` for `this` canvas.
	 *
	 * @return {PNGStream}
	 * @api public
	 */

	Canvas.prototype.syncPNGStream = Canvas.prototype.createSyncPNGStream = function () {
	  return new PNGStream(this, true);
	};

	/**
	 * Create a `PDFStream` for `this` canvas.
	 *
	 * @return {PDFStream}
	 * @api public
	 */

	Canvas.prototype.pdfStream = Canvas.prototype.createPDFStream = function () {
	  return new PDFStream(this);
	};

	/**
	 * Create a synchronous `PDFStream` for `this` canvas.
	 *
	 * @return {PDFStream}
	 * @api public
	 */

	Canvas.prototype.syncPDFStream = Canvas.prototype.createSyncPDFStream = function () {
	  return new PDFStream(this, true);
	};

	/**
	 * Create a `JPEGStream` for `this` canvas.
	 *
	 * @param {Object} options
	 * @return {JPEGStream}
	 * @api public
	 */

	Canvas.prototype.jpegStream = Canvas.prototype.createJPEGStream = function (options) {
	  return this.createSyncJPEGStream(options);
	};

	/**
	 * Create a synchronous `JPEGStream` for `this` canvas.
	 *
	 * @param {Object} options
	 * @return {JPEGStream}
	 * @api public
	 */

	Canvas.prototype.syncJPEGStream = Canvas.prototype.createSyncJPEGStream = function (options) {
	  options = options || {};
	  // Don't allow the buffer size to exceed the size of the canvas (#674)
	  var maxBufSize = this.width * this.height * 4;
	  var clampedBufSize = Math.min(options.bufsize || 4096, maxBufSize);
	  return new JPEGStream(this, {
	    bufsize: clampedBufSize,
	    quality: options.quality || 75,
	    progressive: options.progressive || false
	  });
	};

	/**
	 * Return a data url. Pass a function for async support (required for "image/jpeg").
	 *
	 * @param {String} type, optional, one of "image/png" or "image/jpeg", defaults to "image/png"
	 * @param {Object|Number} encoderOptions, optional, options for jpeg compression (see documentation for Canvas#jpegStream) or the JPEG encoding quality from 0 to 1.
	 * @param {Function} fn, optional, callback for asynchronous operation. Required for type "image/jpeg".
	 * @return {String} data URL if synchronous (callback omitted)
	 * @api public
	 */

	Canvas.prototype.toDataURL = function (a1, a2, a3) {
	  // valid arg patterns (args -> [type, opts, fn]):
	  // [] -> ['image/png', null, null]
	  // [qual] -> ['image/png', null, null]
	  // [undefined] -> ['image/png', null, null]
	  // ['image/png'] -> ['image/png', null, null]
	  // ['image/png', qual] -> ['image/png', null, null]
	  // [fn] -> ['image/png', null, fn]
	  // [type, fn] -> [type, null, fn]
	  // [undefined, fn] -> ['image/png', null, fn]
	  // ['image/png', qual, fn] -> ['image/png', null, fn]
	  // ['image/jpeg', fn] -> ['image/jpeg', null, fn]
	  // ['image/jpeg', opts, fn] -> ['image/jpeg', opts, fn]
	  // ['image/jpeg', qual, fn] -> ['image/jpeg', {quality: qual}, fn]
	  // ['image/jpeg', undefined, fn] -> ['image/jpeg', null, fn]

	  if (this.width === 0 || this.height === 0) {
	    // Per spec, if the bitmap has no pixels, return this string:
	    return "data:,";
	  }

	  var type = 'image/png';
	  var opts = {};
	  var fn;

	  if ('function' === typeof a1) {
	    fn = a1;
	  } else {
	    if ('string' === typeof a1 && FORMATS.indexOf(a1.toLowerCase()) !== -1) {
	      type = a1.toLowerCase();
	    }

	    if ('function' === typeof a2) {
	      fn = a2;
	    } else {
	      if ('object' === (typeof a2 === 'undefined' ? 'undefined' : _typeof(a2))) {
	        opts = a2;
	      } else if ('number' === typeof a2) {
	        opts = { quality: Math.max(0, Math.min(1, a2)) * 100 };
	      }

	      if ('function' === typeof a3) {
	        fn = a3;
	      } else if (undefined !== a3) {
	        throw new TypeError((typeof a3 === 'undefined' ? 'undefined' : _typeof(a3)) + ' is not a function');
	      }
	    }
	  }

	  if ('image/png' === type) {
	    if (fn) {
	      this.toBuffer(function (err, buf) {
	        if (err) return fn(err);
	        fn(null, 'data:image/png;base64,' + buf.toString('base64'));
	      });
	    } else {
	      return 'data:image/png;base64,' + this.toBuffer().toString('base64');
	    }
	  } else if ('image/jpeg' === type) {
	    if (undefined === fn) {
	      throw new Error('Missing required callback function for format "image/jpeg"');
	    }

	    var stream = this.jpegStream(opts);
	    // note that jpegStream is synchronous
	    var buffers = [];
	    stream.on('data', function (chunk) {
	      buffers.push(chunk);
	    });
	    stream.on('error', function (err) {
	      fn(err);
	    });
	    stream.on('end', function () {
	      var result = 'data:image/jpeg;base64,' + Buffer.concat(buffers).toString('base64');
	      fn(null, result);
	    });
	  }
	};

/***/ }
/******/ ]);