const tileConfigs = {
  tileTypes: {
    fullBeach: {
      description: 'Display a beach',
      edgeTypes: ['water'],
      edgeTiles: ['water'],
      match: {
        north: ['water', 'land'],
        neighbor: ['water'],
        south: ['water', 'land'],
      },
      type: 'land',
      style: 'beach',
    },
    beachCornerNorth: {
      description: 'Counter corner beach tile',
      edgeTypes: ['land'],
      edgeTiles: ['edgeBeach'],
      match: {
        north: ['land'],
        neighbor: ['land'],
        south: ['water'],
      },
      type: 'land',
      style: 'beach-right-corner',
    },
    beachCornerSouth: {
      description: 'Clock corner beach tile',
      edgeTypes: ['land'],
      edgeTiles: ['edgeBeach'],
      match: {
        north: ['water'],
        neighbor: ['land'],
        south: ['land'],
      },
      type: 'land',
      style: 'beach-counter-corner',
    },
    doubleBeachCorner: {
      description: 'Double corner beach tile',
      edgeTypes: ['land'],
      edgeTiles: ['doubleEdgeBeach'],
      match: {
        north: ['water'],
        neighbor: ['land'],
        south: ['water'],
      },
      type: 'land',
      style: 'beach-double-corner',
    },
    grass: {
      description: 'Grass',
      edgeTypes: ['land'],
      edgeTiles: ['grass'],
      match: {
        north: ['land'],
        neighbor: ['land'],
        south: ['land'],
      },
      type: 'land',
      style: 'grass',
    },
    water: {
      description: 'Just some water',
      edgeTypes: ['water', 'land'],
      edgeTiles: ['land'],
      match: {
        north: ['water', 'land'],
        neighbor: ['water', 'land'],
        south: ['water', 'land'],
      },
      type: 'water',
      style: 'waves',
    },
    dock: {
      description: 'Dock to a port',
      edgeTypes: ['water'],
      edgeTiles: ['land'],
      match: {
        north: ['water', 'land'],
        neighbor: ['water', 'land'],
        south: ['water', 'land'],
      },
      type: 'land',
      style: 'dock',
    },
  }
};

Object.keys(tileConfigs.tileTypes).forEach(type => {
  const config = tileConfigs.tileTypes[type];
  if (!tileConfigs[config.type]) {
    tileConfigs[config.type] = [];
  }

  tileConfigs[config.type].push({
    ...config.match,
    spriteSuffix: `${config.type}.${config.style}.tile.png`,
  });
});

function matchTileSprite(tileSet, matches, currentType) {
  tileSet.north = tileSet.north || currentType;
  tileSet.neighbor = tileSet.neighbor || currentType;
  tileSet.south = tileSet.south || currentType;
  
  return matches.find(matchSet => {
    if (
      matchSet.north.indexOf(tileSet.north) >= 0 &&
      matchSet.neighbor.indexOf(tileSet.neighbor) >= 0 &&
      matchSet.south.indexOf(tileSet.south) >= 0
    ) {
      return matchSet.spriteSuffix;
    }

    return false;
  }) || '';
}

export {
  tileConfigs,
  matchTileSprite
};