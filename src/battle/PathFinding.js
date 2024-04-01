import BinaryHeap from './utils/BinaryHeap';

export default class PathFinding {
  constructor(board) {
    this.board = board;
  }

  init(grid) {
    for (let x = 0, xl = grid.length; x < xl; x++) {
      for (let y = 0, yl = grid[x].length; y < yl; y++) {
        let node = grid[x][y];
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.cost = 1;
        node.visited = false;
        node.closed = false;
        node.parent = null;
      }
    }
  }

  heap() {
    return new BinaryHeap(node => node.f);
  }

  search(grid, markedPositions = [], start, end) {
    this.init(grid);
    let heuristic = this.hex;

    let openHeap = this.heap();
    openHeap.push(start);

    while (openHeap.size() > 0) {

      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      let currentNode = openHeap.pop();

      // End case -- result has been found, return the traced path.
      if (currentNode === end) {
        let curr = currentNode;
        let ret = [];
        while (curr.parent) {
          ret.push(curr);
          curr = curr.parent;
        }
        return ret.reverse();
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.closed = true;

      // Find all neighbors for the current node.
      let neighbors = this.neighbors(currentNode).map(p => this.board.findSpotById(p));

      for (let i = 0, il = neighbors.length; i < il; i++) {
        let neighbor = neighbors[i];

        if (neighbor.closed || markedPositions.includes(neighbor.id)) {
          continue;
        }

        // The g score is the shortest distance from start to current node.
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
        let gScore = currentNode.g + neighbor.cost;
        let beenVisited = neighbor.visited;

        if (!beenVisited || gScore < neighbor.g) {

          // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || heuristic(neighbor.hex, end.hex);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;

          if (!beenVisited) {
            openHeap.push(neighbor);
          }
          else {
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }

    // No result was found - empty array signifies failure to find path.
    return [];
  }

  manhattan(pos0, pos1) {
    let d1 = Math.abs(pos1.x - pos0.x);
    let d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
  }

  diagonal(pos0, pos1) {
    var D = 1;
    var D2 = Math.sqrt(2);
    var d1 = Math.abs(pos1.x - pos0.x);
    var d2 = Math.abs(pos1.y - pos0.y);
    return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
  }

  hex(a, b) {
    return Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s));
  }

  neighbors(spot) {
    return this.board.getAvailablePositions(spot);
  }
}
