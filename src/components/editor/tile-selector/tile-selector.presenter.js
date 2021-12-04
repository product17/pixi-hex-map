import React from 'react';
import { Loader } from 'pixi.js';
import { generateTile } from '../../../packages/generate-tile';

const editorTexture = '/spritesheet.json';
const loader = Loader.shared;
const renderedTiles = {};
let loading = false;
let textures = null;

const myElem = (size, textures, tileType) => (elem) => {
  if (!elem || renderedTiles[tileType] || !textures) return;
  // Should take 
  // size, textures as params
  const tile = generateTile({
    size,
    textures,
    type: tileType === 'land' ? 'fullBeach': 'water',
  });

  const img = tile.renderer.extract.image(tile.stage);
  elem.appendChild(img);
  renderedTiles[tileType] = tile;
}

const TileSelectorPresenter = ({
  assetState,
  gridSize,
  level,
  setAssetState,
  tileHoverState,
  updateTileHoverState,
}) => {
  if (!level || !assetState[editorTexture] || assetState[editorTexture] !== 'loaded') {
    return null
  };

  return (
    <div>
      <div
        style={{height: 60, width: 52, backgroundColor: tileHoverState['land'] || ''}}
        ref={myElem(gridSize, textures, 'land')}
        onMouseEnter={updateTileHoverState('land', '#dfdfdf')}
        onMouseLeave={updateTileHoverState('land', '')}
      ></div>
      <div
        style={{height: 60, width: 52, backgroundColor: tileHoverState['water'] || ''}}
        ref={myElem(gridSize, textures, 'water')}
        onMouseEnter={updateTileHoverState('water', '#dfdfdf')}
        onMouseLeave={updateTileHoverState('water', '')}
      ></div>
    </div>
  );
};

TileSelectorPresenter.propTypes = {};

export {
  TileSelectorPresenter,
};
