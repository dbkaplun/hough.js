import hough, {defaultCanvasFactory} from '..';

let inputImage = document.querySelector('#input');
inputImage.addEventListener('load', () => {
  let {width, height} = inputImage;
  let inputCtx = defaultCanvasFactory(width, height).getContext('2d');
  inputCtx.drawImage(inputImage, 0, 0, width, height);
  let inputData = inputCtx.getImageData(0, 0, width, height);

  let outputCanvas = document.querySelector('#output');
  outputCanvas.getContext('2d').putImageData(hough(inputData, outputCanvas), 0, 0);
});
