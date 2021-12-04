import { Graphics } from 'pixi.js';

const sliceParts = (width, height) => {
  var cx = width / 2;
  var cy = height / 2;
  var w = width;
  var h = height;
  const flatRight = [{
    x: cx,
    y: 0,
  }, {
    x: cx,
    y: cy,
  }, {
    x: 0,
    y: h / 4,
  }];
  const flatLeft = [{
      x: 0,
      y: 0,
  }, {
      x: cx,
      y: h / 4,
  }, {
      x: 0,
      y: cy,
  }];
  return [
    {
      x: - cx,
      y: - (h / 4),
      points: flatRight,
    },
    {
      x: - cx,
      y: - cy,
      points: flatLeft,
    },
    {
      x: 0,
      y: - cy,
      points: flatRight,
    },
    {
      x: 0,
      y: - (h / 4),
      points: flatLeft,
    },
    {
      x: 0,
      y: 0,
      points: flatRight,
    },
    {
      x: - cx,
      y: 0,
      points: flatLeft,
    }
  ];
}

const buildTileMasks = (width, height) => {
  return sliceParts(width, height).map((part, i) => {
    const maskPolygon = new Graphics();
    maskPolygon.beginFill(0x66FF33);

    if (i === 0 || i === 3) {
      maskPolygon.drawPolygon([
        part.points[0].x, part.points[0].y - 1, // First point
        part.points[1].x, part.points[1].y - 1, // Second point
        part.points[1].x, part.points[1].y, // Second point
        part.points[1].x, part.points[1].y + 1, // Second point
        part.points[2].x, part.points[2].y + 1, // Third point
      ]);
    } else {
      maskPolygon.drawPolygon([
        part.points[0].x, part.points[0].y, // First point
        part.points[1].x, part.points[1].y, // Second point
        part.points[2].x, part.points[2].y, // Third point
      ]);
    }

    // Fill shape's color
    maskPolygon.endFill();
    maskPolygon.x = part.x;
    maskPolygon.y = part.y;

    return maskPolygon;
  });
}

export {
  buildTileMasks,
}