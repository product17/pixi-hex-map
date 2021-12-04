import { Application, Sprite } from 'pixi.js';
import { tileConfigs } from '../../settings';

export function generateTile(options) {
  const app = new Application({
    width: Math.sqrt(3) * options.size,
    height: options.size * 2,
    antialias: true,
    transparent:true,
  });

  const tileSprite = options.textures[tileConfigs.tileTypes[options.type].sprite];

  for (let i = 0; i < 6; i++) {
    const tile = new Sprite(tileSprite);
    tile.x = Math.sqrt(3) / 2 * options.size;
    tile.y = options.size;
    tile.width = Math.sqrt(3) / 2 * options.size;
    tile.height = options.size;
    tile.rotation = 1.047 * (i - 1);
    app.stage.addChild(tile);
  }

  return app;
}