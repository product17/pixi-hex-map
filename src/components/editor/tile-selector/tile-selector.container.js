import { connect } from 'react-redux';
import { setAssetState, updateTileHoverState } from '../../../store/editor';
import { TileSelectorPresenter } from './tile-selector.presenter';

const mapStateToProps = state => {
  return {
    ...state.editor,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAssetState: (assetState) => {
      dispatch(setAssetState(assetState));
    },
    updateTileHoverState: (tile, color) => {
      return () => {
        dispatch(updateTileHoverState(tile, color));
      }
    },
  }
};

export const TileSelectorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TileSelectorPresenter);
