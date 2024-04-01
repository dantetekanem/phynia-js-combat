let zoneEffects = {};
for (let i = 1; i <= 11; i++) {
  zoneEffects[`E${i}`] = {
    name: 'Strong Zone',
    img: '/images/Battle/Status/OrangeZone.png',
    description: 'Strong Zone - 1.5x',
    modifier: [['all', 'multiply', 1.5]]
  };
  zoneEffects[`F${i}`] = {
    name: 'Fierce Zone',
    img: '/images/Battle/Status/OrangeZone.png',
    description: 'Fierce Zone - 2.0x',
    modifier: [['all', 'multiply', 2.0]]
  }
  zoneEffects[`G${i}`] = {
    name: 'Strong Zone',
    img: '/images/Battle/Status/OrangeZone.png',
    description: 'Strong Zone - 1.5x',
    modifier: [['all', 'multiply', 1.5]]
  }
}

export default {
  spots: [
    // A
    [
      { empty: true },
      { x: 63, y: -2 },
      { x: 131, y: -2 },
      { x: 197, y: -2 },
      { x: 263, y: -2 },
      { x: 325, y: -2 },
      { x: 387, y: -2 },
      { x: 453, y: -2 },
      { x: 519, y: -2 },
      { x: 586, y: -2 },
      { empty: true },
    ],
    // B
    [
      { x: 28, y: 55 },
      { x: 95, y: 55 },
      { x: 162, y: 55 },
      { x: 230, y: 55 },
      { x: 295, y: 55 },
      { x: 358, y: 55 },
      { x: 419, y: 55 },
      { x: 484, y: 55 },
      { x: 551, y: 55 },
      { x: 618, y: 55 },
    ],
    // C
    [
      { x: -6, y: 111 },
      { x: 61, y: 111 },
      { x: 128, y: 111 },
      { x: 195, y: 111 },
      { x: 261, y: 111 },
      { x: 325, y: 111 },
      { x: 386, y: 111 },
      { x: 450, y: 111 },
      { x: 517, y: 111 },
      { x: 585, y: 111 },
      { x: 652, y: 111 },
    ],
    // D
    [
      { x: 28, y: 165 },
      { x: 95, y: 165 },
      { x: 162, y: 165 },
      { x: 230, y: 165 },
      { x: 295, y: 165 },
      { x: 358, y: 165 },
      { x: 419, y: 165 },
      { x: 484, y: 165 },
      { x: 551, y: 165 },
      { x: 618, y: 165 },
    ],
    // E
    [
      { x: -6, y: 221 },
      { x: 61, y: 221 },
      { x: 128, y: 221 },
      { x: 195, y: 221 },
      { x: 261, y: 221 },
      { x: 325, y: 221 },
      { x: 386, y: 221 },
      { x: 450, y: 221 },
      { x: 517, y: 221 },
      { x: 585, y: 221 },
      { x: 652, y: 221 },
    ],
    // F
    [
      { x: 28, y: 276 },
      { x: 95, y: 276 },
      { x: 162, y: 276 },
      { x: 230, y: 276 },
      { x: 295, y: 276 },
      { x: 358, y: 276 },
      { x: 419, y: 276 },
      { x: 484, y: 276 },
      { x: 551, y: 276 },
      { x: 618, y: 276 },
    ],
    // G
    [
      { x: -6, y: 331 },
      { x: 61, y: 331 },
      { x: 128, y: 331 },
      { x: 195, y: 331 },
      { x: 261, y: 331 },
      { x: 325, y: 331 },
      { x: 386, y: 331 },
      { x: 450, y: 331 },
      { x: 517, y: 331 },
      { x: 585, y: 331 },
      { x: 652, y: 331 },
    ],
    // H
    [
      { x: 28, y: 385 },
      { x: 95, y: 385 },
      { x: 162, y: 385 },
      { x: 230, y: 385 },
      { x: 295, y: 385 },
      { x: 358, y: 385 },
      { x: 419, y: 385 },
      { x: 484, y: 385 },
      { x: 551, y: 385 },
      { x: 618, y: 385 },
    ],
    // I
    [
      { x: -6, y: 441 },
      { x: 61, y: 441 },
      { x: 128, y: 441 },
      { x: 195, y: 441 },
      { x: 261, y: 441 },
      { x: 325, y: 441 },
      { x: 386, y: 441 },
      { x: 450, y: 441 },
      { x: 517, y: 441 },
      { x: 585, y: 441 },
      { x: 652, y: 441 },
    ],
    // J
    [
      { x: 28, y: 495 },
      { x: 95, y: 495 },
      { x: 162, y: 495 },
      { x: 230, y: 495 },
      { x: 295, y: 495 },
      { x: 358, y: 495 },
      { x: 419, y: 495 },
      { x: 484, y: 495 },
      { x: 551, y: 495 },
      { x: 618, y: 495 },
    ],
    // K
    [
      { empty: true },
      { x: 63, y: 550 },
      { x: 131, y: 550 },
      { x: 197, y: 550 },
      { x: 263, y: 550 },
      { x: 325, y: 550 },
      { x: 387, y: 550 },
      { x: 453, y: 550 },
      { x: 519, y: 550 },
      { x: 586, y: 550 },
      { empty: true },
    ],
  ],
  randomizerLocations: {
    side_a: {
      high: 0,
      medium: 1,
      small: 2,
      lucky: 3,
    },
    side_b: {
      high: 10,
      medium: 9,
      small: 8,
      lucky: 7,
    }
  },
  zoneEffects
};