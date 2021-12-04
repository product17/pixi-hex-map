import { activeMapReducer } from './editor';
import { menuReducer } from './menu';

const initialState = {};

export function appReducer(state = initialState, action) {
  return {
    editor: activeMapReducer(state.editor, action),
    menu: menuReducer(state.menu, action),
  };
};