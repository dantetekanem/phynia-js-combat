import * as utils from './utils';

export default class RandomizerLocation {
  constructor(structure) {
    this.grid = structure.spots;
    this.side_a = structure.randomizerLocations.side_a;
    this.side_b = structure.randomizerLocations.side_b;
  }

  getSideA(markedPositions = []) {
    let position = null;

    while (!position) {
      let randomInt = utils.getRandomInt(1, 100);
      let newPosition = null;

      if (randomInt <= 3) {
        // lucky
        newPosition = this.getRandomPosition(this.grid[this.side_a.lucky]);
      } else if (randomInt <= 15) {
        // small
        newPosition = this.getRandomPosition(this.grid[this.side_a.small]);
      } else if (randomInt <= 35) {
        // medium
        newPosition = this.getRandomPosition(this.grid[this.side_a.medium]);
      } else {
        // high
        newPosition = this.getRandomPosition(this.grid[this.side_a.high]);
      }

      if (newPosition && !markedPositions.includes(newPosition)) {
        position = newPosition;
      }
    }

    return position;
  }

  getSideB(markedPositions = []) {
    let position = null;

    while (!position) {
      let randomInt = utils.getRandomInt(1, 100);
      let newPosition = null;

      if (randomInt <= 3) {
        // lucky
        newPosition = this.getRandomPosition(this.grid[this.side_b.lucky]);
      } else if (randomInt <= 15) {
        // small
        newPosition = this.getRandomPosition(this.grid[this.side_b.small]);
      } else if (randomInt <= 35) {
        // medium
        newPosition = this.getRandomPosition(this.grid[this.side_b.medium]);
      } else {
        // high
        newPosition = this.getRandomPosition(this.grid[this.side_b.high]);
      }

      if (newPosition && !markedPositions.includes(newPosition)) {
        position = newPosition;
      }
    }

    return position;
  }

  getRandomPosition(row) {
    const randomPos = row[utils.getRandomInt(0, row.length - 1)];
    return randomPos.empty ? null : randomPos.id;
  }
}
