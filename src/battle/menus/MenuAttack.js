import * as utils from '../utils';
import MenuHit from './MenuHit';
import CombatControl from '../CombatControl';

export default class MenuAttack {
  AP_POINTS_REQUIRED = 1;

  constructor(menu, board) {
    this.menu = menu;
    this.board = board;
    this.character = this.menu.character;
    this.target = null;
    this.hitBox;
    this.allowedSpots = [];
    this.hits = 1;
    this.combat = new CombatControl;
  }

  init(parent) {
    const li = document.createElement('li');
    li.innerHTML = 'Attack';
    if (this.menu.character.ap >= this.AP_POINTS_REQUIRED) {
      li.onclick = () => {
        this.board.soundManager.play('open');
        this.menu.on('attack');
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
    this.board.isMoving = true;
    this.hits = 1;
    this.board.hover.enable();
    this.board.hover.set(this.board.findSpotById(this.character.position));
    this.menu.offEffect(() => { });
    this.menu.currentMenu = 'attacking';
    [this.availableSpots, this.spotsDistance] = this.board.setAvailableSpots(this.character.position, this.character.attackRange);
    this.allowedSpots = [...this.board.characters.map(c => c.position), ...this.board.enemies.map(e => e.position)];
    this.board.hover.onMoveCb = (spot, hover) => {
      this.moveTrigger(spot, hover);
    }
    this.board.hover.onClickCb = (spot, hover) => {
      this.clickTrigger(spot, hover);
    }
  }

  off() {
    if (this.menu.currentMenu === 'hit') {
      return this.hitOff();
    }
    this.board.isMoving = false;
    this.board.hover.disable();
    this.menu.onEffect();
    this.menu.currentMenu = 'actions';
    this.board.clearAvailableSpots();
  }

  hitOff() {
    this.menu.currentMenu = 'attacking';
    this.target.dash.inactive();
    this.hitBox.off();
    this.on();
  }

  allOff() {
    this.target.dash.inactive();
    this.hitBox.off();
    this.board.isMoving = false;
    this.board.hover.disable();
    this.menu.onEffect();
    this.menu.currentMenu = 'actions';
    this.board.clearAvailableSpots();
  }

  moveTrigger(spot, hover) {
    if (this.availableSpots.includes(spot.id) && this.allowedSpots.includes(spot.id)) {
      hover.setStyle('select');
    } else {
      hover.setStyle('block');
    }
  }

  clickTrigger(spot, hover) {
    if (this.availableSpots.includes(spot.id) && this.allowedSpots.includes(spot.id)) {
      this.menu.currentMenu = 'hit';
      console.log('Spot Distance: ', this.spotsDistance[spot.id]);
      this.target = this.board.getCharacter(spot.id) || this.board.getEnemy(spot.id);
      let targetSpot = this.board.findSpotById(spot.id);
      this.hitBox = new MenuHit(this.board, this.menu, this, targetSpot);
      this.hitBox.on();
      this.target.dash.active();
      this.board.isMoving = false;
      // this.board.hover.disable();
      this.board.canUseHover = false;
      this.board.clearAvailableSpots();
    }
  }

  runHit(hit) {
    this.character.useAp(hit.apCost);

    if (!this.combat.damage(hit, this.board, this.character, this.target, this.hits)) {
      this.hitBox.build();
    }
    
    this.hits += 1;
    if (this.target.isDead) {
      this.board.kill(this.target.id);
      this.allOff();
      this.board.checkIfYouWin();
    } else {
      this.hitBox.build();
    }
  }

  randomDamage() {
    for (const enemy of this.board.enemies) {
      let enemySpot = this.board.findSpotById(enemy.position);
      let damage = utils.getRandomInt(1, 1050);
      this.board.damage.show(enemySpot, damage, utils.getRandomInt(0, 6));
      this.board.animator.play('simple attack', enemySpot);
      let newHp = utils.getRandomInt(1, 100)
      let newMp = utils.getRandomInt(1, 100)
      enemy.dash.updateHP(newHp);
      enemy.dash.updateMP(newMp);
      enemy.hp = newHp;
      enemy.mp = newMp;
    }
  }

  getRandomEnemy() {
    return this.board.enemies[utils.getRandomInt(0, this.board.enemies.length - 1)];
  }

  _getLine() {
    const line = document.createElement('img');
    line.src = '/images/Battle/MenuLine.png';

    return line;
  }
}
