import {
  ASSET_STATE,
  SELECT_LEVEL,
  UPDATE_GRID_SIZE,
  UPDATE_MAP_STATUS,
  UPDATE_NAME,
  UPDATE_TILE,
  UPDATE_TILE_STYLE,
} from './editor.action';

const initialState = {
  assetState: {},
  gridSize: 30,
  hasTileUpdate: 0,
  level: null,
  mapStatus: 'notLoaded',
  sizeDisplay: {
    x: null,
    y: null,
  },
  tileHoverState: {},
  updatedTile: null,
};

export function activeMapReducer(state = initialState, action) {
  switch(action.type) {
    case ASSET_STATE:
      const updatedState = {
        ...state,
      };
      updatedState.assetState = {
        ...state.assetState,
      };

      // Keep the state under the name
      updatedState.assetState[action.assetState.name] = action.assetState.state;
      return updatedState;
    case SELECT_LEVEL:
      return {
        ...state,
        level: action.level,
      };
    case UPDATE_GRID_SIZE:
      const size = {
        x: action.size.x || state.level.map.length,
        y: action.size.y || state.level.map[0].length,
      };
      // This is simply a display for resetting
      if (!action.size.x || !action.size.y) {
        return {
          ...state,
          sizeDisplay: action.size,
        };
      }

      let map = state.level.map.filter((x, i) => {
        if (i < action.size.x) {
          return x.filter((y, j) => {
            if (j < size.y) {
              return true;
            }
  
            return false;
          });
        }

        return false;
      });
      console.log(map);

      // Add to X length
      while (map.length < size.x) {
        map.push(Array.apply({
          type: 'water',
        }, Array(size.y)));
      }

      // Add to Y length
      while (map[0].length < size.y) {
        map = map.map(y => {
          y.push({
            type: 'water',
          });
          return y;
        });
      }
      return {
        ...state,
        level: {
          ...state.level,
          map,
        },
        sizeDisplay: {
          x: map.length,
          y: map[0].length,
        },
      };
    case UPDATE_MAP_STATUS:
      return {
        ...state,
        mapStatus: action.status,
      };
    case UPDATE_NAME:
      return {
        ...state,
        level: {
          ...state.map,
          name: action.name,
        },
      };
    case UPDATE_TILE:
      const level = {
        ...state.level
      };
      level.map[action.tile.x][action.tile.y] = action.tile;
      return {
        ...state,
        level: level,
        updatedTile: action.tile,
        hasTileUpdate: state.hasTileUpdate + 1,
      };
    case UPDATE_TILE_STYLE:
      const nextState = {
        ...state,
        tileHoverState: {
          ...state.tileHoverState,
        },
      };
      nextState.tileHoverState[action.tile] = action.color;
      return nextState;
    default:
      return state;
  }
};
