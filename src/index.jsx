import React from 'react';
import ReactDOM from 'react-dom';
import hough, {xyToRhoTheta, newCanvas} from '..';
import _ from 'lodash';

export const houghImageMem = _.memoize((image, ...args) => {
  let {width, height} = image;
  let tmpCtx = newCanvas(width, height).getContext('2d');
  tmpCtx.drawImage(image, 0, 0, width, height);
  return hough(tmpCtx.getImageData(0, 0, width, height), ...args);
});

export function newImage (opts) {
  return new Promise((resolve, reject) => {
    let img = _.merge(new Image(), opts);
    img.addEventListener('load', ()=>resolve(img), true);
    img.addEventListener('error', reject, true);
  });
};

export function getOffset (evt) {
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
};

export const DemoHough = React.createClass({
  getInitialState () {
    return {
      input: 'test/data/rosettacode-pentagon/input.png',
      outputSize: {width: 480, height: 360},
      houghArgs: [],
    };
  },
  onOutputMouseMove (evt) { this.setState({mouse: getOffset(evt)}); },
  onOutputMouseLeave ()   { this.setState({mouse: null}); },
  renderCanvas () {
    let {input, lines, output} = this.refs;
    if (!input) return;
    let linesCtx = lines.getContext('2d');
    let outputCtx = output.getContext('2d');
    linesCtx.clearRect(0, 0, lines.width, lines.height);
    outputCtx.clearRect(0, 0, output.width, output.height);

    let {outputSize, houghArgs} = this.state;
    let {width, height} = input;
    _.merge(lines, {width, height});
    let houghed = houghImageMem(input, outputSize, ...houghArgs);
    outputCtx.putImageData(houghed, 0, 0);

    let {mouse} = this.state;
    if (!mouse) return;
    let {x, y} = mouse;
    let {rho, th} = xyToRhoTheta(input, houghed, x, y);
    // line equation is rho = cos(th)x + sin(th)y
    // solve for moveTo/lineTo coords at x = 0 and x = width
    linesCtx.beginPath();
    linesCtx.moveTo(0,     rho/Math.sin(th));
    linesCtx.lineTo(width, (rho - width*Math.cos(th))/Math.sin(th));
    linesCtx.stroke();
  },
  render () {
    let {outputSize: {width, height}} = this.state;
    _.defer(this.renderCanvas);
    return (
      <div>
        <h1>hough.js <small><a href="https://github.com/dbkaplun/hough.js">Github</a></small></h1>

        <h2>Input</h2>
        <div style={{position: 'relative'}}>
          <img ref="input"
            src={this.state.input}
            onLoad={this.renderCanvas} />
          <canvas ref="lines"
            width={_.get(this.refs, 'input.width', 0)}
            height={_.get(this.refs, 'input.height', 0)}
            style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}>
          </canvas>
        </div>

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

export const demoHough = ReactDOM.render(<DemoHough />, document.querySelector('#demo-hough'));

global.demoHough = demoHough;
