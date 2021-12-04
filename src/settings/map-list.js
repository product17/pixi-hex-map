let counter = 0;
function buildMap (width, height, name) {
  counter++;
  const map = [];
  for (let i = 0; i < height; i++) {
    const frontShift = Math.floor(((height - i - 1) / 2));
    const backShift = Math.floor(i / 2);
    map.push([]);

    for (let j = 0; j < frontShift; j++) {
      map[i].push(null);
    }

    for (let k = 0; k < width; k++) {
      map[i].push({
        type: 'water',
      });
    }

    for (let l = 0; l < backShift; l++) {
      map[i].push(null);
    }
  }

  return {
    id: counter,
    map,
    name,
  }
};

export const level1 = buildMap(5, 3, 'level 1');
export const level2 = buildMap(6, 4, 'level 2');