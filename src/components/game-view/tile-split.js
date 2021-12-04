let parts = [];
var img = new Image();
const sliceParts = (width, height) => {
  var cx = width / 2;
  var cy = height / 2;
  var w = width;
  var h = height;
  const sections = [];
  sections.push({
      x: 0,
      y: 0,
      points: [{
          x: w,
          y: h / 4
      }, {
          x: cx,
          y: cy
      }, {
          x: w,
          y: h / 4 * 3
      }]
  });
  sections.push({
      x: - w / 2,
      y: -h /2,
      points: [{
          x: w,
          y: h / 4 * 3
      }, {
          x: cx,
          y: cy
      }, {
          x: cx,
          y: h
      }]
  });
  sections.push({
      x: 0,
      y: 0,
      points: [{
          x: cx,
          y: h
      }, {
          x: cx,
          y: cy
      }, {
          x: 0,
          y: h / 4 * 3
      }]
  });
  sections.push({
    x: 0,
    y: 0,
    points: [{
        x: 0,
        y: h / 4
    }, {
        x: cx,
        y: cy
    }, {
        x: 0,
        y: h / 4 * 3
    }]
  });
  sections.push({
      x: 0,
      y: 0,
      points: [{
          x: 0,
          y: h / 4
      }, {
          x: cx,
          y: cy
      }, {
          x: cx,
          y: 0
      }]
  });
  sections.push({
      x: 0,
      y: 0,
      points: [{
          x: cx,
          y: 0
      }, {
          x: cx,
          y: cy
      }, {
          x: w,
          y: h / 4
      }]
  });
  return sections;
}
img.onload = (img) => {
  parts = sliceParts(img.width, img.height);
}
img.src = "http://localhost:3000/tile-icons/water-waves.tile.png";

const createCanvas = () => {
  var canvas = document.createElement("canvas");
  canvas.height = img.height;
  canvas.width = img.width;
  return canvas;
}

const sliceTile = () => {
  return parts.map(part => {
    const canvas = createCanvas();
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx, part);
    return canvas;
  });
}

function draw(ctx, part) {
    ctx.save();
    define(ctx, part);
    ctx.clip();
    ctx.drawImage(img, part.x, part.y);
    ctx.restore();
}

function define(ctx, part) {
  ctx.save();
  ctx.translate(part.x, part.y);
  ctx.beginPath();
  var startPoint = part.points[0];
  ctx.moveTo(startPoint.x, startPoint.y);
  for (var i = 0; i < part.points.length; i++) {
      var point = part.points[i];
      ctx.lineTo(point.x, point.y);
  }
  ctx.closePath();
  ctx.restore();
}

export {
  sliceParts,
  sliceTile
};