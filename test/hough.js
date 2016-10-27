import test from 'ava';
import {Image} from 'canvas';
import fs from 'fs';

import hough, {defaultCanvasFactory} from '..';

test("rosettacode-pentagon", t => {
  const inputBuf = fs.readFileSync('data/rosettacode-pentagon/input.png');
  const expected = fs.readFileSync('data/rosettacode-pentagon/output-480x360.png');
  const outputSize = {width: 480, height: 360};

  let inputImage = new Image();
  inputImage.src = inputBuf;
  let {width, height} = inputImage;
  let inputCtx = defaultCanvasFactory(width, height).getContext('2d');
  inputCtx.drawImage(inputImage, 0, 0, width, height);
  let inputData = inputCtx.getImageData(0, 0, width, height);

  let outputCanvas = defaultCanvasFactory(outputSize.width, outputSize.height);
  outputCanvas.getContext('2d').putImageData(hough(inputData, outputSize), 0, 0);
  const actual = outputCanvas.toBuffer();

  t.is(Buffer.compare(expected, actual), 0);
});
