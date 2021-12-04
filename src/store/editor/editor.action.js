import {} from 'request';
export const ASSET_STATE = 'ASSET_STATE';
export const SELECT_LEVEL = 'SELECT_LEVEL';
export const UPDATE_GRID_SIZE = 'UPDATE_GRID_SIZE';
export const UPDATE_NAME = 'UPDATE_NAME';
export const UPDATE_MAP_STATUS = 'UPDATE_MAP_STATUS';
export const UPDATE_TILE = 'UPDATE_TILE';
export const UPDATE_TILE_STYLE = 'UPDATE_TILE_STYLE';

export function setAssetState(assetState) {
  return {
    type: ASSET_STATE,
    assetState: assetState,
  };
};

export function selectLevel(level) {
  return {
    type: SELECT_LEVEL,
    level,
  };
};

export function updateMapStatus(status) {
  return {
    type: UPDATE_MAP_STATUS,
    status,
  };
};

export function updateTile(updatedTile) {
  return {
    type: UPDATE_TILE,
    tile: updatedTile,
  };
};

export function updateGridSize(size) {
  return {
    type: UPDATE_GRID_SIZE,
    size,
  }
}

export function updateName(name) {
  return {
    type: UPDATE_NAME,
    name,
  };
};

export function updateTileHoverState(tile, color) {
  return {
    type: UPDATE_TILE_STYLE,
    color,
    tile,
  };
};
