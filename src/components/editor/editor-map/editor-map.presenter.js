import React, { memo } from 'react';
import {
  Application,
  Loader,
  utils
} from 'pixi.js';
import { defineGrid, extendHex } from 'honeycomb-grid';
import { getTileFromClickEvent, paintHex, paintHexBorder } from '../../game-view/helpers';
import { buildTileImages } from './test-helper';

const editorTexture = '/tile-sprite.json';
const quadrantOrder = [
  'top:right',
  'bottom:right',
  'bottom:left',
  'top:left',
];

const canvasSize = {
  width: 500,
  height: 500,
};

const loader = Loader.shared;

let app = null;
let elem = null;
let grid = null;
let Grid = null;
let size = 50;

const setup = (options) => {
  const currentMap = (options.level && options.level.map) || [];
  const dimentions = {
    width: currentMap.length || 5,
    height: (currentMap[0] && currentMap[0].length) || 5,
  };

  // Load triangle tiles from hex tiles
  buildTileImages(options.app, () => {
    grid = options.Grid.rectangle(dimentions);

    grid.forEach(hex => {
      if (!currentMap[hex.x]) {
        currentMap[hex.x] = [];
      }
      if (!currentMap[hex.x][hex.y]) {
        currentMap[hex.x][hex.y] = {
          type: 'water',
        };
      }
    });

    options.grid = grid;
    options.map = currentMap;
    options.loader = loader;

    grid.forEach(paintHex(options));
    // paintHex(options)(grid[0]);
  });
};

const initPixiElement = (level) => (element) => {
  elem = element;
  app = new Application({
    ...canvasSize,
    antialias: true,
    transparent: false,
    view: elem,
    // resizeTo: canvasSize, // If we change this later we can adjust the size of the canvas
  });

  Grid = defineGrid(extendHex({
    size: size,
    orientation: 'pointy', // other option: 'flat'
    origin: [-2, -1],
  }));

  setup({
    app,
    Grid,
    level,
    size,
  });
};

/**
 * EditorMapPresenter
 * Contains: Canvas element for rendering map editor
*/
let hasRendered = false;
class EditorMapPresenter extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.hasTileUpdate !== this.props.hasTileUpdate) {
      const hex = grid.get(nextProps.updatedTile);
      const options = {
        app,
        grid,
        map: nextProps.level.map,
        loader,
        size,
      };
      paintHex(options)(hex);
      grid.neighborsOf(hex).forEach(paintHex(options));
      return false;
    }
    if (nextProps.sizeDisplay.x !== '' || nextProps.sizeDisplay.y !== '') {
      return true;
    }
    if (!hasRendered) {
      hasRendered = true;
      return true;
    }
    return false;
  }

  render() {
    const {
      assetState,
      // finishedAssetLoad,
      level,
      updateTile,
    } = this.props;

    if (assetState[editorTexture] !== 'loaded' || !level) {
      return null;
    }

    // Now we can run syncronously,
    // because we already waited for the assets to load

    const clickThunk = (e) => {
      const hex = getTileFromClickEvent(e, grid, Grid);
      console.log(hex);
      if (hex) {
        paintHexBorder(hex, app);
        // const tileDetails = {
        //   x: hex.x,
        //   y: hex.y,
        //   ...level.map[hex.x][hex.y],
        // };
        // updateTile(tileDetails, {
        //   type: 'land',
        // });
        // NOT rerendering the canvas, need to figure out how to trigger that
      }
    };

    return (
      <div>
        <div style={{width: '500px', marginLeft: 100}}>
          <canvas
            ref={initPixiElement(level)}
            onClick={clickThunk}
            // onMouseMove={this.mouseMove}
            width={500}
            height={500}
          ></canvas>
        </div>
      </div>
    );
  }
};

EditorMapPresenter.propTypes = {
  // updatedTile: Object
};

export {
  EditorMapPresenter,
};
