import * as utils from '../utils';

export default class MenuMovement {
  AP_POINTS_REQUIRED = 5;

  constructor(menu, board) {
    this.menu = menu;
    this.board = board;
    this.character = this.menu.character;
    this.availableSpots = [];
    this.spotsDistance = [];
    this.markedSpots = [];
  }

  init(parent) {
    const li = document.createElement('li');
    li.innerHTML = 'Move';
    if (this.menu.character.ap >= this.AP_POINTS_REQUIRED) {
      li.onclick = () => {
        this.board.soundManager.play('open');
        this.menu.on('move');
      }

      li.onmouseenter = () => {
        if (this.menu.isAnimationDone) {
          this.board.soundManager.play('cursor');
        }
      }
    } else {
      li.classList.add('inactive');
    }

    li.appendChild(this._getLine());
    parent.appendChild(li);
  }

  on() {
    //
    this.board.isMoving = true;
    this.board.hover.enable();
    this.board.hover.set(this.board.findSpotById(this.character.position));
    this.menu.offEffect(() => {});
    this.menu.currentMenu = 'moving';
    let distancePossible = utils.clamp(this.character.ap - this.AP_POINTS_REQUIRED, 1, this.character.movement) + 1;
    [this.availableSpots, this.spotsDistance] = this.board.setAvailableSpots(this.character.position, distancePossible);
    this.markedPositions = this.board.markedPositions();
    this.board.hover.onMoveCb = (spot, hover) => {
      this.moveTrigger(spot, hover);
    }
    this.board.hover.onClickCb = (spot, hover) => {
      this.clickTrigger(spot, hover);
    }
  }

  off() {
    this.board.isMoving = false;
    this.board.hover.disable();
    this.menu.onEffect();
    this.menu.currentMenu = 'actions';
    this.board.clearAvailableSpots();
  }

  moveTrigger(spot, hover) {
    if (this.availableSpots.includes(spot.id) && !this.markedPositions.includes(spot.id)) {
      hover.setStyle('move');
    } else {
      hover.setStyle('block');
    }
  }

  clickTrigger(spot, hover) {
    if (this.availableSpots.includes(spot.id) && !this.markedPositions.includes(spot.id)) {
      this.menu.character.useAp(this.AP_POINTS_REQUIRED + (this.spotsDistance[spot.id] - 1));
      this.menu.character.position = spot.id;
      this.board.movePiece(this.menu.character.position, spot.id);
      this.off();
      this.menu._actionsOff();
    }
  }

  _getLine() {
    const line = document.createElement('img');
    line.src = '/images/Battle/MenuLine.png';

    return line;
  }
}
