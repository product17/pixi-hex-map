import { connect } from 'react-redux';
import { loadMapList, saveMap, setMapList, toggleMapList } from '../../store/menu';
import { MenuPresenter } from './menu.presenter';

const mapStateToProps = state => {
  return {
    ...state.menu,
    ...state.editor,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadMapList: () => { // Load all maps
      // Fake API, can't load request... not feeling like figuring out how to request without interwebs...
      setTimeout(() => {
        dispatch(setMapList());
      }, Math.random() * 500);
      dispatch(loadMapList());
    },
    saveMap: (map) => {
      return () => {
        dispatch(saveMap(map));
      }
    },
    toggleMapList: () => {
      dispatch(toggleMapList());
    }
  }
};

export const MenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuPresenter);
