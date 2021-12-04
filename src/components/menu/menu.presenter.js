import React from 'react';
// import PropTypes from 'prop-types';
import { MapSelectorContainer } from '../map-selector';

const MenuPresenter = ({
  loadMapList,
  map,
  levelList,
  saveMap,
  showMapList,
  toggleMapList,
}) => {
  return (
    <div
      className='row'
      style={{
        background: '#dfdfdf',
      }}
    >
      <MapSelectorContainer
        display={showMapList}
      />
      <div className='col-12'>
        <button
          type='button'
          className='btn btn-primary float-right'
          style={{
            margin: '0 1px',
          }}
          onClick={() => {
            toggleMapList();
            if (!levelList.length) {
              loadMapList();
            }
          }}
        >Maps</button>
        <button
          type='button'
          className={`btn btn-success float-right`}
          style={{
            display: !!map ? 'visible' : 'hidden',
            margin: '0 1px',
          }}
          onClick={saveMap(map === null ? '' : map)}
        >Save</button>
      </div>
    </div>
  );
};

MenuPresenter.propTypes = {
}

export {
  MenuPresenter,
}
