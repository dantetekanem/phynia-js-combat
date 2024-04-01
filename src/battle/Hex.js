export default class Hex {
  constructor(q, r, lineType = 'short') {
    this.q = q;
    this.r = r;
    this.s = -q-r;
    this.lineType = lineType;
  }

  neighbor(direction) {
    if (this.lineType === 'short') {
      switch (direction) {
        case 'top-left':
          return [0, -1, 1];
        case 'top-right':
          return [1, -1, 0];
        case 'left':
          return [-1, 0, 1];
        case 'right':
          return [1, 0, -1];
        case 'bottom-left':
          return [0, 1, -1];
        case 'bottom-right':
          return [1, 1, -2];
      }
    } else {
      switch (direction) {
        case 'top-left':
          return [-1, -1, 2];
        case 'top-right':
          return [0, -1, 1];
        case 'left':
          return [-1, 0, 1];
        case 'right':
          return [1, 0, -1];
        case 'bottom-left':
          return [-1, 1, 0];
        case 'bottom-right':
          return [0, 1, -1];
      }
    }
  }

  neighbors(grid) {
    let results = [], dq, dr, ds, result;

    // top left
    [dq, dr, ds] = this.neighbor('top-left');
    if (result = this.findInGrid(grid, this.q + dq, this.r + dr, this.s + ds)) results.push(result);

    // top right
    [dq, dr, ds] = this.neighbor('top-right');
    if (result = this.findInGrid(grid, this.q + dq, this.r + dr, this.s + ds)) results.push(result);

    // left
    [dq, dr, ds] = this.neighbor('left');
    if (result = this.findInGrid(grid, this.q + dq, this.r + dr, this.s + ds)) results.push(result);

    // right
    [dq, dr, ds] = this.neighbor('right');
    if (result = this.findInGrid(grid, this.q + dq, this.r + dr, this.s + ds)) results.push(result);

    // bottom left
    [dq, dr, ds] = this.neighbor('bottom-left');
    if (result = this.findInGrid(grid, this.q + dq, this.r + dr, this.s + ds)) results.push(result);

    // bottom right
    [dq, dr, ds] = this.neighbor('bottom-right');
    if (result = this.findInGrid(grid, this.q + dq, this.r + dr, this.s + ds)) results.push(result);

    return results;
  }

  findInGrid(grid, dq, dr, ds) {
    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      for (let j = 0; j < row.length; j++) {
        const current = row[j];
        if (current.empty) continue;

        if (current.hex.q === dq && current.hex.r === dr && current.hex.s === ds) return current;
      }
    }

    return null;
  }
}
