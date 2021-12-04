import {} from 'request';
export const CHANGE_MODE = 'CHANGE_MODE';
export const UPDATE_MAP_LIST = 'UPDATE_MAP_LIST';
export const SAVE_MAP = 'SAVE_MAP';
export const SET_ACTIVE_MAP = 'SET_ACTIVE_MAP';
export const SET_MAP_LIST = 'SET_MAP_LIST';
export const LOAD_MAP_LIST = 'LOAD_MAP_LIST';
export const TOGGLE_MAP_LIST = 'TOGGLE_MAP_LIST';

export const modeList = {
  view: 'view',
  edit: 'edit',
};

function postData(url = '', data = {}) {
  // Default options are marked with *
  return fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
  }).then(response => response.json()); // parses JSON response into native JavaScript objects 
}

function getMap(url = '') {
  return fetch(url).then(res => res.json());
}

export function changeMode(mode) {
  return {
    type: CHANGE_MODE,
    mode,
  };
};

export function newMap() {
  return {
    type: UPDATE_MAP_LIST,
    map: {
      name: '',
    },
  };
};

export function saveMap(map) {
  console.log(map);
  postData(`http://localhost:1337/map/${map.name || ''}`, map).then(data => {
    console.log(JSON.stringify(data));
  });

  return {
    type: SAVE_MAP,
    map,
  };
};

export function setActiveMap(map) {
  return {
    type: SET_ACTIVE_MAP,
    map,
  };
};

export function setMapList() {
  return {
    type: SET_MAP_LIST,
    mapList: [
      {
        name: 'First Map',
        id: 1,
      },
      {
        name: 'Second Map',
        id: 2,
      },
    ],
  };
};

export function loadMapList() {
  return {
    type: LOAD_MAP_LIST,
    loadingMaps: true,
  };
};

export function toggleMapList() {
  return {
    type: TOGGLE_MAP_LIST,
  };
};