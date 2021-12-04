import {
  Application,
  Loader,
  Sprite,
  Ticker,
} from 'pixi.js';
import { buildTileMasks } from '../../../packages/build-tile-masks';

const loader = Loader.shared;
const indexToDirection = ['E', 'SE', 'SW', 'W', 'NW', 'NE'];
const ticker = Ticker.shared;

class Queue {
  add(item) {
    this.list.push(item);
  };
  done = null;
  list = [];
  next() {
    setTimeout(() => {
      if (!this.list.length) {
        if (this.done) {
          this.done();
        }
        return;
      }

      this.list.shift()();
      this.next()
    }, 50);
  }
  start(done) {
    this.done = done;
    this.next();
  }
}

const queue = new Queue();

const buildTileImages = (app, done) => {
  const textures = loader.resources['/tile-sprite.json'].textures;
  const textureKeys = Object.keys(textures);
  const tmpApp = new Application({
    width: textures[textureKeys[0]].width / 2,
    height: textures[textureKeys[0]].height / 2,
    transparent: true,
  });

  textureKeys.forEach(tileName => {
    const loadedTexture = textures[tileName];
    const masks = buildTileMasks(loadedTexture.width, loadedTexture.height);

    masks.forEach((mask, i) => {
      let sprite = new Sprite(loadedTexture);
      sprite.x = mask.x;
      sprite.y = mask.y;
      sprite.width = loadedTexture.width;
      sprite.height = loadedTexture.height;
      sprite.mask = mask;

      // Trim the mask
      queue.add(() => {
        tmpApp.stage.addChild(sprite);
        ticker.addOnce(() => {
          const cachedIndex = i;
          const cachedTileName = tileName;
          const image = tmpApp.renderer.extract.image();
          const name = `${indexToDirection[cachedIndex]}.${cachedTileName}`;

          // Load the sprite into the cache
          loader.add(name, image.src);
          tmpApp.stage.removeChild(sprite); // Remove this sprite to prevent it from showing in next render
        })
      });
    });
  });
  queue.start(done);
};

export {
  buildTileImages
}