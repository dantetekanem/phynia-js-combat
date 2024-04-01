import BoardStructure from './boards/board_one';
import RandomizerLocation from './RandomizerLocation';
import Hover from './hover';
import Menu from './menu';
import CharacterDash from './CharacterDash';
import EnemyDash from './EnemyDash';
import Damage from './damage';
import AnimationControl from './AnimationControl';
import Window from './Window';
import TurnCycle from './TurnCycle';
import anime from 'animejs';
import Pathfinding from './PathFinding';
import Hex from './Hex';
import * as utils from './utils';

export default class Board {
  LETTS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  ENABLE_DEBUG = false;

  constructor(ref, hover, canvas, soundManager, animator) {
    this.ref = ref;
    this.canvas = canvas;
    this.window = new Window(document.getElementById('turn-base'));
    this.hover = new Hover(hover, this);
    this.grid = BoardStructure.spots;
    this.menu = new Menu(this);
    this.canUseHover = false;
    this.isMoving = false;
    this.baseLine = { x: 0, y: 0 };
    this.characters = [];
    this.enemies = [];
    this.soundManager = soundManager;
    this.damage = new Damage(this.ref.parentElement);
    this.boardStructure = BoardStructure;
    this.randomizer = new RandomizerLocation(BoardStructure);
    this.animator = new AnimationControl(animator, this);
    this.turn = new TurnCycle(this);
    this.pathfinding = new Pathfinding(this);
  }

  setup() {
    for (let i = 0; i < this.grid.length; i++) {
      const row = this.grid[i];
      for (let j = 0; j < row.length; j++) {
        const column = row[j];
        column.id = `${this.LETTS[i]}${j + 1}`;
        column.rowPosition = { x: i, y: j };
        column.hex = new Hex(j - 5, i - 5, row.length === 10 ? 'short' : 'long');
        column.pos = { y: i, x: j };
        if (column.empty) {
          continue;
        }

        // spot
        let el = document.createElement('div');
        el.classList.add('spot');
        el.dataset.id = column.id;
        el.dataset.available = 'true';
        el.id = `spot_${column.id}`;
        el.style.left = `${column.x}px`;
        el.style.top = `${column.y}px`;

        // hover
        let hover = document.createElement('div');
        hover.classList.add('hover');
        if (this.ENABLE_DEBUG) {
          hover.innerHTML = column.id + '<br>' + `${column.hex.q}, ${column.hex.r}, ${column.hex.s}`;
          hover.classList.add('enable-hover-debug');
        }

        hover.onclick = () => {
          this.onClick(column);
        }
        hover.onmouseover = () => {
          this.onMove(column);
        };
        el.appendChild(hover);

        // append to board
        this.ref.appendChild(el);
      }
    }
  }

  async start() {
    await this.turn.start();
  }

  pathTo(from, to) {
    const destinyOptions = this.getAvailablePositions(to).map(p => this.findSpotById(p));
    const possiblePaths = [];

    for (const option of destinyOptions) {
      const path = this.pathfinding.search(this.grid, this.markedPositions(), from, option);
      if (path.length > 0) {
        possiblePaths.push(path);
      }
    }

    return this.closestInRange(possiblePaths);
  }

  pathToClosest(from, range) {
    const paths = range.map(p => this.pathTo(from, p));

    return this.closestInRange(paths);
  }

  closestInRange(range) {
    let lowest = range.sort((a, b) => a.length - b.length)[0];
    let lowestRange = range.filter(p => p.length === lowest.length);
    return utils.getRandomInRange(lowestRange);
  }

  clearAvailableSpots() {
    for (const spot of document.getElementsByClassName('spot')) {
      spot.classList.remove('spot-available');
      if (!spot.classList.contains('spot-marked') || !spot.classList.contains('spot-active')) {
        spot.dataset.available = 'true';
      }
    }
    this.hover._clearCanvas();
  }

  clearSpot(position) {
    const spot = document.getElementById(`spot_${position}`);
    spot.classList.remove('spot-available', 'spot-marked');
    spot.dataset.available = 'true';
    this.hover._clearCanvas();
  }

  setAvailableSpots(position, distance) {
    let [availableSpots, positionsWithDistance, markedPositions] = this.getAvailableSpotsInRange(position, distance);

    availableSpots.forEach((pos) => {
      if (!markedPositions.includes(pos)) {
        this.setSpotAsAvailable(this.findSpotById(pos));
      }
    });

    return [availableSpots, positionsWithDistance];
  }

  getAvailableSpotsInRange(position, distance) {
    let positions = [position];
    let positionsWithDistance = {};
    positionsWithDistance[position] = 0;
    let walkedPositions = [];

    for (let i = 0; i < distance; i++) {
      let newPositions = [];

      positions.forEach((pos) => {
        if (!walkedPositions.includes(pos)) {
          newPositions = newPositions.concat(this.getAvailablePositions(this.findSpotById(pos)));
          newPositions.forEach(p => {
            if (!positionsWithDistance[p]) {
              positionsWithDistance[p] = i + 1;
            }
          });
          walkedPositions.push(pos);
        }
      });

      positions = positions.concat(newPositions);
    }
    const availableSpots = [...new Set(positions)];
    const markedPositions = this.markedPositions();

    return [availableSpots, positionsWithDistance, markedPositions];
  }

  markedPositions() {
    const charactersPositions = this.characters.map(c => c.position);
    const enemiesPositions = this.enemies.map(e => e.position);

    return [...charactersPositions, ...enemiesPositions];
  }

  getAvailablePositions(spot) {
    return spot.hex.neighbors(this.grid).map(s => s.id);
  }

