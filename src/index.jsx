import React from 'react';
import ReactDOM from 'react-dom';
import hough, {xyToRhoTheta, defaultCanvasFactory} from '..';
import _ from 'lodash';

const houghImageMem = _.memoize((image, ...args) => {
  let {width, height} = image;
  let tmpCtx = defaultCanvasFactory(width, height).getContext('2d');
  tmpCtx.drawImage(image, 0, 0, width, height);
  return hough(tmpCtx.getImageData(0, 0, width, height), ...args);
});

function newImage (opts) {
  return new Promise((resolve, reject) => {
    let img = _.merge(new Image(), opts);
    img.addEventListener('load', ()=>resolve(img), true);
    img.addEventListener('error', reject, true);
  });
}

function getOffset (evt) {
  let el = evt.target,
      x = 0,
      y = 0;

  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    x += el.offsetLeft - el.scrollLeft;
    y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }

  x = evt.clientX - x;
  y = evt.clientY - y;

  return {x, y};
}

function clearCanvas (canvas, fillStyle, ctx=canvas.getContext('2d')) {
  let oldFillStyle = ctx.fillStyle;
  ctx.fillStyle = fillStyle;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = oldFillStyle;
};

const DemoHough = React.createClass({
  getInitialState () {
    return {
      input: 'test/data/rosettacode-pentagon/input.png',
      outputSize: {width: 480, height: 360},
      houghArgs: [],
    };
  },
  componentDidMount () {
    this.setInputImage();
  },
  setInputImage (opts={src: this.state.input}) {
    return newImage(opts)
      .then(inputImage => { this.setState({inputImage}); })
      .catch(console.error);
  },
  onOutputMouseMove (evt) { this.setState({mouse: getOffset(evt)}); },
  onOutputMouseLeave ()   { this.setState({mouse: null}); },
  renderCanvas () {
    let {input, output} = this.refs;
    if (!input || !output) return;
    let inputCtx = input.getContext('2d');
    let outputCtx = output.getContext('2d');
    clearCanvas(input, 'white', inputCtx);
    clearCanvas(output, 'white', outputCtx);

    let {inputImage, outputSize, houghArgs} = this.state;
    if (!inputImage) return;
    let {width, height} = inputImage;
    _.merge(input, {width, height});
    inputCtx.drawImage(inputImage, 0, 0);
    let houghed = houghImageMem(inputImage, outputSize, ...houghArgs);
    outputCtx.putImageData(houghed, 0, 0);

    let {mouse} = this.state;
    if (!mouse) return;
    let {x, y} = mouse;
    let {rho, th} = xyToRhoTheta(input, houghed, x, y);
    // line equation is rho = cos(th)x + sin(th)y
    // solve for moveTo/lineTo coords at x = 0 and x = width
    inputCtx.beginPath();
    inputCtx.moveTo(0,     rho/Math.sin(th));
    inputCtx.lineTo(width, (rho - width*Math.cos(th))/Math.sin(th));
    inputCtx.stroke();
  },
  render () {
    let {inputImage, outputSize: {width, height}} = this.state;
    _.defer(this.renderCanvas);
    return (
      <div>
        <h1>hough.js <small><a href="https://github.com/dbkaplun/hough.js">Github</a></small></h1>

        <h2>Input</h2>
        <canvas ref="input"
          width={_.get(inputImage, 'width', 0)}
          height={_.get(inputImage, 'height', 0)}>
        </canvas>

        <h2>Output</h2>
        <canvas ref="output"
          width={width}
          height={height}
          onMouseMove={this.onOutputMouseMove}
          onMouseLeave={this.onOutputMouseLeave}>
        </canvas>
      </div>
    );
  }
});

global.demoHough = ReactDOM.render(<DemoHough />, document.querySelector('#demo-hough'));
