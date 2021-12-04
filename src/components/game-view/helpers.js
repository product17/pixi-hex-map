import { BaseTexture, Container, Graphics, Sprite, Rectangle, Texture, Ticker } from 'pixi.js';
import { matchTileSprite, tileConfigs } from '../../settings';
import { sliceTile } from './tile-split';
import { buildTileMasks } from '../../packages/build-tile-masks';

let masks;
const ticker = Ticker.shared;

const cornerShiftFunc = [
  (corner, size) => {
    return {
      x: corner.x,
      y: corner.y + size / 2,
    }
  },
  (corner, size) => {
    return {
      x: corner.x,
      y: corner.y,
    }
  },
  (corner, size) => {
    return {
      x: corner.x,
      y: corner.y - size / 2,
    }
  },
  (corner, size) => {
    return {
      x: corner.x + Math.sqrt(3) / 2 * size,
      y: corner.y - size / 2,
    }
  },
  (corner, size) => {
    return {
      x: corner.x + Math.sqrt(3) / 2 * size,
      y: corner.y,
    }
  },
  (corner, size) => {
    return {
      x: corner.x + Math.sqrt(3) / 2 * size,
      y: corner.y + size / 2,
    }
  },
];

let textureCache = {};

const directionToIndex = {
  E: 0,
  SE: 1,
  SW: 2,
  W: 3,
  NW: 4,
  NE: 5,
};

const indexToDirection = ['E', 'SE', 'SW', 'W', 'NW', 'NE'];

const getTileFromClickEvent = (e, grid, Grid) => {
  const x = e.pageX - e.target.offsetLeft;
  const y = e.pageY - e.target.offsetTop;
  return grid.get(Grid.pointToHex(x, y));
}

const getTileType = (map, hex) => {
  if (map && hex) {
    const tile = map[hex.x] && map[hex.x][hex.y];
    if (tile) {
      return tile.type;
    }
  }

  return null;
}

const paintHex = (options) => {
  return (hex) => {
    const point = hex.toPoint();
    const textures = options.loader.resources;
    const tile = options.map[hex.x][hex.y];
    // const tile = {
    //   type: 'water',
    //   style: 'waves',
    // };
    if (!textures) {
      console.warn('No textures for this tile', tile);
    }
  
    // add the hex's position to each of its corner points
    const corners = hex.corners().map(corner => corner.add(point));
    corners.forEach((corner, index) => {
      const placeImage = cornerShiftFunc[index](corner, options.size);
      const neighbors = {
        north: getTileType(options.map, options.grid.neighborsOf(hex, index - 1 < 0 ? 5 : index - 1)[0]) || tile.type,
        neighbor: getTileType(options.map, options.grid.neighborsOf(hex, index)[0]) || tile.type,
        south: getTileType(options.map, options.grid.neighborsOf(hex, index + 1 > 5 ? 0 : index + 1)[0]) || tile.type,
      };
      
      let tileSprite = matchTileSprite(neighbors, tileConfigs[tile.type], tile.type);

      const name = `${indexToDirection[index]}.${tileSprite.spriteSuffix}`;
      const textureGroup = textures[name];

      if (!textureGroup) {
        console.error(new Error(`Texture ${name} does not exist`));
        return;
      }

      // console.log(name)
      // const adjustedSize = ['E', 'W'].indexOf(indexToDirection[index]) >= 0 ? options.size + 1 : options.size;

      let sprite = new Sprite(textureGroup.texture);
      sprite.x = placeImage.x;
      sprite.y = placeImage.y;
      sprite.width = Math.sqrt(3) / 2 * options.size;
      sprite.height = options.size;
      options.app.stage.addChild(sprite);
    });
  };
}

const paintHexBorder = (hex, app) => {
  const point = hex.toPoint();

  // add the hex's position to each of its corner points
  const corners = hex.corners().map(corner => corner.add(point));
  // const placeImage = cornerShiftFunc[index](corner, options.size);
  console.log(corners);

  // separate the first from the other corners
  const [firstCorner, ...otherCorners] = corners;
  const graphic = new Graphics();
  graphic.lineStyle(1, 0x999999);

  // move the "pen" to the first corner
  graphic.moveTo(firstCorner.x, firstCorner.y);
  // draw lines to the other corners
  otherCorners.forEach(({ x, y }, i) => graphic.lineTo(x, y));
  // finish at the first corner
  
  graphic.lineTo(firstCorner.x, firstCorner.y);

  app.stage.addChild(graphic);
}

export {
  cornerShiftFunc,
  directionToIndex as directionMap,
  getTileFromClickEvent,
  getTileType,
  paintHex,
  paintHexBorder,
};
