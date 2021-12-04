import { connect } from 'react-redux';
import { selectLevel } from '../../store/editor';
import { newMap, setActiveMap, toggleMapList } from '../../store/menu';
import { MapSelectorPresenter } from './map-selector.presenter';

const mapStateToProps = state => {
  return {
    ...state.menu,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectLevel: (map) => {
      return () => {
        dispatch(toggleMapList());
        fetch(`http://localhost:1337/map/${encodeURIComponent(map.name) || ''}`).then(res => res.json()).then(data => {
          dispatch(selectLevel(data));
        });
        dispatch(setActiveMap(map));
      };
    },
    newMap: () => {
      dispatch(newMap());
    }
  }
};

export const MapSelectorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapSelectorPresenter);
