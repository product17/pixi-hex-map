import { Application, Sprite, utils, Graphics, Rectangle } from 'pixi.js';
import { defineGrid, extendHex } from 'honeycomb-grid';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { cornerShiftFunc } from './helpers';
import { tileConfigs, matchTileSprite } from '../../settings';

// Styles
import './game-view.css';

const map = [];

const canvasPos = {
  left: 100,
  top: 0,
};
const quadrantOrder = [
  'top:right',
  'bottom:right',
  'bottom:left',
  'top:left',
];

const directionMap = {
  E: 0,
  SE: 1,
  SW: 2,
  W: 3,
  NW: 4,
  NE: 5,
};

const TextureCache = utils.TextureCache;

export class GameView extends React.Component {
  pixiTiles = {};
  pixiApps = {};

  constructor(props) {
    super(props);

    // Initialize first so it can be read in the constructor
    this.state = {
      app: new Application({
        width: 500,
        height: 600,
        antialias: true,
        transparent:false,
      }),
      mapName: '',
      level: props.level || {
        map: [],
        name: 'New Level'
      },
      hex: extendHex({
        size: 30,
        orientation: 'pointy', // other option: 'flat'
        origin: [-2, -1],
      }),
      size: 30,
      selectedTileType: 'water',
      augmentTile: '',
    };

    this.Grid = defineGrid(this.state.hex);
    this.graphics = new Graphics();
    this.graphics.lineStyle(1, 0x999999);
    this.pixi_cnt = null;

    this.state.app.loader
        .add('/spritesheet.json')
        .load(this.setup);
  }

  setup = () => {
    const newMap = !this.props.level;
    const currentMap = (this.props.level && this.props.level.map) || [];
    const dimentions = {
      width: currentMap.length || 5,
      height: (currentMap[0] && currentMap[0].length) || 5,
    };
    this.grid = this.Grid.rectangle(dimentions);
    if (newMap) {
      this.grid.forEach(hex => {
        if (!currentMap[hex.x]) {
          currentMap[hex.x] = [];
        }
        if (!currentMap[hex.x][hex.y]) {
          currentMap[hex.x][hex.y] = {
            type: 'water',
          };
        }
      });
    }

    this.setState({
      level: {
        ...this.state.level,
        map: currentMap,
      },
    }, () => {
      this.grid.forEach(this.paintHex);
    });
  };

  paintHex = (hex, i) => {
    const tile = this.state.level.map[hex.x][hex.y] || {
      type: 'water',
    };
    // if (!tile) return;

    const textures = this.state.app.loader.resources['/spritesheet.json'].textures;
    const point = hex.toPoint();

    // add the hex's position to each of its corner points
    const corners = hex.corners().map(corner => corner.add(point));

    // separate the first from the other corners
    const [firstCorner, ...otherCorners] = corners;

    // move the "pen" to the first corner
    this.graphics.moveTo(firstCorner.x, firstCorner.y);
    // draw lines to the other corners
    otherCorners.forEach(({ x, y }) => this.graphics.lineTo(x, y));
    // finish at the first corner
    this.graphics.lineTo(firstCorner.x, firstCorner.y);

    this.state.app.stage.addChild(this.graphics);

    corners.forEach((corner, index) => {
      const placeImage = this.cornerShift(index, corners[0]);

      const neighbors = {
        north: this.getTileType(this.grid.neighborsOf(hex, index - 1 < 0 ? 5 : index - 1)[0]),
        neighbor: this.getTileType(this.grid.neighborsOf(hex, index)[0]),
        south: this.getTileType(this.grid.neighborsOf(hex, index + 1 > 5 ? 0 : index + 1)[0]),
      };
      let tileSprite = matchTileSprite(neighbors, tileConfigs[tile.type], tile.type);

      if (tile.type === 'land' && tile.augment && tile.augment.type === 'dock' && directionMap[tile.augment.direction] === index) {
        tileSprite = 'dock.png';
      }

      const sprite = new Sprite(textures[tileSprite]);
      sprite.x = placeImage.x;
      sprite.y = placeImage.y;
      sprite.width = Math.sqrt(3) / 2 * this.state.size + 1;
      sprite.height = this.state.size + 1;
      sprite.rotation = 1.047 * (index - 1);
      this.state.app.stage.addChild(sprite);
    });
  }

  getTileType(hex) {
    if (hex) {
      const tile = this.state.level.map[hex.x][hex.y];
      if (tile) {
        return tile.type;
      }
    }
    return null;
  }

  initPixiElement = (element) => {
    // the element is the DOM object that we will use as container to add pixi stage(canvas)
    
    this.pixi_cnt = element;
    //now we are adding the application to the DOM element which we got from the Ref.

    if (this.pixi_cnt && this.pixi_cnt.children.length <= 0) {
      
      this.pixi_cnt.appendChild(this.state.app.view);
    }
  }

  initTileElement = type => {
    return element => {
      this.pixiTiles[type] = element;

      if (this.pixiTiles[type] && this.pixiTiles[type].children.length <= 0) {
        this.pixiApps[type] = new Application({
          width: Math.sqrt(3) * this.state.size,
          height: this.state.size * 2,
          antialias: true,
          transparent:true,
        });

        this.pixiTiles[type].appendChild(this.pixiApps[type].view);

        this.pixiApps[type].loader
          .add('/spritesheet.json')
          .load(this.renderTileElement(type));
      }
    }
  }