  setSpotAsAvailable(spot) {
    const el = document.getElementById(`spot_${spot.id}`);
    if (el.dataset.available === 'true') {
      el.classList.add('spot-available');
      el.dataset.available = 'false';
    }
  }

  onClick(spot) {
    if (this.turn.currentTurn !== 'characters') return;

    if (this.isMoving && this.menu.currentMenu.endsWith('select')) {
      return this.hover.click(spot);
    }

    if (!this.isMoving && this.getCharacter(spot.id)) {
      return this.triggerCharacterAction(spot);
    }

    if(this.isMoving && this.menu.character.position === spot.id) {
      return this.menu.back();
    }

    if (this.isMoving) {
      return this.hover.click(spot);
    }
  }

  onMove(spot) {
    if (this.menu.currentMenu === 'moving' && spot.id === this.menu?.character?.position) return;
    if (!this.canUseHover) return;
    this.hover.move(spot);
  }

  findSpotById(id) {
    for (let i = 0; i < this.grid.length; i++) {
      const row = this.grid[i];
      for (let j = 0; j < row.length; j++) {
        const column = row[j];
        
        if (column.id === id) return column;
      }
    }

    return null;
  }

  movePiece(from, to) {
    return new Promise((resolve, reject) => {
      const spotEl = document.getElementById(`spot_${from}`);
      const newSpot = document.getElementById(`spot_${to}`);
      const spotTo = this.findSpotById(to);
      const character = this.getCharacter(from) || this.getEnemy(from);
      this.setBoardEffects(character, to);
      const img = document.getElementById(`img_spot_${character.id}`);
      spotEl.classList.remove('spot-marked');
      spotEl.dataset.available = 'true';
      newSpot.classList.add('spot-marked');
      newSpot.dataset.available = 'false';
      this.soundManager.play('move');
      anime({
        targets: img,
        left: `${spotTo.x + 20}px`,
        top: `${spotTo.y + 20}px`,
        easing: 'easeOutQuint',
        duration: 600,
        complete: () => {
          character.position = to;
          resolve();
        }
      })
    })
  }

  setBoardEffects(character, spot) {
    // remove any previous board effect
    character.effects = character.effects.filter(e => e?.source !== 'board');
    // add board effect if any
    let effect;
    if (effect = this.boardStructure.zoneEffects[spot]) {
      effect.source = 'board';
      character.effects.push(effect);
    }
    // show effects
    character.dash.setEffects();
  }

  kill(id) {
    let targetGroup, target;
    target = this.getCharacterById(id);
    if (target) {
      targetGroup = 'characters';
    } else {
      target = this.getEnemyById(id);
      targetGroup = 'enemies';
    }
    if (!target.isDead) return;

    this.clearSpot(target.position);
    const piece = this.findPieceById(id);
    piece.remove();
    this[targetGroup] = this[targetGroup].filter(t => t.id !== id);
    console.log(this[targetGroup]);
    console.log(`${target.name} was killed`);
    target.checkStatus();
    target.dash.remove();
  }

  setCharacter(character) {
    character.position = this.randomizer.getSideB(this.markedPositions());
    // Build Character spot
    const spotEl = document.getElementById(`spot_${character.position}`);
    this.addPiece(character);
    spotEl.classList.add('spot-marked');
    spotEl.dataset.available = 'false';

    // Build Character dashboard
    character.dash = new CharacterDash(character);
    character.dash.build();

    // Add character to the board
    this.characters.push(character);
  }

  addPiece(character) {
    const table = document.getElementById('pieces-table');
    const spot = this.findSpotById(character.position);
    const img = document.createElement('img');
    img.src = character.avatar;
    img.id = `img_spot_${character.id}`;
    img.style.left = `${spot.x + 20}px`;
    img.style.top = `${spot.y + 20}px`;
    table.appendChild(img);
  }

  findPieceById(id) {
    return document.getElementById(`img_spot_${id}`);
  }

  getCharacter(id) {
    for (const character of this.characters) {
      if (character.position === id) return character;
    }

    return false;
  }

  getCharacterById(id) {
    for (const character of this.characters) {
      if (character.id === id) return character;
    }

    return false;
  }

  triggerCharacterAction(spot) {
    if (this.menu.currentMenu === 'hit') {
      return this.menu.back();
    }

    const character = this.getCharacter(spot.id);
    if (character.ap === 0) {
      this.soundManager.play('cancel');
      return;
    }
    this.menu.build(character);
    if (this.menu.isOn) {
      this.menu.back();
    } else {
      this.menu.on('actions', spot);
    }
  }

  setEnemy(enemy) {
    enemy.position = this.randomizer.getSideA(this.markedPositions());
    const spotEl = document.getElementById(`spot_${enemy.position}`);
    this.addPiece(enemy);
    spotEl.classList.add('spot-marked');
    spotEl.dataset.available = 'false';
    // Build Enemy dashboard
    enemy.dash = new EnemyDash(enemy);
    enemy.dash.build();

    // Add enemy to the board
    this.enemies.push(enemy);
  }

  getEnemy(id) {
    for (const enemy of this.enemies) {
      if (enemy.position === id) return enemy;
    }

    return false;
  }

  getEnemyById(id) {
    for (const enemy of this.enemies) {
      if (enemy.id === id) return enemy;
    }

    return false;
  }

  shake(duration = 0.5, xMax = 15) {
    anime({
      targets: document.getElementById('board'),
      easing: 'easeInOutSine',
      duration: 1000 * duration,
      translateX: [
        {
          value: xMax * -1,
        },
        {
          value: xMax,
        },
        {
          value: xMax / -2,
        },
        {
          value: xMax / 2,
        },
        {
          value: 0
        }
      ],
    });
  }
}
