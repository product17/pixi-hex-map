import { connect } from 'react-redux';
import { updateTile } from '../../../store/editor';
import { EditorMapPresenter } from './editor-map.presenter';

const mapStateToProps = state => {
  return {
    ...state.editor,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateTile: (tile, update) => {
      dispatch(updateTile({
        ...tile,
        ...update,
      }));
    },
    placeTile: (coords) => {
      return () => {
        console.log(coords);
        // dispatch(selectMap(map));
      };
    },
  }
};

export const EditorMapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorMapPresenter);