  renderTileElement(type) {
    return () => {
      const textures = this.pixiApps[type].loader.resources['/spritesheet.json'].textures;
      const tileSprite = textures[tileConfigs.tileTypes[type === 'dock' ? 'fullBeach' : type].sprite];
      const dockSprite = textures[tileConfigs.tileTypes[type].sprite];

      for (let i = 0; i < 6; i++) {
        const tile = new Sprite(!i && type === 'dock' ? dockSprite : tileSprite);
        tile.x = Math.sqrt(3) / 2 * this.state.size;
        tile.y = this.state.size;
        tile.width = Math.sqrt(3) / 2 * this.state.size;
        tile.height = this.state.size;
        tile.rotation = 1.047 * (i - 1);
        this.pixiApps[type].stage.addChild(tile);
      }
    }
  }

  cornerShift(index, corner) {
    return cornerShiftFunc[index](corner, this.state.size);
  }

  shiftPointByOrigin(hex) {
    const origin = hex.center();
    const point = hex.toPoint();
    return {
      x: origin.x + point.x,
      y: origin.y + point.y,
    };
  }

  makeLine(hex, cornerIndex, testX) {
    const centPos = this.shiftPointByOrigin(hex);
    const corner = hex.corners()[cornerIndex].add(hex.toPoint());
    const rise = corner.y - centPos.y;
    const run = corner.x - centPos.x;
    const m = rise / run;
    const b = centPos.y - (m * centPos.x);
    return m * testX + b;
  }

  getQuadrant(center, point) {
    const centerPoint = this.shiftPointByOrigin(center);
    const quad = `${point.y < centerPoint.y ? 'top' : 'bottom'}:${point.x > centerPoint.x ? 'right' : 'left'}`;
    switch(quad) {
      case quadrantOrder[0]: // top:right
        return this.makeLine(center, 0, point.x) > point.y ? 'NE' : 'E';
      case quadrantOrder[1]: // bottom:right
        return this.makeLine(center, 1, point.x) > point.y ? 'E' : 'SE';
      case quadrantOrder[2]: // bottom:left
        return this.makeLine(center, 3, point.x) > point.y ? 'W' : 'SW';
      default: // top:left
        return this.makeLine(center, 4, point.x) > point.y ? 'NW' : 'W';
    }
  }

  mouseMove = (e) => {
    if (this.state.augmentHover) {
      const x = e.pageX - canvasPos.left;
      const y = e.pageY - canvasPos.top;
      const calcPoint = this.grid.get(this.state.augmentHover.hex);
      const direction = this.getQuadrant(calcPoint, {x, y});
      if (this.state.augmentHover.direction !== direction) {
        const hex = this.state.augmentHover.hex;
        const tile = this.state.level.map[hex.x][hex.y];
        tile.augment.direction = direction;
        this.setState({
          augmentHover: {
            ...this.state.augmentHover,
            direction: direction,
          },
        });
        this.paintHex(hex);
        this.grid.neighborsOf(hex).forEach(this.paintHex);
      }
    }
  }

  clickHandler = (e) => {
    if (!this.state.selectedTileType) return;

    const x = e.pageX - canvasPos.left;
    const y = e.pageY - canvasPos.top;
    const hex = this.grid.get(this.Grid.pointToHex(x, y));
    const tile = this.state.level.map[hex.x][hex.y];
    if (this.state.augmentTile) {
      tile.augment = {
        type: this.state.augmentTile,
        direction: 'NE',
      };
      if (this.state.augmentHover) {
        this.setState({
          augmentHover: null,
          augmentTile: '',
          selectedTileType: null,
        });
      } else {
        this.setState({
          augmentHover: {
            hex,
            direction: 'NE',
          },
        });
      }
    } else {
      tile.type = this.state.selectedTileType;
    }
    
    this.paintHex(hex);
    this.grid.neighborsOf(hex).forEach(this.paintHex);
  }

  switchSelectedTileType(type) {
    return () => {
      this.setState({
        selectedTileType: type,
        augmentTile: '',
      });
    }
  }

  selectAugmentType(augment) {
    return () => {
      this.setState({
        augmentTile: augment,
      });
    };
  }

  handleChange = (e) => {
    this.setState({
      mapName: e.target.value,
    });
  }

  handleSave = () => {
    this.postData(`http://localhost:1337/map/${this.state.mapName}`, map).then(data => {
      console.log(JSON.stringify(data));
    });
  }

  postData(url = '', data = {}) {
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
    })
    .then(response => response.json()); // parses JSON response into native JavaScript objects 
  }

  render() {
    return (
      <div>
        <div className='action-list'>
          <h5>Tiles:</h5>
          <Form.Control
            type="email"
            placeholder="Map Name"
            value={this.state.mapName}
            onChange={this.handleChange}
          />
          <Button onClick={this.handleSave}>Save</Button>
          <div
            ref={this.initTileElement('water')}
            className='tile-btn'
            onClick={this.switchSelectedTileType('water')}
          ></div>
          <div
            ref={this.initTileElement('fullBeach')}
            className='tile-btn'
            onClick={this.switchSelectedTileType('land')}
          ></div>
          <div
            ref={this.initTileElement('dock')}
            className='tile-btn'
            onClick={this.selectAugmentType('dock')}
          ></div>
        </div>
        <div
          ref={this.initPixiElement}
          onClick={this.clickHandler}
          onMouseMove={this.mouseMove}
          style={{width: '500px', marginLeft: canvasPos.left}}
        ></div>
      </div>
    );
  };
}

export default GameView;
