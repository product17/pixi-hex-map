import { connect } from 'react-redux';
import {
  selectLevel,
  setAssetState,
  updateGridSize,
  updateName,
  updateTileHoverState,
  updateMapStatus,
} from '../../../store/editor';
import { EditorControlsPresenter } from './editor-controls.presenter';

const mapStateToProps = state => {
  return {
    ...state.editor,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectLevel: (id) => {
      dispatch(updateMapStatus('loading'));
      fetch(`http://localhost:1337/map/${id}`).then(res => res.json()).then(data => {
        dispatch(selectLevel(data));
        dispatch(updateMapStatus('loaded'));
      });
    },
    setAssetState: (assetState) => {
      dispatch(setAssetState(assetState));
    },
    updateGridXSize: (ySize) => {
      return (e) => {
        dispatch(updateGridSize({
          x: parseInt(e.target.value) || '',
          y: ySize,
        }));
      }
    },
    updateGridYSize: (xSize) => {
      return (e) => {
        dispatch(updateGridSize({
          x: xSize,
          y: parseInt(e.target.value) || '',
        }));
      }
    },
    updateName: (name) => {
      return () => {
        dispatch(updateName(name));
      };
    },
    updateTileHoverState: (tile, color) => {
      return () => {
        dispatch(updateTileHoverState(tile, color));
      }
    },
  };
};

export const EditorControlsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorControlsPresenter);
