import React from 'react';
import { Col, Form } from 'react-bootstrap';
import { Loader } from 'pixi.js';
import { EditorMapContainer } from '../editor-map';
import { TileSelectorContainer } from '../tile-selector';

// const editorTexture = '/spritesheet.json'; // Should be in constants file
const editorTexture = '/tile-sprite.json'; // Should be in constants file
const loader = Loader.shared;
let loading = false;

const EditorControlsPresenter = ({
  assetState, 
  id,
  level,
  mapStatus,
  selectLevel,
  setAssetState,
  sizeDisplay,
  updateGridXSize,
  updateGridYSize,
}) => {
  if (!level && mapStatus === 'notLoaded') {
    selectLevel(id);
  };
  if (assetState[editorTexture] !== 'loaded' && !loading) {
    loading = true;
    loader.add(editorTexture).load((t) => {
      setAssetState({
        name: editorTexture,
        state: 'loaded',
      });
    });
    setAssetState({
      name: editorTexture,
      state: 'loading',
    });

    return null;
  }

  // Don't render without the assets being loaded
  if (assetState[editorTexture] !== 'loaded' || !level) {
    return null;
  }

  return (
    <div>
      <p>Control Layer</p>
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Control
              type='text'
              placeholder='X'
              value={sizeDisplay.x === null ? level.map.length : sizeDisplay.x}
              onChange={updateGridXSize(level.map[0].length)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Control
              type='text'
              placeholder='Y'
              value={sizeDisplay.y === null ? level.map[0].length : sizeDisplay.y}
              onChange={updateGridYSize(level.map.length)}
            />
          </Form.Group>
        </Form.Row>
      </Form>
      <TileSelectorContainer />
      <EditorMapContainer />
    </div>
  );
};

EditorControlsPresenter.propTypes = {};

export {
  EditorControlsPresenter,
};
