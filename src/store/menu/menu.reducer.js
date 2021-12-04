import {
  CHANGE_MODE,
  LOAD_MAP_LIST,
  modeList,
  SAVE_MAP,
  SET_MAP_LIST,
  TOGGLE_MAP_LIST,
  UPDATE_MAP_LIST,
} from './menu.action';
import {
  level1,
  level2,
} from '../../settings';

const initialState = {
  mode: modeList.view,
  showMapList: false,
  levelList: [
    level1,
    level2,
  ],
};

export function menuReducer(state = initialState, action) {
  switch(action.type) {
    case CHANGE_MODE:
      return {
        ...state,
        mode: action.mode,
      };
    case LOAD_MAP_LIST:
      return {
        ...state,
        loadingMaps: action.loadingMaps,
      };
    case SAVE_MAP:
      return {
        ...state,
        mapList: state.levelList.map(map => {
          if (map.id === action.map.id) {
            return action.map;
          }
          return map;
        }),
      }
    case SET_MAP_LIST:
      return {
        ...state,
        loadingMaps: false,
        mapList: action.mapList,
      };
    case TOGGLE_MAP_LIST:
      return {
        ...state,
        showMapList: !state.showMapList, // toggle map list open/closed
      };
    case UPDATE_MAP_LIST:
      return {
        ...state,
        mapList: state.levelList.concat(action.mapList),
      };
    default:
      return state;
  }
};
