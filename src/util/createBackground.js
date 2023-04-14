/**
 * Creates a canvas element with a background pattern and text.
 * @param {number} canvasWidth - The width of the canvas in pixels.
 * @returns {string} The canvas element as a data URL encoded as a PNG image.
 */
export const createBackground = (canvasWidth) => {
  // create canvas element
  const canvas = document.createElement("canvas");
  
  // set dimensions of canvas
  canvas.width = canvasWidth;
  canvas.height = 48;
  
  // create 2D context for canvas
  const ctx = canvas.getContext("2d");
  
  // set line style for grid
  ctx.lineWidth = 1;
  ctx.strokeStyle = "white";
  
  // draw horizontal grid lines spaced 4 pixels apart
  for (let y = 0; y < 100; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // set text style for canvas
  ctx.fillStyle = '#888';
  ctx.font = 'italic 11px sans-serif';
  ctx.textAlign = 'right';
  
  // add text to canvas
  ctx.fillText('boombot equalizer', canvas.width - 10, 12);

  // return canvas as a data URL encoded as a PNG image
  return canvas.toDataURL("image/png");
}
 