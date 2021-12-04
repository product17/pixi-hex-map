import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';

import './map-selector.styles.css';

const MapSelectorPresenter = ({ display, levelList, newMap, selectLevel }) => {
  if (!display) return null;
  return (
    <div
      className='position-absolute'
      style={{
        height: `${40 * levelList.length + 40}px`,
        marginTop: `-${40 * levelList.length + 40}px`,
      }}
    >
      <ul>
        {
          levelList.map(level => {
            return (
              <li
                className='map-selector'
                key={level.id}
                // onClick={selectLevel(level)}
              >
                <Link to={`/editor/${level.id}`}>
                  {level.name}
                </Link>
              </li>
            );
          })
        }
        <li
          className='btn btn-primary'
          key='new-item'
          onClick={newMap}
        >New Map +</li>
      </ul>
    </div>
  );
};

MapSelectorPresenter.propTypes = {
  levelList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  selectLevel: PropTypes.func.isRequired,
}

export {
  MapSelectorPresenter,
}
